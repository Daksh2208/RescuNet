import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { createIncident, getIncidentById, getMyIncidents } from "./incident.service.js";

export const reportIncident = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    console.log("Controller req.body:", req.body);
    const incident = await createIncident(
      req.body,
      req.user!.id
    );


    return res.status(201).json({
      success: true,
      message: "Incident reported successfully",
      data: incident,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to report incident",
    });

  }

};


export const getMyReports = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const incidents = await getMyIncidents(
      req.user!.id
    );

    return res.status(200).json({
      success: true,
      data: incidents,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reports",
    });

  }

};

export const getIncident = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const {id} = req.params;

    const incident = await getIncidentById(
      id as string,
      req.user!.id
    );

    return res.status(200).json({
      success: true,
      data: incident,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Incident not found",
    });

  }

};