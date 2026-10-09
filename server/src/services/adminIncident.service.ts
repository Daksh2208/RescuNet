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
      target: true,
      reporterName: true,
      reporterPhone: true,

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
      target: true,
      reporterName: true,
      reporterPhone: true,

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

export const getRescuePersonnelWithWorkload = async () => {
  const rescueUsers = await prisma.user.findMany({
    where: {
      role: "RESCUE",
      isVerified: true,
      isActive: true,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      rescueAssignments: {
        where: {
          status: {
            in: ["PENDING", "ACCEPTED"],
          },
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      fullName: "asc",
    },
  });

  return rescueUsers.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    activeMissionsCount: u.rescueAssignments.length,
  }));
};

export const assignIncident = async (
  incidentId: string,
  rescueTeamId: string,
  adminId: string
) => {
  console.log(`[DISPATCH] Processing assignment: incidentId=${incidentId}, rescueTeamId=${rescueTeamId}, adminId=${adminId}`);

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
  });

  if (!incident) {
    throw new Error("Incident not found in database");
  }

  if (incident.status === "REJECTED") {
    throw new Error("Cannot assign a rejected incident");
  }

  if (incident.status === "RESOLVED") {
    throw new Error("Incident is already resolved");
  }

  const rescueUser = await prisma.user.findUnique({
    where: {
      id: rescueTeamId,
    },
  });

  if (!rescueUser) {
    throw new Error("Selected rescue officer not found");
  }

  // Check if an active assignment already exists for this team & incident
  const existingActive = await prisma.assignment.findFirst({
    where: {
      incidentId,
      rescueTeamId,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
    include: {
      rescueTeam: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
        },
      },
      incident: {
        select: {
          id: true,
          title: true,
          severity: true,
          disasterType: true,
          address: true,
        },
      },
    },
  });

  if (existingActive) {
    return existingActive;
  }

  // Create the assignment
  const assignment = await prisma.assignment.create({
    data: {
      incidentId,
      rescueTeamId,
      assignedById: adminId,
      status: "PENDING",
    },
    include: {
      rescueTeam: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
        },
      },
      incident: {
        select: {
          id: true,
          title: true,
          severity: true,
          disasterType: true,
          address: true,
        },
      },
    },
  });

  // Update incident status to ASSIGNED if currently PENDING or VERIFIED
  if (incident.status === "PENDING" || incident.status === "VERIFIED") {
    await prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: "ASSIGNED",
        verifiedById: incident.verifiedById || adminId,
      },
    });
  }

  // Send notification to the rescue officer (safe catch)
  try {
    await prisma.notification.create({
      data: {
        userId: rescueTeamId,
        title: "🚨 Emergency Mission Assigned",
        message: `You have been dispatched to: "${incident.title}" (${incident.address || incident.disasterType}). Open your Rescue Dashboard to accept.`,
      },
    });
  } catch (notifErr) {
    console.warn("Failed to create dispatch notification:", notifErr);
  }

  // Audit log (safe catch)
  try {
    await createAuditLog({
      adminId,
      action: "INCIDENT_DISPATCHED",
      details: `Dispatched incident "${incident.title}" (${incident.id}) to Rescue Officer "${rescueUser.fullName}" (${rescueUser.id}).`,
    });
  } catch (auditErr) {
    console.warn("Failed to create dispatch audit log:", auditErr);
  }

  return assignment;
};