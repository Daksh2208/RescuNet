import { prisma } from "../config/prisma.js";

const shelterTypes = ["HUMAN", "ANIMAL", "VET"] as const;
const resourceCategories = [
  "FOOD",
  "WATER",
  "MEDICINE",
  "EQUIPMENT",
] as const;

/* =========================
   SHELTERS
========================= */

export const getShelters = async () => {
  return prisma.shelter.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createShelter = async (data: {
  name: string;
  type?: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  occupied?: number;
  contactNumber: string;
  needs?: string[];
}) => {
  const type = data.type ?? "HUMAN";

  if (!shelterTypes.includes(type as any)) {
    throw new Error("Invalid shelter type");
  }

  if (data.capacity < 0) {
    throw new Error("Capacity cannot be negative");
  }

  const occupied = data.occupied ?? 0;

  if (occupied < 0 || occupied > data.capacity) {
    throw new Error(
      "Occupied capacity must be between 0 and total capacity"
    );
  }

  return prisma.shelter.create({
    data: {
      name: data.name,
      type: type as any,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      capacity: data.capacity,
      occupied,
      contactNumber: data.contactNumber,
      needs: data.needs ?? [],
    },
  });
};

export const updateShelter = async (
  shelterId: string,
  data: {
    name?: string;
    type?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
    occupied?: number;
    contactNumber?: string;
    needs?: string[];
  }
) => {
  const existing = await prisma.shelter.findUnique({
    where: {
      id: shelterId,
    },
  });

  if (!existing) {
    throw new Error("Shelter not found");
  }

  const newCapacity = data.capacity ?? existing.capacity;
  const newOccupied = data.occupied ?? existing.occupied;

  if (newCapacity < 0) {
    throw new Error("Capacity cannot be negative");
  }

  if (newOccupied < 0 || newOccupied > newCapacity) {
    throw new Error(
      "Occupied capacity must be between 0 and total capacity"
    );
  }

  if (
    data.type &&
    !shelterTypes.includes(data.type as any)
  ) {
    throw new Error("Invalid shelter type");
  }

  return prisma.shelter.update({
    where: {
      id: shelterId,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.type !== undefined && {
        type: data.type as any,
      }),
      ...(data.address !== undefined && {
        address: data.address,
      }),
      ...(data.latitude !== undefined && {
        latitude: data.latitude,
      }),
      ...(data.longitude !== undefined && {
        longitude: data.longitude,
      }),
      ...(data.capacity !== undefined && {
        capacity: data.capacity,
      }),
      ...(data.occupied !== undefined && {
        occupied: data.occupied,
      }),
      ...(data.contactNumber !== undefined && {
        contactNumber: data.contactNumber,
      }),
      ...(data.needs !== undefined && {
        needs: data.needs,
      }),
    },
  });
};

export const deleteShelter = async (shelterId: string) => {
  const existing = await prisma.shelter.findUnique({
    where: {
      id: shelterId,
    },
  });

  if (!existing) {
    throw new Error("Shelter not found");
  }

  return prisma.shelter.delete({
    where: {
      id: shelterId,
    },
  });
};

/* =========================
   RESOURCES
========================= */

export const getResources = async () => {
  return prisma.resource.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const createResource = async (data: {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  locationName: string;
  latitude: number;
  longitude: number;
}) => {
  if (
    !resourceCategories.includes(
      data.category as any
    )
  ) {
    throw new Error("Invalid resource category");
  }

  if (data.quantity < 0) {
    throw new Error("Quantity cannot be negative");
  }

  return prisma.resource.create({
    data: {
      name: data.name,
      category: data.category as any,
      quantity: data.quantity,
      unit: data.unit,
      locationName: data.locationName,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  });
};

export const updateResource = async (
  resourceId: string,
  data: {
    name?: string;
    category?: string;
    quantity?: number;
    unit?: string;
    locationName?: string;
    latitude?: number;
    longitude?: number;
  }
) => {
  const existing = await prisma.resource.findUnique({
    where: {
      id: resourceId,
    },
  });

  if (!existing) {
    throw new Error("Resource not found");
  }

  if (
    data.category &&
    !resourceCategories.includes(
      data.category as any
    )
  ) {
    throw new Error("Invalid resource category");
  }

  if (
    data.quantity !== undefined &&
    data.quantity < 0
  ) {
    throw new Error("Quantity cannot be negative");
  }

  return prisma.resource.update({
    where: {
      id: resourceId,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),
      ...(data.category !== undefined && {
        category: data.category as any,
      }),
      ...(data.quantity !== undefined && {
        quantity: data.quantity,
      }),
      ...(data.unit !== undefined && {
        unit: data.unit,
      }),
      ...(data.locationName !== undefined && {
        locationName: data.locationName,
      }),
      ...(data.latitude !== undefined && {
        latitude: data.latitude,
      }),
      ...(data.longitude !== undefined && {
        longitude: data.longitude,
      }),
    },
  });
};

export const deleteResource = async (resourceId: string) => {
  const existing = await prisma.resource.findUnique({
    where: {
      id: resourceId,
    },
  });

  if (!existing) {
    throw new Error("Resource not found");
  }

  return prisma.resource.delete({
    where: {
      id: resourceId,
    },
  });
};