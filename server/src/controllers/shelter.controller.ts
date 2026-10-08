import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createShelter,
  getShelters,
  getShelterById,
  transferToShelter,
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

export const getById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const shelter = await getShelterById(id as string);
    return res.status(200).json({
      success: true,
      data: shelter,
    });
  } catch (error: any) {
    const status = error.message === "Shelter not found" ? 404 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch shelter",
    });
  }
};

export const transferEvacuees = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { evacueeCount, notes } = req.body;

    const count = Number(evacueeCount);
    if (isNaN(count) || count <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid positive evacueeCount is required",
      });
    }

    const result = await transferToShelter(id as string, count, notes);
    return res.status(200).json({
      success: true,
      message: `Successfully transferred ${count} evacuees to shelter`,
      data: result,
    });
  } catch (error: any) {
    console.error("Transfer evacuees error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to process evacuee transfer",
    });
  }
};