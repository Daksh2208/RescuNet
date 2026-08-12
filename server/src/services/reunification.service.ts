import { prisma } from "../config/prisma.js";
import type { CreateReunificationDto } from "../dtos/reunification.dto.js";

export const createReunificationPost = async (
  data: CreateReunificationDto,
  userId: string
) => {

  return prisma.reunificationPost.create({
    data: {
      type: data.type,
      name: data.name,
      description: data.description,
      age: data.age,
      lastSeen: data.lastSeen,
      latitude: data.latitude,
      longitude: data.longitude,
      imageUrl: data.imageUrl,
      reportedById: userId,
    },
    include: {
      reportedBy: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

};


export const getReunificationPosts = async (
  type?: "HUMAN" | "PET",
  search?: string
) => {

  return prisma.reunificationPost.findMany({

    where: {
      ...(type
        ? {
            type,
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                lastSeen: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      reportedBy: {
        select: {
          id: true,
          fullName: true,
        },
      },

      foundBy: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },

  });

};


export const markReunificationFound = async (
  id: string,
  userId: string
) => {

  return prisma.reunificationPost.update({
    where: {
      id,
    },

    data: {
      status: "FOUND",
      foundById: userId,
    },

    include: {
      reportedBy: {
        select: {
          id: true,
          fullName: true,
        },
      },

      foundBy: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

};