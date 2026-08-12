import { prisma } from "../config/prisma.js";
import type { CreateCommunityPostDto } from "../dtos/community.dto.js";

export const createCommunityPost = async (
  data: CreateCommunityPostDto,
  userId: string
) => {

  return prisma.communityPost.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      category: data.category,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      userId,
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

};


export const getCommunityPosts = async (
  type?: string,
  search?: string
) => {

  return prisma.communityPost.findMany({

    where: {

      isActive: true,

      ...(type === "OFFER" || type === "REQUEST"
        ? {
            type,
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                title: {
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
              {
                location: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

  });

};


export const getMyCommunityPosts = async (
  userId: string
) => {

  return prisma.communityPost.findMany({

    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },

  });

};