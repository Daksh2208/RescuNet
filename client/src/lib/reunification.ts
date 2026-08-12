import api from "./api";

export type ReunificationType = "HUMAN" | "PET";

export interface ReunificationPost {
  id: string;
  type: ReunificationType;
  name: string;
  description?: string;
  age?: string;
  lastSeen: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  status: "MISSING" | "FOUND";
  reportedById: string;
  foundById?: string | null;
  createdAt: string;
  updatedAt: string;

  reportedBy?: {
    id: string;
    fullName: string;
  };

  foundBy?: {
    id: string;
    fullName: string;
  };
}

export interface CreateReunificationData {
  type: ReunificationType;
  name: string;
  description?: string;
  age?: string;
  lastSeen: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
}

export const getReunificationPosts = async (
  type?: ReunificationType,
  search?: string
) => {
  const response = await api.get("/reunification", {
    params: {
      type,
      search,
    },
  });

  return response.data.data as ReunificationPost[];
};

export const createReunificationPost = async (
  data: CreateReunificationData
) => {
  const response = await api.post(
    "/reunification",
    data
  );

  return response.data.data as ReunificationPost;
};

export const markAsFound = async (
  id: string
) => {
  const response = await api.patch(
    `/reunification/${id}/found`
  );

  return response.data.data as ReunificationPost;
};