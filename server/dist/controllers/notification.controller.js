import { getUserNotifications, markNotificationAsRead, } from "../services/notification.service.js";
export const getNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const notifications = await getUserNotifications(req.user.id);
        return res.status(200).json({
            success: true,
            data: notifications,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch notifications",
        });
    }
};
export const markNotificationAsReadController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const notificationId = req.params.id;
        const notification = await markNotificationAsRead(notificationId, req.user.id);
        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    }
    catch (error) {
        console.error(error);
        const message = error instanceof Error
            ? error.message
            : "Failed to mark notification as read";
        if (message === "Notification not found") {
            return res.status(404).json({
                success: false,
                message,
            });
        }
        if (message === "Unauthorized") {
            return res.status(403).json({
                success: false,
                message,
            });
        }
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
//# sourceMappingURL=notification.controller.js.map