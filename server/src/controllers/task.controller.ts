import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  getAllAvailableTasks,
  getMyClaimedTasks,
  createVolunteerTask,
  claimTask,
  updateTaskStatus,
} from "../services/task.service.js";

export const getTasks = async (_: AuthRequest, res: Response) => {
  try {
    const tasks = await getAllAvailableTasks();
    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tasks",
    });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const tasks = await getMyClaimedTasks(userId);
    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch claimed tasks",
    });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await createVolunteerTask(req.body);
    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create task",
    });
  }
};

export const claimTaskController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updatedTask = await claimTask(id as string, userId);

    return res.status(200).json({
      success: true,
      message: "Task claimed successfully",
      task: updatedTask,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to claim task",
    });
  }
};

export const updateStatusController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTask = await updateTaskStatus(id as string, status);

    return res.status(200).json({
      success: true,
      message: "Task status updated",
      task: updatedTask,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update task status",
    });
  }
};
