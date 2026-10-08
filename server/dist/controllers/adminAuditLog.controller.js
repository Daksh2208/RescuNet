import { getAuditLogs, } from "../services/auditLog.service.js";
export const getAuditLogsController = async (req, res) => {
    try {
        const logs = await getAuditLogs();
        return res.status(200).json({
            success: true,
            data: logs,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch audit logs",
        });
    }
};
//# sourceMappingURL=adminAuditLog.controller.js.map