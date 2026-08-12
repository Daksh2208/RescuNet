import { Router } from "express";

import {
  createPost,
  getPosts,
  markFound,
} from "../controllers/reunification.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getPosts
);

router.post(
  "/",
  authenticate,
  createPost
);

router.patch(
  "/:id/found",
  authenticate,
  markFound
);

export default router;