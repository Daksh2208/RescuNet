import { Router } from "express";
import { upload } from "../../middleware/upload.js";
import { uploadImage } from "./upload.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

const publicUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many photo uploads. Please try again later.",
  },
});

router.post(
  "/public",
  publicUploadLimiter,
  upload.single("image"),
  uploadImage
);

router.post(
  "/",
  authenticate,
  upload.single("image"),
  uploadImage
);

export default router;