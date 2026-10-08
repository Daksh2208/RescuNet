import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  getRescueDashboard,
  getActiveAssignments,
  getCompletedAssignments,
  getAssignmentById,
  acceptAssignment,
  completeAssignment,
  getCommsChannels,
  createCommsChannel,
  getChannelMessages,
  sendCommsMessage,
  getFleetAssets,
  getFleetAssetById,
  createFleetAsset,
  updateFleetAsset,
  getMapData,
  getProtocols,
  getProtocolById,
  getActionReports,
  getActionReportById,
  createActionReport,
  reviewActionReport,
  getRescueCreatedTasks,
  cancelVolunteerTask,
} from "../services/rescue.service.js";

// ──────────────────────────────────────────────
// DASHBOARD
// ──────────────────────────────────────────────

export const dashboard = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getRescueDashboard(req.user!.id);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load dashboard",
    });
  }
};

// ──────────────────────────────────────────────
// MISSIONS
// ──────────────────────────────────────────────

export const activeMissions = async (req: AuthRequest, res: Response) => {
  try {
    const missions = await getActiveAssignments(req.user!.id);
    return res.status(200).json({ success: true, data: missions });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch active missions",
    });
  }
};

export const completedMissions = async (req: AuthRequest, res: Response) => {
  try {
    const missions = await getCompletedAssignments(req.user!.id);
    return res.status(200).json({ success: true, data: missions });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch completed missions",
    });
  }
};

export const getMission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const mission = await getAssignmentById(id as string, req.user!.id);
    return res.status(200).json({ success: true, data: mission });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Mission not found",
    });
  }
};

export const acceptMission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const mission = await acceptAssignment(id as string, req.user!.id);
    return res.status(200).json({
      success: true,
      message: "Mission accepted",
      data: mission,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to accept mission",
    });
  }
};

export const completeMission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const mission = await completeAssignment(id as string, req.user!.id);
    return res.status(200).json({
      success: true,
      message: "Mission completed",
      data: mission,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to complete mission",
    });
  }
};

// ──────────────────────────────────────────────
// COMMS
// ──────────────────────────────────────────────

export const listChannels = async (_: AuthRequest, res: Response) => {
  try {
    const channels = await getCommsChannels();
    return res.status(200).json({ success: true, data: channels });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch channels",
    });
  }
};

export const createChannel = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Channel name is required",
      });
    }
    const channel = await createCommsChannel(name.trim());
    return res.status(201).json({
      success: true,
      message: "Channel created",
      data: channel,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create channel",
    });
  }
};

export const channelMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const before = req.query.before as string | undefined;
    const data = await getChannelMessages(id as string, limit, before);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    const status = error.message === "Channel not found" ? 404 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch messages",
    });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }
    const message = await sendCommsMessage(
      id as string,
      req.user!.id,
      text.trim()
    );
    return res.status(201).json({
      success: true,
      message: "Message sent",
      data: message,
    });
  } catch (error: any) {
    const status = error.message === "Channel not found" ? 404 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to send message",
    });
  }
};

// ──────────────────────────────────────────────
// FLEET & EQUIPMENT
// ──────────────────────────────────────────────

export const listFleetAssets = async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const assets = await getFleetAssets(status, search);
    return res.status(200).json({ success: true, data: assets });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch fleet assets",
    });
  }
};

export const getFleetAssetController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const asset = await getFleetAssetById(id as string);
    return res.status(200).json({ success: true, data: asset });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Asset not found",
    });
  }
};

export const createFleetAssetController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, assetCode, type, location, latitude, longitude, lastService, notes } =
      req.body;

    if (!name || !assetCode || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, asset code, and location are required",
      });
    }

    const asset = await createFleetAsset({
      name,
      assetCode,
      type,
      location,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      lastService,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Fleet asset created",
      data: asset,
    });
  } catch (error: any) {
    console.error(error);
    const status = error.message?.includes("Unique constraint") ? 409 : 500;
    return res.status(status).json({
      success: false,
      message:
        status === 409
          ? "An asset with this code already exists"
          : error.message || "Failed to create fleet asset",
    });
  }
};

export const updateFleetAssetController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const asset = await updateFleetAsset(id as string, req.body);
    return res.status(200).json({
      success: true,
      message: "Fleet asset updated",
      data: asset,
    });
  } catch (error: any) {
    const status = error.message === "Fleet asset not found" ? 404 : 400;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update fleet asset",
    });
  }
};

// ──────────────────────────────────────────────
// MAP
// ──────────────────────────────────────────────

export const mapData = async (_: AuthRequest, res: Response) => {
  try {
    const data = await getMapData();
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch map data",
    });
  }
};

// ──────────────────────────────────────────────
// PROTOCOLS
// ──────────────────────────────────────────────

export const listProtocols = async (req: AuthRequest, res: Response) => {
  try {
    const disasterType = req.query.disasterType as string | undefined;
    const protocols = await getProtocols(disasterType);
    return res.status(200).json({ success: true, data: protocols });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch protocols",
    });
  }
};

export const getProtocol = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const protocol = await getProtocolById(id as string);
    return res.status(200).json({ success: true, data: protocol });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Protocol not found",
    });
  }
};

// ──────────────────────────────────────────────
// ACTION REPORTS
// ──────────────────────────────────────────────

export const listActionReports = async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const reports = await getActionReports(req.user!.id, status);
    return res.status(200).json({ success: true, data: reports });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reports",
    });
  }
};

export const getReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const report = await getActionReportById(id as string, req.user!.id);
    return res.status(200).json({ success: true, data: report });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Report not found",
    });
  }
};

export const fileReport = async (req: AuthRequest, res: Response) => {
  try {
    const { title, summary } = req.body;
    if (!title || !summary) {
      return res.status(400).json({
        success: false,
        message: "Title and summary are required",
      });
    }
    const report = await createActionReport(req.body, req.user!.id);
    return res.status(201).json({
      success: true,
      message: "Report filed successfully",
      data: report,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to file report",
    });
  }
};

export const reviewReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || (status !== "APPROVED" && status !== "REJECTED")) {
      return res.status(400).json({
        success: false,
        message: "Valid status (APPROVED or REJECTED) is required",
      });
    }
    const report = await reviewActionReport(id as string, status);
    return res.status(200).json({
      success: true,
      message: `Report ${status.toLowerCase()}`,
      data: report,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to review report",
    });
  }
};

// ──────────────────────────────────────────────
// DISPATCHER (Volunteer Tasks)
// ──────────────────────────────────────────────

export const listDispatchedTasks = async (_: AuthRequest, res: Response) => {
  try {
    const tasks = await getRescueCreatedTasks();
    return res.status(200).json({ success: true, data: tasks });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tasks",
    });
  }
};

export const cancelTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await cancelVolunteerTask(id as string);
    return res.status(200).json({
      success: true,
      message: "Task cancelled",
      data: task,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to cancel task",
    });
  }
};
