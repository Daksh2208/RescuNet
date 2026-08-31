import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  getAllOpenFosterRequests,
  createFosterRequest,
  applyToFoster,
} from "../services/foster.service.js";

export const getFosterRequests = async (_: AuthRequest, res: Response) => {
  try {
    const requests = await getAllOpenFosterRequests();
    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch foster requests",
    });
  }
};

export const createFoster = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const request = await createFosterRequest(req.body, userId);
    return res.status(201).json({
      success: true,
      message: "Foster request created successfully",
      request,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create foster request",
    });
  }
};

export const applyFosterController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updatedRequest = await applyToFoster(id as string, userId);

    return res.status(200).json({
      success: true,
      message: "Foster application submitted successfully",
      request: updatedRequest,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to apply for foster",
    });
  }
};
