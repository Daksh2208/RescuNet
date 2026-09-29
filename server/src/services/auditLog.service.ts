import { prisma } from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export const createAuditLog = async (data: {
  adminId: string;
  action: string;
  details: string;
  ipAddress?: string;
  metadata?: Prisma.InputJsonValue;
}) => {
  return prisma.auditLog.create({
    data: {
      adminId: data.adminId,
      action: data.action,
      details: data.details,
      ipAddress: data.ipAddress,
      metadata: data.metadata,
    },
  });
};

export const getAuditLogs = async () => {
  return prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      action: true,
      details: true,
      ipAddress: true,
      metadata: true,
      createdAt: true,

      admin: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
};