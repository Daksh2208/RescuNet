import { UserRole } from "@prisma/client";
export const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Forbidden"
        });
    }
    next();
};
//# sourceMappingURL=role.middleware.js.map