import { prisma } from "../config/prisma.js";
import { ShelterType } from "@prisma/client";
// Resilient query executor for cold-start wakeups
async function queryWithResilience(queryFn, fallback, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await queryFn();
        }
        catch (err) {
            console.warn(`[Shelter DB Attempt ${attempt + 1}/${retries + 1} Failed]:`, err?.message || err);
            if (attempt === retries) {
                return fallback;
            }
            await new Promise((resolve) => setTimeout(resolve, 300 * Math.pow(2, attempt)));
        }
    }
    return fallback;
}
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
    const queryFn = async () => {
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
    return queryWithResilience(queryFn, []);
};
export const getShelterById = async (id) => {
    const shelter = await prisma.shelter.findUnique({
        where: { id },
    });
    if (!shelter) {
        throw new Error("Shelter not found");
    }
    return shelter;
};
export const transferToShelter = async (id, evacueeCount, notes) => {
    const shelter = await prisma.shelter.findUnique({
        where: { id },
    });
    if (!shelter) {
        throw new Error("Shelter not found");
    }
    const newOccupied = shelter.occupied + evacueeCount;
    if (newOccupied > shelter.capacity) {
        throw new Error(`Shelter capacity exceeded. Capacity is ${shelter.capacity}, currently occupied: ${shelter.occupied}. Cannot add ${evacueeCount} evacuees.`);
    }
    const updated = await prisma.shelter.update({
        where: { id },
        data: {
            occupied: Math.max(0, newOccupied),
        },
    });
    return {
        shelter: updated,
        transferredCount: evacueeCount,
        notes: notes || "Evacuee batch transferred by field response team.",
    };
};
//# sourceMappingURL=shelter.service.js.map