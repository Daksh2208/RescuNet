export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    if (req.user.role?.toUpperCase() !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Admin access required. Current role: " + (req.user.role || "unknown"),
        });
    }
    next();
};
//# sourceMappingURL=admin.middleware.js.map