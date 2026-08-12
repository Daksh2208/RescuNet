import { Router } from "express";

import {
  create,
  getAll,
} from "../controllers/shelter.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getAll
);

router.post(
  "/",
  authenticate,
  create
);

export default router;