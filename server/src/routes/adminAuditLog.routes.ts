import { Router } from "express";

import {
  getAuditLogsController,
} from "../controllers/adminAuditLog.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

import {
  requireAdmin,
} from "../middleware/admin.middleware.js";

const router = Router();

router.use(
  authenticate,
  requireAdmin
);

router.get(
  "/",
  getAuditLogsController
);

export default router;