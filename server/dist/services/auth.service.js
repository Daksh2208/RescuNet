import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../utils/hash.js";
import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import bcrypt from "bcryptjs";
import { comparePassword } from "../utils/hash.js";
import { generateAccessToken, generateRefreshToken, } from "../utils/jwt.js";
export const registerUser = async (data) => {
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
    const allowedRoles = [
        UserRole.CITIZEN,
        UserRole.VOLUNTEER,
        UserRole.RESCUE,
    ];
    if (data.role !== UserRole.CITIZEN &&
        data.role !== UserRole.VOLUNTEER &&
        data.role !== UserRole.RESCUE) {
        throw new Error("Invalid registration role");
    }
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
        data: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            role: data.role,
            isVerified: data.role === UserRole.CITIZEN || data.role === UserRole.VOLUNTEER,
            isActive: true,
        },
    });
    const { password, ...safeUser } = user;
    return safeUser;
};
export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPasswordCorrect = await comparePassword(password, user.password);
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
export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token missing");
    }
    jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const tokenInDb = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken,
        },
        include: {
            user: true,
        },
    });
    if (!tokenInDb || !tokenInDb.user) {
        throw new Error("Invalid refresh token");
    }
    if (new Date() > tokenInDb.expiresAt) {
        await prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(() => { });
        throw new Error("Refresh token expired");
    }
    const accessToken = generateAccessToken({
        id: tokenInDb.user.id,
        role: tokenInDb.user.role,
        email: tokenInDb.user.email,
    });
    return accessToken;
};
export const getCurrentUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            isVerified: true,
            isActive: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
export const registerAdmin = async (data) => {
    if (!data.adminKey) {
        throw new Error("Admin registration key is required");
    }
    if (data.adminKey !== env.ADMIN_REGISTRATION_KEY) {
        throw new Error("Invalid admin registration key");
    }
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: data.email },
                { phone: data.phone },
            ],
        },
    });
    if (existingUser) {
        if (existingUser.email === data.email) {
            throw new Error("Email is already registered");
        }
        throw new Error("Phone number is already registered");
    }
    if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const admin = await prisma.user.create({
        data: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            role: "ADMIN",
            isVerified: true,
            isActive: true,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            isVerified: true,
            isActive: true,
            createdAt: true,
        },
    });
    return admin;
};
//# sourceMappingURL=auth.service.js.map