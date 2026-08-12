import { CommunityPostType } from "@prisma/client";

export interface CreateCommunityPostDto {
  title: string;
  description: string;
  type: CommunityPostType;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
}