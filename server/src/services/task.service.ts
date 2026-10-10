import { VolunteerTaskType, Severity, TaskStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export interface CreateTaskDTO {
  title: string;
  description: string;
  type?: VolunteerTaskType;
  priority?: Severity;
  location: string;
  latitude?: number;
  longitude?: number;
  contactPerson?: string;
  contactPhone?: string;
}

export const getAllAvailableTasks = async () => {
  return await prisma.volunteerTask.findMany({
    where: {
      status: TaskStatus.AVAILABLE,
    },
    orderBy: {
      createdAt: "desc",
    },
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

export const getMyClaimedTasks = async (userId: string) => {
  return await prisma.volunteerTask.findMany({
    where: {
      claimedById: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
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

export const createVolunteerTask = async (data: CreateTaskDTO) => {
  return await prisma.volunteerTask.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type || VolunteerTaskType.SUPPLY_DELIVERY,
      priority: data.priority || Severity.MEDIUM,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
    },
  });
};

export const claimTask = async (taskId: string, userId: string) => {
  const task = await prisma.volunteerTask.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.status !== TaskStatus.AVAILABLE) {
    throw new Error("Task is no longer available");
  }

  return await prisma.volunteerTask.update({
    where: { id: taskId },
    data: {
      claimedById: userId,
      claimedAt: new Date(),
      status: TaskStatus.CLAIMED,
    },
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

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  options?: {
    userId?: string;
    role?: string;
    completionNotes?: string;
  }
) => {
  const task = await prisma.volunteerTask.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // Authorization check for volunteers: only the assigned volunteer can update their task
  if (options?.userId && options?.role === "VOLUNTEER") {
    if (task.claimedById && task.claimedById !== options.userId) {
      throw new Error("You are not authorized to update this task");
    }
  }

  const dataToUpdate: any = { status };

  if (status === TaskStatus.COMPLETED) {
    dataToUpdate.completedAt = new Date();
    if (options?.completionNotes !== undefined) {
      dataToUpdate.completionNotes = options.completionNotes;
    }
  } else if (status === TaskStatus.AVAILABLE) {
    // Releasing task back to available pool
    dataToUpdate.claimedById = null;
    dataToUpdate.claimedAt = null;
    dataToUpdate.completedAt = null;
    dataToUpdate.completionNotes = null;
  } else if (status === TaskStatus.IN_PROGRESS) {
    // In progress tracking
  }

  return await prisma.volunteerTask.update({
    where: { id: taskId },
    data: dataToUpdate,
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
