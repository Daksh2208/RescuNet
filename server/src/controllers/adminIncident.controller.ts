import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  getPendingIncidents,
  getVerifiedIncidents,
  verifyIncident,
  rejectIncident,
  assignIncident,
  getRescuePersonnelWithWorkload,
} from "../services/adminIncident.service.js";

export const pendingIncidents = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const incidents = await getPendingIncidents();

    return res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch pending incidents",
    });
  }
};

export const verifiedIncidents = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const incidents = await getVerifiedIncidents();

    return res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch verified incidents",
    });
  }
};

export const verifyIncidentController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = req.params.id as string;

    const incident = await verifyIncident(
      id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Incident verified successfully",
      data: incident,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to verify incident",
    });
  }
};

export const rejectIncidentController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = req.params.id as string;

    const incident = await rejectIncident(
      id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Incident rejected successfully",
      data: incident,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to reject incident",
    });
  }
};

export const rescueTeamsListController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const teams = await getRescuePersonnelWithWorkload();

    return res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error("Failed to fetch rescue teams:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch rescue teams",
    });
  }
};

export const assignIncidentController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = (req.params.id || req.body.incidentId) as string;
    const { rescueTeamId } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Incident ID is required",
      });
    }

    if (!rescueTeamId) {
      return res.status(400).json({
        success: false,
        message: "Rescue team ID is required",
      });
    }

    const assignment = await assignIncident(
      id,
      rescueTeamId,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Mission successfully assigned and dispatched to rescue team",
      data: assignment,
    });
  } catch (error) {
    console.error("Failed to assign incident:", error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to assign incident",
    });
  }
};