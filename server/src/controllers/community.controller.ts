import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createCommunityPost,
  getCommunityPosts,
  getMyCommunityPosts,
} from "../services/community.service.js";


export const createPost = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const post = await createCommunityPost(
      req.body,
      req.user!.id
    );

    return res.status(201).json({
      success: true,
      message: "Community post created successfully",
      data: post,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create community post",
    });

  }

};


export const getPosts = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const type =
      typeof req.query.type === "string"
        ? req.query.type
        : undefined;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const posts = await getCommunityPosts(
      type,
      search
    );

    return res.status(200).json({
      success: true,
      data: posts,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch community posts",
    });

  }

};


export const getMyPosts = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const posts = await getMyCommunityPosts(
      req.user!.id
    );

    return res.status(200).json({
      success: true,
      data: posts,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your community posts",
    });

  }

};