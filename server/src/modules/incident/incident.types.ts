import {
  DisasterType,
  Severity,
} from "@prisma/client";

export interface CreateIncidentDto {
  title: string;
  description: string;
  disasterType: DisasterType;
  severity: Severity;
  latitude: number;
  longitude: number;
  address: string;
}