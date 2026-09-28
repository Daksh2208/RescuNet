import { prisma } from "../config/prisma.js";

type BroadcastSeverity =
  | "CRITICAL"
  | "WARNING"
  | "INFO";

type BroadcastRole =
  | "CITIZEN"
  | "VOLUNTEER"
  | "RESCUE";

export const sendBroadcast = async (data: {
  message: string;
  severity: BroadcastSeverity;
  roles: BroadcastRole[];
}) => {
  const message = data.message.trim();

  if (!message) {
    throw new Error("Broadcast message is required");
  }

  if (message.length > 250) {
    throw new Error(
      "Broadcast message cannot exceed 250 characters"
    );
  }

  if (!data.roles || data.roles.length === 0) {
    throw new Error(
      "Select at least one target audience"
    );
  }

  const validRoles: BroadcastRole[] = [
    "CITIZEN",
    "VOLUNTEER",
    "RESCUE",
  ];

  const invalidRole = data.roles.find(
    (role) => !validRoles.includes(role)
  );

  if (invalidRole) {
    throw new Error("Invalid target audience");
  }

  const titleMap: Record<
    BroadcastSeverity,
    string
  > = {
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
    throw new Error(
      "No active users found for the selected audience"
    );
  }

  const notifications = users.map((user) => ({
    title,
    message,
    userId: user.id,
  }));

  const result = await prisma.notification.createMany({
    data: notifications,
  });

  return {
    recipientCount: result.count,
    severity: data.severity,
    roles: data.roles,
    title,
    message,
  };
};