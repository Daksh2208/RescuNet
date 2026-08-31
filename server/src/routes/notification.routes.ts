import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getNotifications);
router.patch("/:id/read", authenticate, markAsRead);
router.patch("/read-all", authenticate, markAllAsRead);

export default router;
