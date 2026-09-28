import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  sendBroadcast,
} from "../services/adminBroadcast.service.js";

export const sendBroadcastController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      message,
      severity,
      roles,
    } = req.body;

    const result = await sendBroadcast({
      message,
      severity,
      roles,
    });

    return res.status(201).json({
      success: true,
      message:
        "Broadcast sent successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send broadcast",
    });
  }
};