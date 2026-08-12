import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createShelter,
  getShelters,
} from "../services/shelter.service.js";


export const create = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const shelter = await createShelter(req.body);

    return res.status(201).json({
      success: true,
      message: "Shelter created successfully",
      data: shelter,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create shelter",
    });

  }

};


export const getAll = async (
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

    const shelters = await getShelters(
      type,
      search
    );

    return res.status(200).json({
      success: true,
      data: shelters,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shelters",
    });

  }

};