import { prisma } from "../config/prisma.js";
import { createAuditLog } from "./auditLog.service.js";

export const getPendingIncidents = async () => {
  return prisma.incident.findMany({
    where: {
      status: "PENDING",
    },
    select: {
      id: true,
      title: true,
      description: true,
      disasterType: true,
      severity: true,
      status: true,
      latitude: true,
      longitude: true,
      address: true,
      createdAt: true,

      reportedBy: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },

      aiAnalysis: {
        select: {
          priority: true,
          summary: true,
          recommendation: true,
          aiResponse: true,
        },
      },

      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
    orderBy: [
      {
        severity: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
};

export const getVerifiedIncidents = async () => {
  return prisma.incident.findMany({
    where: {
      status: {
        in: ["VERIFIED", "ASSIGNED", "IN_PROGRESS"],
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      disasterType: true,
      severity: true,
      status: true,
      latitude: true,
      longitude: true,
      address: true,
      createdAt: true,
      updatedAt: true,

      reportedBy: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },

      verifiedBy: {
        select: {
          id: true,
          fullName: true,
        },
      },

      assignments: {
        select: {
          id: true,
          status: true,
          assignedAt: true,
          acceptedAt: true,
          completedAt: true,

          rescueTeam: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const verifyIncident = async (
  incidentId: string,
  adminId: string
) => {
  const incident = await prisma.incident.findUnique({
    where: {
      id: incidentId,
    },
  });

  if (!incident) {
    throw new Error("Incident not found");
  }

  if (incident.status !== "PENDING") {
    throw new Error(
      "Only pending incidents can be verified"
    );
  }

  const updatedIncident = await prisma.incident.update({
    where: {
      id: incidentId,
    },
    data: {
      status: "VERIFIED",
      verifiedById: adminId,
    },
    select: {
      id: true,
      title: true,
      status: true,
      severity: true,
      disasterType: true,
      verifiedBy: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  await createAuditLog({
    adminId,
    action: "INCIDENT_VERIFIED",
    details: `Verified incident "${updatedIncident.title}" (${updatedIncident.id}).`,
  });

  return updatedIncident;
};

export const rejectIncident = async (
  incidentId: string,
  adminId: string
) => {
  const incident = await prisma.incident.findUnique({
    where: {
      id: incidentId,
    },
  });

  if (!incident) {
    throw new Error("Incident not found");
  }

  if (incident.status !== "PENDING") {
    throw new Error(
      "Only pending incidents can be rejected"
    );
  }

   const updatedIncident =
    await prisma.incident.update({
      where: {
        id: incidentId,
      },
      data: {
        status: "REJECTED",
        verifiedById: adminId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        severity: true,
        disasterType: true,
        verifiedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

  await createAuditLog({
    adminId,
    action: "INCIDENT_REJECTED",
    details: `Rejected incident "${updatedIncident.title}" (${updatedIncident.id}).`,
  });


  return updatedIncident;
};