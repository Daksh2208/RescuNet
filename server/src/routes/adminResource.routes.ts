import { Router } from "express";

import {
  getSheltersController,
  createShelterController,
  updateShelterController,
  deleteShelterController,
  getResourcesController,
  createResourceController,
  updateResourceController,
  deleteResourceController,
} from "../controllers/adminResource.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get(
  "/shelters",
  getSheltersController
);

router.post(
  "/shelters",
  createShelterController
);

router.patch(
  "/shelters/:id",
  updateShelterController
);

router.delete(
  "/shelters/:id",
  deleteShelterController
);

router.get(
  "/",
  getResourcesController
);

router.post(
  "/",
  createResourceController
);

router.patch(
  "/:id",
  updateResourceController
);

router.delete(
  "/:id",
  deleteResourceController
);

export default router;