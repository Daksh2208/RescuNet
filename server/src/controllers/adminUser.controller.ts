import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
    getPendingUsers,
    approveUser,
    rejectUser,
    getActivePersonnel,
    getCitizens,
    deactivateUser,
    activateUser,
} from "../services/adminUser.service.js";

export const pendingUsers = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const users = await getPendingUsers();

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Get pending users error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending users",
        });
    }
};

export const approveUserController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const id = req.params.id as string;

        const user = await approveUser(id);

        return res.status(200).json({
            success: true,
            message: "User approved successfully",
            data: user,
        });
    } catch (error) {
        console.error("Approve user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to approve user",
        });
    }
};

export const rejectUserController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const id = req.params.id as string;

        const user = await rejectUser(id);

        return res.status(200).json({
            success: true,
            message: "User rejected successfully",
            data: user,
        });
    } catch (error) {
        console.error("Reject user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reject user",
        });
    }
};

export const activePersonnel = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const users = await getActivePersonnel();

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Get active personnel error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch active personnel",
        });
    }
};

export const citizens = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const users = await getCitizens();

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Get citizens error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch citizens",
        });
    }
};

export const deactivateUserController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const id = req.params.id as string;

        const user = await deactivateUser(id);

        return res.status(200).json({
            success: true,
            message: "User deactivated successfully",
            data: user,
        });
    } catch (error) {
        console.error("Deactivate user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to deactivate user",
        });
    }
};

export const activateUserController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const id = req.params.id as string;

        const user = await activateUser(id);

        return res.status(200).json({
            success: true,
            message: "User activated successfully",
            data: user,
        });
    } catch (error) {
        console.error("Activate user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to activate user",
        });
    }
};