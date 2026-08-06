import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../utils/hash.js";
import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

import { comparePassword } from "../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";


interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export const registerUser = async (data: RegisterData) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { phone: data.phone }
      ]
    }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Prevent public creation of privileged accounts
  const allowedRole =
    data.role === UserRole.CITIZEN ||
      data.role === UserRole.VOLUNTEER
      ? data.role
      : UserRole.CITIZEN;

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: allowedRole,
    },
  });

  const { password, ...safeUser } = user;

  return safeUser;

};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Account has been disabled");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiry,
    },
  });

  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {

    if (!refreshToken) {
        throw new Error("Refresh token missing");
    }

    const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
    ) as {
        id: string;
    };

    const tokenInDb = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken,
        },
    });

    if (!tokenInDb) {
        throw new Error("Invalid refresh token");
    }

    const accessToken = jwt.sign(
        {
            id: decoded.id,
        },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
        }
    );

    return accessToken;
};