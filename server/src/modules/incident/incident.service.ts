import { prisma } from "../../config/prisma.js";
import type { CreateIncidentDto } from "./incident.types.js";

export const createIncident = async (
  data: CreateIncidentDto,
  userId: string
) => {

    console.log("Service data:", data);


  const incident = await prisma.incident.create({
    data: {
      title: data.title,
      description: data.description,
      disasterType: data.disasterType,
      severity: data.severity,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      reportedById: userId,
    },
    include: {
      reportedBy: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  console.log("Image URL:", data.imageUrl);

  if (data.imageUrl) {

    await prisma.incidentImage.create({

        data:{

            incidentId:incident.id,
            imageUrl:data.imageUrl

        }

    });

}

return incident;

};

export const getMyIncidents = async (
  userId: string
) => {

  return await prisma.incident.findMany({

    where: {
      reportedById: userId,
    },

    include: {
      images: true,
      aiAnalysis: true,
      assignments: true,
    },

    orderBy: {
      createdAt: "desc",
    },

  });

};

export const getIncidentById = async (
  incidentId: string,
  userId: string
) => {

  const incident = await prisma.incident.findFirst({

    where: {
      id: incidentId,
      reportedById: userId,
    },

    include: {
      images: true,
      aiAnalysis: true,
      assignments: {
        include: {
          rescueTeam: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
        },
      },
      reportedBy: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
    },

  });

  if (!incident) {
    throw new Error("Incident not found");
  }

  return incident;

};

export const getRadarIncidents = async () => {
  return prisma.incident.findMany({
    where: {
      status: {
        in: [
          "PENDING",
          "VERIFIED",
          "ASSIGNED",
          "IN_PROGRESS",
        ],
      },
    },

    select: {
      id: true,
      title: true,
      description: true,
      disasterType: true,
      severity: true,
      status: true,
      latitude: true,
      longitude: true,
      address: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};