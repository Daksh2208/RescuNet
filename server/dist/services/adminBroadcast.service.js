import { prisma } from "../config/prisma.js";
import { createAuditLog } from "./auditLog.service.js";
export const sendBroadcast = async (data) => {
    const message = data.message.trim();
    if (!message) {
        throw new Error("Broadcast message is required");
    }
    if (message.length > 250) {
        throw new Error("Broadcast message cannot exceed 250 characters");
    }
    if (!data.roles || data.roles.length === 0) {
        throw new Error("Select at least one target audience");
    }
    const validRoles = [
        "CITIZEN",
        "VOLUNTEER",
        "RESCUE",
    ];
    const invalidRole = data.roles.find((role) => !validRoles.includes(role));
    if (invalidRole) {
        throw new Error("Invalid target audience");
    }
    const titleMap = {
        CRITICAL: "🚨 Critical Emergency Alert",
        WARNING: "⚠️ Emergency Warning",
        INFO: "Emergency Information",
    };
    const title = titleMap[data.severity];
    const users = await prisma.user.findMany({
        where: {
            role: {
                in: data.roles,
            },
            isActive: true,
        },
        select: {
            id: true,
        },
    });
    if (users.length === 0) {
        throw new Error("No active users found for the selected audience");
    }
    const notifications = users.map((user) => ({
        title,
        message,
        userId: user.id,
    }));
    const result = await prisma.notification.createMany({
        data: notifications,
    });
    await createAuditLog({
        adminId: data.adminId,
        action: "EMERGENCY_BROADCAST_TRIGGERED",
        details: `Broadcasted "${data.severity}" message to ${result.count} users.`,
        metadata: {
            severity: data.severity,
            roles: data.roles,
            recipientCount: result.count,
        },
    });
    return {
        recipientCount: result.count,
        severity: data.severity,
        roles: data.roles,
        title,
        message,
    };
};
//# sourceMappingURL=adminBroadcast.service.js.map