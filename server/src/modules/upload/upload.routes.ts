import { Router } from "express";
import { upload } from "../../middleware/upload.js";
import { uploadImage } from "./upload.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("image"),
  uploadImage
);

export default router;