import { getPendingUsers, approveUser, rejectUser, getActivePersonnel, getCitizens, deactivateUser, activateUser, } from "../services/adminUser.service.js";
import { createAuditLog } from "../services/auditLog.service.js";
export const pendingUsers = async (req, res) => {
    try {
        const users = await getPendingUsers();
        return res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.error("Get pending users error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending users",
        });
    }
};
export const approveUserController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const id = req.params.id;
        const user = await approveUser(id);
        await createAuditLog({
            adminId: req.user.id,
            action: "USER_APPROVED",
            details: `Approved ${user.role} user "${user.fullName}" (${user.id}).`,
        });
        return res.status(200).json({
            success: true,
            message: "User approved successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Approve user error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve user",
        });
    }
};
export const rejectUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await rejectUser(id);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await createAuditLog({
            adminId: req.user.id,
            action: "USER_REJECTED",
            details: `Rejected ${user.role} user "${user.fullName}" (${user.id}).`,
        });
        return res.status(200).json({
            success: true,
            message: "User rejected successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Reject user error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject user",
        });
    }
};
export const activePersonnel = async (req, res) => {
    try {
        const users = await getActivePersonnel();
        return res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.error("Get active personnel error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch active personnel",
        });
    }
};
export const citizens = async (req, res) => {
    try {
        const users = await getCitizens();
        return res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.error("Get citizens error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch citizens",
        });
    }
};
export const deactivateUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await deactivateUser(id);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await createAuditLog({
            adminId: req.user.id,
            action: "USER_DEACTIVATED",
            details: `Deactivated ${user.role} user "${user.fullName}" (${user.id}).`,
        });
        return res.status(200).json({
            success: true,
            message: "User deactivated successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Deactivate user error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to deactivate user",
        });
    }
};
export const activateUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await activateUser(id);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await createAuditLog({
            adminId: req.user.id,
            action: "USER_ACTIVATED",
            details: `Activated ${user.role} user "${user.fullName}" (${user.id}).`,
        });
        return res.status(200).json({
            success: true,
            message: "User activated successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Activate user error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to activate user",
        });
    }
};
//# sourceMappingURL=adminUser.controller.js.map