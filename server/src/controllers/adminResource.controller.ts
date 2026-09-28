import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  getShelters,
  createShelter,
  updateShelter,
  deleteShelter,
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../services/adminResource.service.js";

/* =========================
   SHELTERS
========================= */

export const getSheltersController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const shelters = await getShelters();

    return res.status(200).json({
      success: true,
      data: shelters,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch shelters",
    });
  }
};

export const createShelterController = async (
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

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create shelter",
    });
  }
};

export const updateShelterController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const shelter = await updateShelter(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Shelter updated successfully",
      data: shelter,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update shelter",
    });
  }
};

export const deleteShelterController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    await deleteShelter(id);

    return res.status(200).json({
      success: true,
      message: "Shelter deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete shelter",
    });
  }
};

/* =========================
   RESOURCES
========================= */

export const getResourcesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resources = await getResources();

    return res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch resources",
    });
  }
};

export const createResourceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resource = await createResource(req.body);

    return res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: resource,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create resource",
    });
  }
};

export const updateResourceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const resource = await updateResource(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      data: resource,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update resource",
    });
  }
};

export const deleteResourceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    await deleteResource(id);

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete resource",
    });
  }
};