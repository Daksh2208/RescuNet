import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

import {
  pendingIncidents,
  verifiedIncidents,
  verifyIncidentController,
  rejectIncidentController,
} from "../controllers/adminIncident.controller.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/pending", pendingIncidents);

router.get("/verified", verifiedIncidents);

router.patch(
  "/:id/verify",
  verifyIncidentController
);

router.patch(
  "/:id/reject",
  rejectIncidentController
);

export default router;