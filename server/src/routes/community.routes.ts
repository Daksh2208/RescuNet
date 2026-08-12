import { Router } from "express";

import {
  createPost,
  getPosts,
  getMyPosts,
} from "../controllers/community.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getPosts
);

router.get(
  "/my",
  authenticate,
  getMyPosts
);

router.post(
  "/",
  authenticate,
  createPost
);

export default router;