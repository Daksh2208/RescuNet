import { getAllAvailableTasks, getMyClaimedTasks, createVolunteerTask, claimTask, updateTaskStatus, } from "../services/task.service.js";
export const getTasks = async (_, res) => {
    try {
        const tasks = await getAllAvailableTasks();
        return res.status(200).json({
            success: true,
            tasks,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch tasks",
        });
    }
};
export const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await getMyClaimedTasks(userId);
        return res.status(200).json({
            success: true,
            tasks,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch claimed tasks",
        });
    }
};
export const createTask = async (req, res) => {
    try {
        const task = await createVolunteerTask(req.body);
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create task",
        });
    }
};
export const claimTaskController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updatedTask = await claimTask(id, userId);
        return res.status(200).json({
            success: true,
            message: "Task claimed successfully",
            task: updatedTask,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to claim task",
        });
    }
};
export const updateStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedTask = await updateTaskStatus(id, status);
        return res.status(200).json({
            success: true,
            message: "Task status updated",
            task: updatedTask,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update task status",
        });
    }
};
//# sourceMappingURL=task.controller.js.map