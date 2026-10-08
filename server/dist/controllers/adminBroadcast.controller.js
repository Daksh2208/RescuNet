import { sendBroadcast, } from "../services/adminBroadcast.service.js";
export const sendBroadcastController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const { message, severity, roles, } = req.body;
        const result = await sendBroadcast({
            adminId: req.user.id,
            message,
            severity,
            roles,
        });
        return res.status(201).json({
            success: true,
            message: "Broadcast sent successfully",
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to send broadcast",
        });
    }
};
//# sourceMappingURL=adminBroadcast.controller.js.map