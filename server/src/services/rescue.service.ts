import { prisma } from "../config/prisma.js";
import {
  AssignmentStatus,
  IncidentStatus,
  FleetAssetType,
  FleetAssetStatus,
  ReportStatus,
} from "@prisma/client";

// ──────────────────────────────────────────────
// DASHBOARD
// ──────────────────────────────────────────────

export const getRescueDashboard = async (userId: string) => {
  const [
    activeAssignments,
    completedCount,
    totalIncidents,
    recentNotifications,
  ] = await Promise.all([
    // Active missions assigned to this rescue user
    prisma.assignment.findMany({
      where: {
        rescueTeamId: userId,
        status: { in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED] },
      },
      include: {
        incident: {
          select: {
            id: true,
            title: true,
            disasterType: true,
            severity: true,
            status: true,
            latitude: true,
            longitude: true,
            address: true,
            createdAt: true,
          },
        },
        assignedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { assignedAt: "desc" },
      take: 5,
    }),

    // Completed missions count
    prisma.assignment.count({
      where: {
        rescueTeamId: userId,
        status: AssignmentStatus.COMPLETED,
      },
    }),

    // Total active incidents in the system
    prisma.incident.count({
      where: {
        status: {
          in: [
            IncidentStatus.PENDING,
            IncidentStatus.VERIFIED,
            IncidentStatus.ASSIGNED,
            IncidentStatus.IN_PROGRESS,
          ],
        },
      },
    }),

    // Recent notifications for this user
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    activeMissions: activeAssignments,
    activeMissionCount: activeAssignments.length,
    completedMissionCount: completedCount,
    totalActiveIncidents: totalIncidents,
    recentNotifications,
  };
};

// ──────────────────────────────────────────────
// MISSIONS (Assignments)
// ──────────────────────────────────────────────

const assignmentInclude = {
  incident: {
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
      images: {
        select: { id: true, imageUrl: true },
      },
    },
  },
  assignedBy: {
    select: { id: true, fullName: true },
  },
  rescueTeam: {
    select: { id: true, fullName: true, phone: true },
  },
};

export const getActiveAssignments = async (userId: string) => {
  return prisma.assignment.findMany({
    where: {
      rescueTeamId: userId,
      status: { in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED] },
    },
    include: assignmentInclude,
    orderBy: { assignedAt: "desc" },
  });
};

export const getCompletedAssignments = async (userId: string) => {
  return prisma.assignment.findMany({
    where: {
      rescueTeamId: userId,
      status: AssignmentStatus.COMPLETED,
    },
    include: assignmentInclude,
    orderBy: { completedAt: "desc" },
  });
};

export const getAssignmentById = async (
  assignmentId: string,
  userId: string
) => {
  const assignment = await prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      rescueTeamId: userId,
    },
    include: assignmentInclude,
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return assignment;
};

export const acceptAssignment = async (
  assignmentId: string,
  userId: string
) => {
  const assignment = await prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      rescueTeamId: userId,
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (assignment.status !== AssignmentStatus.PENDING) {
    throw new Error("Assignment has already been accepted or completed");
  }

  const updated = await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      status: AssignmentStatus.ACCEPTED,
      acceptedAt: new Date(),
    },
    include: assignmentInclude,
  });

  // Also update the incident status to IN_PROGRESS
  await prisma.incident.update({
    where: { id: assignment.incidentId },
    data: { status: IncidentStatus.IN_PROGRESS },
  });

  return updated;
};

export const completeAssignment = async (
  assignmentId: string,
  userId: string
) => {
  const assignment = await prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      rescueTeamId: userId,
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (assignment.status === AssignmentStatus.COMPLETED) {
    throw new Error("Assignment is already completed");
  }

  const updated = await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      status: AssignmentStatus.COMPLETED,
      completedAt: new Date(),
    },
    include: assignmentInclude,
  });

  // Check if all assignments for this incident are completed
  const remainingActive = await prisma.assignment.count({
    where: {
      incidentId: assignment.incidentId,
      status: { not: AssignmentStatus.COMPLETED },
    },
  });

  if (remainingActive === 0) {
    await prisma.incident.update({
      where: { id: assignment.incidentId },
      data: { status: IncidentStatus.RESOLVED },
    });
  }

  return updated;
};

// ──────────────────────────────────────────────
// COMMS — Channels & Messages
// ──────────────────────────────────────────────

