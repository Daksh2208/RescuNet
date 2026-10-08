import { Router } from "express";
import { getTasks, getMyTasks, createTask, claimTaskController, updateStatusController, } from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = Router();
router.get("/", authenticate, getTasks);
router.get("/my", authenticate, getMyTasks);
router.post("/", authenticate, createTask);
router.post("/:id/claim", authenticate, claimTaskController);
router.patch("/:id/status", authenticate, updateStatusController);
export default router;
//# sourceMappingURL=task.routes.js.map