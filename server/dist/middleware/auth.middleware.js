import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }
        if (!decoded.role) {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, role: true, email: true, isActive: true },
            });
            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: "User not found or inactive",
                });
            }
            req.user = {
                id: user.id,
                role: user.role,
                email: user.email,
            };
        }
        else {
            req.user = {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email || "",
            };
        }
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
//# sourceMappingURL=auth.middleware.js.map