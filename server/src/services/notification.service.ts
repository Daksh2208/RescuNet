import { prisma } from "../config/prisma.js";

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
}

export const getUserNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createNotification = async (data: CreateNotificationDTO) => {
  return await prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
    },
  });
};

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};
