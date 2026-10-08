import { prisma } from "../config/prisma.js";
import type { CreateShelterDto } from "../dtos/shelter.dto.js";
import { ShelterType } from "@prisma/client";

// Resilient query executor for cold-start wakeups
async function queryWithResilience<T>(queryFn: () => Promise<T>, fallback: T, retries = 2): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await queryFn();
    } catch (err: any) {
      console.warn(`[Shelter DB Attempt ${attempt + 1}/${retries + 1} Failed]:`, err?.message || err);
      if (attempt === retries) {
        return fallback;
      }
      await new Promise((resolve) => setTimeout(resolve, 300 * Math.pow(2, attempt)));
    }
  }
  return fallback;
}

export const createShelter = async (
  data: CreateShelterDto
) => {
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

export const getShelters = async (
  type?: string,
  search?: string
) => {
  let shelterType: ShelterType | undefined;

  if (
    type === "HUMAN" ||
    type === "ANIMAL" ||
    type === "VET"
  ) {
    shelterType = type as ShelterType;
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

export const getShelterById = async (id: string) => {
  const shelter = await prisma.shelter.findUnique({
    where: { id },
  });

  if (!shelter) {
    throw new Error("Shelter not found");
  }

  return shelter;
};

export const transferToShelter = async (
  id: string,
  evacueeCount: number,
  notes?: string
) => {
  const shelter = await prisma.shelter.findUnique({
    where: { id },
  });

  if (!shelter) {
    throw new Error("Shelter not found");
  }

  const newOccupied = shelter.occupied + evacueeCount;
  if (newOccupied > shelter.capacity) {
    throw new Error(
      `Shelter capacity exceeded. Capacity is ${shelter.capacity}, currently occupied: ${shelter.occupied}. Cannot add ${evacueeCount} evacuees.`
    );
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