import api from "./api";

export type CommunityPostType =
  | "OFFER"
  | "REQUEST";

export interface CommunityPost {
  id: string;
  title: string;
  description: string;
  type: CommunityPostType;
  category: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    fullName: string;
  };
}

export interface CreateCommunityPostData {
  title: string;
  description: string;
  type: CommunityPostType;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

export const getCommunityPosts = async (
  type?: CommunityPostType,
  search?: string
) => {

  const response = await api.get(
    "/community",
    {
      params: {
        type,
        search,
      },
    }
  );

  return response.data.data as CommunityPost[];

};


export const createCommunityPost = async (
  data: CreateCommunityPostData
) => {

  const response = await api.post(
    "/community",
    data
  );

  return response.data.data as CommunityPost;

};


export const getMyCommunityPosts = async () => {

  const response = await api.get(
    "/community/my"
  );

  return response.data.data as CommunityPost[];

};