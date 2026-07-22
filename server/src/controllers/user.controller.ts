import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../config/prisma.js";

export const me = async (
    req: AuthRequest,
    res: Response
) => {

    const id = req.user.id;

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
        },
    });

    res.json({
        success: true,
        user,
    });

};