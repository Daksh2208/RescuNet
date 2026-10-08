import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        req.user = jwt.verify(token, env.JWT_ACCESS_SECRET);
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