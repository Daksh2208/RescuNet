import { prisma } from "../config/prisma.js";
import { ShelterType } from "@prisma/client";
export const createShelter = async (data) => {
    return prisma.shelter.create({
        data: {
            name: data.name,
            type: data.type,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            capacity: data.capacity,
            occupied: data.occupied ?? 0,
            contactNumber: data.contactNumber,
            needs: data.needs || [],
        },
    });
};
export const getShelters = async (type, search) => {
    let shelterType;
    if (type === "HUMAN" ||
        type === "ANIMAL" ||
        type === "VET") {
        shelterType = type;
    }
    if (type === "ANIMAL") {
        return prisma.shelter.findMany({
            where: {
                type: {
                    in: ["ANIMAL", "VET"],
                },
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
                                address: {
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
        });
    }
    return prisma.shelter.findMany({
        where: {
            ...(shelterType
                ? {
                    type: shelterType,
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
                            address: {
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
    });
};
//# sourceMappingURL=shelter.service.js.map