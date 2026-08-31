import { Router } from "express";
import {
  getFosterRequests,
  createFoster,
  applyFosterController,
} from "../controllers/foster.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getFosterRequests);
router.post("/", authenticate, createFoster);
router.post("/:id/apply", authenticate, applyFosterController);

export default router;
