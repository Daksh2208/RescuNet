import { VolunteerTaskType, Severity, TaskStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";
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
export const getMyClaimedTasks = async (userId) => {
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
export const createVolunteerTask = async (data) => {
    return await prisma.volunteerTask.create({
        data: {
            title: data.title,
            description: data.description,
            type: data.type || VolunteerTaskType.SUPPLY_DELIVERY,
            priority: data.priority || Severity.MEDIUM,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
        },
    });
};
export const claimTask = async (taskId, userId) => {
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
export const updateTaskStatus = async (taskId, status) => {
    const dataToUpdate = { status };
    if (status === TaskStatus.COMPLETED) {
        dataToUpdate.completedAt = new Date();
    }
    return await prisma.volunteerTask.update({
        where: { id: taskId },
        data: dataToUpdate,
    });
};
//# sourceMappingURL=task.service.js.map