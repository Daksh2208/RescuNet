import {
  ReunificationType,
} from "@prisma/client";

export interface CreateReunificationDto {
  type: ReunificationType;
  name: string;
  description?: string;
  age?: string;
  lastSeen: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
}