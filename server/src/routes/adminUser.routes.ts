import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

import {
  pendingUsers,
  approveUserController,
  rejectUserController,
  activePersonnel,
  citizens,
  deactivateUserController,
  activateUserController,
} from "../controllers/adminUser.controller.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/pending", pendingUsers);

router.patch("/:id/approve", approveUserController);

router.patch("/:id/reject", rejectUserController);

router.get("/active", activePersonnel);

router.get("/citizens", citizens);

router.patch("/:id/deactivate", deactivateUserController);

router.patch("/:id/activate", activateUserController);

export default router;