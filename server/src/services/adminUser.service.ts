import { prisma } from "../config/prisma.js";

export const getPendingUsers = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        in: ["RESCUE", "VOLUNTEER"],
      },
      isVerified: false,
      isActive: true,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const approveUser = async (userId: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isVerified: true,
      isActive: true,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
  });
};

export const rejectUser = async (userId: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isVerified: false,
      isActive: false,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
  });
};

export const getActivePersonnel = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        in: ["RESCUE", "VOLUNTEER"],
      },
      isVerified: true,
      isActive: true,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCitizens = async () => {
  return prisma.user.findMany({
    where: {
      role: "CITIZEN",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deactivateUser = async (userId: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive: false,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
  });
};

export const activateUser = async (userId: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive: true,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      isActive: true,
      createdAt: true,
    },
  });
};