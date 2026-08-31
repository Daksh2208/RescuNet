import { AnimalType, FosterStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export interface CreateFosterDTO {
  petName: string;
  animalType?: AnimalType;
  breed?: string;
  description: string;
  location: string;
  shelterId?: string;
}

export const getAllOpenFosterRequests = async () => {
  return await prisma.fosterRequest.findMany({
    where: {
      status: FosterStatus.OPEN,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      shelter: {
        select: {
          id: true,
          name: true,
          contactNumber: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
    },
  });
};

export const createFosterRequest = async (data: CreateFosterDTO, createdById: string) => {
  return await prisma.fosterRequest.create({
    data: {
      petName: data.petName,
      animalType: data.animalType || AnimalType.DOG,
      breed: data.breed,
      description: data.description,
      location: data.location,
      shelterId: data.shelterId,
      createdById,
    },
    include: {
      shelter: true,
    },
  });
};

export const applyToFoster = async (fosterId: string, volunteerId: string) => {
  const request = await prisma.fosterRequest.findUnique({
    where: { id: fosterId },
  });

  if (!request) {
    throw new Error("Foster request not found");
  }

  if (request.status !== FosterStatus.OPEN) {
    throw new Error("This pet is no longer open for foster placement");
  }

  return await prisma.fosterRequest.update({
    where: { id: fosterId },
    data: {
      fosterVolunteerId: volunteerId,
      status: FosterStatus.FOSTERED,
    },
    include: {
      fosterVolunteer: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
    },
  });
};
