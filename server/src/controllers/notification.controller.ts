import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service.js";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const notifications = await getUserNotifications(userId);
    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notifications",
    });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    await markNotificationAsRead(id as string, userId);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notification",
    });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await markAllNotificationsAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notifications",
    });
  }
};
