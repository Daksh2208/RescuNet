import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createReunificationPost,
  getReunificationPosts,
  markReunificationFound,
} from "../services/reunification.service.js";


export const createPost = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const post = await createReunificationPost(
      req.body,
      req.user!.id
    );

    return res.status(201).json({
      success: true,
      message: "Reunification report created successfully",
      data: post,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create reunification report",
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
        ? req.query.type as "HUMAN" | "PET"
        : undefined;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const posts = await getReunificationPosts(
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
      message: "Failed to fetch reunification posts",
    });

  }

};


export const markFound = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const post = await markReunificationFound(
      req.params.id as string,
      req.user!.id
    );

    return res.status(200).json({
      success: true,
      message: "Report marked as found",
      data: post,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report",
    });

  }

};