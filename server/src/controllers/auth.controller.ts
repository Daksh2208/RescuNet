import type { Request, Response } from "express";
import { refreshAccessToken, registerUser } from "../services/auth.service.js";
import { loginUser } from "../services/auth.service.js";
import { prisma } from "../config/prisma.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";


export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: user
    });
  }
  catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error,
      message: error instanceof Error ? error.message : "Registration failed",
      stack: error instanceof Error ? error.stack : null,
    });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: false, // true after deployment
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: data.user,
      accessToken: data.accessToken,
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });

  }
};

export const logout = async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {

        await prisma.refreshToken.deleteMany({
            where: {
                token: refreshToken,
            },
        });

    }

    res.clearCookie("refreshToken");

    res.json({
        success: true,
        message: "Logged out",
    });

};

export const me = async (
  req: AuthRequest,
  res: Response
) => {

  const user = await prisma.user.findUnique({

    where: {
      id: req.user!.id,
    },

    select: {

      id: true,
      fullName: true,
      email: true,
      role: true,

    },

  });

  return res.json({

    success: true,
    user,

  });

};


export const refresh = async (
    req: Request,
    res: Response
) => {

    try {

        const refreshToken = req.cookies.refreshToken;

        const accessToken = await refreshAccessToken(refreshToken);

        return res.json({
            success: true,
            accessToken,
        });

    }
    catch {

        return res.status(401).json({
            success: false,
            message: "Session expired",
        });

    }

};