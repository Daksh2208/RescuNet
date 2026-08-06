import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
     user?: {
        id: string;
        role: string;
        email: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        req.user = jwt.verify(
            token,
            env.JWT_ACCESS_SECRET
        ) as {
            id: string;
            role: string;
            email: string;
        };

        next();

    } catch {

        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });

    }

};