export const getCommsChannels = async () => {
  const channels = await prisma.rescueCommsChannel.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { messages: true },
      },
    },
  });

  return channels;
};

export const createCommsChannel = async (name: string) => {
  return prisma.rescueCommsChannel.create({
    data: { name },
  });
};

export const getChannelMessages = async (
  channelId: string,
  limit: number = 50,
  before?: string
) => {
  const channel = await prisma.rescueCommsChannel.findUnique({
    where: { id: channelId },
  });

  if (!channel) {
    throw new Error("Channel not found");
  }

  const messages = await prisma.rescueCommsMessage.findMany({
    where: {
      channelId,
      ...(before ? { createdAt: { lt: new Date(before) } } : {}),
    },
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return { channel, messages };
};

export const sendCommsMessage = async (
  channelId: string,
  senderId: string,
  text: string
) => {
  const channel = await prisma.rescueCommsChannel.findUnique({
    where: { id: channelId },
  });

  if (!channel) {
    throw new Error("Channel not found");
  }

  return prisma.rescueCommsMessage.create({
    data: {
      text,
      channelId,
      senderId,
    },
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          role: true,
        },
      },
    },
  });
};

// ──────────────────────────────────────────────
// FLEET & EQUIPMENT
// ──────────────────────────────────────────────

export interface CreateFleetAssetDTO {
  name: string;
  assetCode: string;
  type?: FleetAssetType;
  location: string;
  latitude?: number;
  longitude?: number;
  lastService?: string;
  notes?: string;
}

export const getFleetAssets = async (
  status?: string,
  search?: string
) => {
  let statusFilter: FleetAssetStatus | undefined;

  if (
    status === "AVAILABLE" ||
    status === "DEPLOYED" ||
    status === "MAINTENANCE" ||
    status === "DECOMMISSIONED"
  ) {
    statusFilter = status as FleetAssetStatus;
  }

  return prisma.fleetAsset.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { assetCode: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getFleetAssetById = async (id: string) => {
  const asset = await prisma.fleetAsset.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
    },
  });

  if (!asset) {
    throw new Error("Fleet asset not found");
  }

  return asset;
};

export const createFleetAsset = async (data: CreateFleetAssetDTO) => {
  return prisma.fleetAsset.create({
    data: {
      name: data.name,
      assetCode: data.assetCode,
      type: data.type || FleetAssetType.VEHICLE,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      lastService: data.lastService ? new Date(data.lastService) : null,
      notes: data.notes,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
    },
  });
};

export const updateFleetAsset = async (
  id: string,
  data: {
    status?: FleetAssetStatus;
    assignedToId?: string | null;
    location?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
    lastService?: string;
  }
) => {
  const asset = await prisma.fleetAsset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new Error("Fleet asset not found");
  }

  return prisma.fleetAsset.update({
    where: { id },
    data: {
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.assignedToId !== undefined
        ? { assignedToId: data.assignedToId }
        : {}),
      ...(data.location ? { location: data.location } : {}),
      ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
      ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
      ...(data.lastService
        ? { lastService: new Date(data.lastService) }
        : {}),
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
    },
  });
};

// ──────────────────────────────────────────────
// MAP DATA AGGREGATION
// ──────────────────────────────────────────────

