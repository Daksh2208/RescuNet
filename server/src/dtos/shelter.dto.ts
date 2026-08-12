import { ShelterType } from "@prisma/client";

export interface CreateShelterDto {
  name: string;
  type: ShelterType;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  occupied?: number;
  contactNumber: string;
}