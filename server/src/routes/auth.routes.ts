import { Router } from "express";

import { login, register } from "../controllers/auth.controller.js";

import { loginValidator, registerValidator } from "../validators/auth.validator.js";

import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post(
  "/register",
  registerValidator,
  validate,
  register
);

router.post(
  "/login",
  loginValidator,
  validate,
  login
);

// router.post("/refresh");

// router.post("/logout");

// router.post("/forgot-password");

// router.post("/reset-password");

export default router;