export const getMapData = async () => {
  const [incidents, shelters, rescueUnits] = await Promise.all([
    // Active incidents with geo data
    prisma.incident.findMany({
      where: {
        status: {
          in: [
            IncidentStatus.PENDING,
            IncidentStatus.VERIFIED,
            IncidentStatus.ASSIGNED,
            IncidentStatus.IN_PROGRESS,
          ],
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
        images: {
          select: { id: true, imageUrl: true },
        },
        reportedBy: {
          select: { id: true, fullName: true, phone: true },
        },
        assignments: {
          select: {
            id: true,
            status: true,
            rescueTeam: {
              select: { id: true, fullName: true, phone: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    // All shelters with geo data
    prisma.shelter.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        latitude: true,
        longitude: true,
        address: true,
        contactNumber: true,
        capacity: true,
        occupied: true,
      },
    }),

    // Rescue users (deployed units)
    prisma.user.findMany({
      where: { role: "RESCUE", isActive: true },
      select: {
        id: true,
        fullName: true,
        phone: true,
        rescueAssignments: {
          where: {
            status: {
              in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED],
            },
          },
          select: {
            id: true,
            status: true,
            incident: {
              select: {
                latitude: true,
                longitude: true,
                address: true,
              },
            },
          },
          take: 1,
          orderBy: { assignedAt: "desc" },
        },
      },
    }),
  ]);

  return { incidents, shelters, rescueUnits };
};

// ──────────────────────────────────────────────
// PROTOCOLS (SafetyGuideline)
// ──────────────────────────────────────────────

export const getProtocols = async (disasterType?: string) => {
  return prisma.safetyGuideline.findMany({
    where: disasterType
      ? { disasterType: disasterType as any }
      : {},
    orderBy: { disasterType: "asc" },
  });
};

export const getProtocolById = async (id: string) => {
  const protocol = await prisma.safetyGuideline.findUnique({
    where: { id },
  });

  if (!protocol) {
    throw new Error("Protocol not found");
  }

  return protocol;
};

// ──────────────────────────────────────────────
// AFTER-ACTION REPORTS
// ──────────────────────────────────────────────

export interface CreateActionReportDTO {
  missionId?: string;
  title: string;
  summary: string;
  hazardNotes?: string;
  totalRescued?: number;
  casualties?: number;
  animalsRescued?: number;
  assetsLost?: number;
}

export const getActionReports = async (
  userId: string,
  status?: string
) => {
  let statusFilter: ReportStatus | undefined;

  if (
    status === "PENDING_REVIEW" ||
    status === "APPROVED" ||
    status === "REJECTED"
  ) {
    statusFilter = status as ReportStatus;
  }

  return prisma.actionReport.findMany({
    where: {
      filedById: userId,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    include: {
      filedBy: {
        select: { id: true, fullName: true },
      },
      assignment: {
        select: {
          id: true,
          incident: {
            select: {
              id: true,
              title: true,
              disasterType: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getActionReportById = async (
  reportId: string,
  userId: string
) => {
  const report = await prisma.actionReport.findFirst({
    where: {
      id: reportId,
      filedById: userId,
    },
    include: {
      filedBy: {
        select: { id: true, fullName: true },
      },
      assignment: {
        select: {
          id: true,
          incident: {
            select: {
              id: true,
              title: true,
              disasterType: true,
              severity: true,
              address: true,
            },
          },
        },
      },
    },
  });

  if (!report) {
    throw new Error("Report not found");
  }

  return report;
};

export const createActionReport = async (
  data: CreateActionReportDTO,
  userId: string
) => {
  // If missionId is provided, validate it belongs to this user
  if (data.missionId) {
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: data.missionId,
        rescueTeamId: userId,
      },
    });

    if (!assignment) {
      throw new Error(
        "Assignment not found or does not belong to your team"
      );
    }
  }

  return prisma.actionReport.create({
    data: {
      title: data.title,
      summary: data.summary,
      hazardNotes: data.hazardNotes,
      totalRescued: data.totalRescued ?? 0,
      casualties: data.casualties ?? 0,
      animalsRescued: data.animalsRescued ?? 0,
      assetsLost: data.assetsLost ?? 0,
      missionId: data.missionId || null,
      filedById: userId,
    },
    include: {
      filedBy: {
        select: { id: true, fullName: true },
      },
      assignment: {
        select: {
          id: true,
          incident: {
            select: {
              id: true,
              title: true,
              disasterType: true,
            },
          },
        },
      },
    },
  });
};

export const reviewActionReport = async (
  reportId: string,
  status: ReportStatus
) => {
  const report = await prisma.actionReport.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new Error("Report not found");
  }

  if (report.status !== ReportStatus.PENDING_REVIEW) {
    throw new Error("Report has already been reviewed");
  }

  return prisma.actionReport.update({
    where: { id: reportId },
    data: { status },
    include: {
      filedBy: {
        select: { id: true, fullName: true },
      },
    },
  });
};

// ──────────────────────────────────────────────
// DISPATCHER — Rescue-specific task queries
// ──────────────────────────────────────────────

export const getRescueCreatedTasks = async () => {
  return prisma.volunteerTask.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      claimedBy: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
    },
  });
};

export const cancelVolunteerTask = async (taskId: string) => {
  const task = await prisma.volunteerTask.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return prisma.volunteerTask.update({
    where: { id: taskId },
    data: { status: "CANCELLED" },
  });
};
