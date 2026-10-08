import { prisma } from "../config/prisma.js";
export const createCommunityPost = async (data, userId) => {
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
export const getCommunityPosts = async (type, search) => {
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
export const getMyCommunityPosts = async (userId) => {
    return prisma.communityPost.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
//# sourceMappingURL=community.service.js.map