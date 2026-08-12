import api from "./api";

export type ShelterType =
  | "HUMAN"
  | "ANIMAL"
  | "VET";

export interface Shelter {
  id: string;
  name: string;
  type: ShelterType;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  occupied: number;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
}

export const getShelters = async (
  type?: ShelterType,
  search?: string
) => {

  const response = await api.get(
    "/shelters",
    {
      params: {
        type,
        search,
      },
    }
  );

  return response.data.data as Shelter[];

};