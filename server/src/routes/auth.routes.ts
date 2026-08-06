import { Router } from "express";

import { login, logout, refresh, register } from "../controllers/auth.controller.js";

import { loginValidator, registerValidator } from "../validators/auth.validator.js";

import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { me } from "../controllers/user.controller.js";

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

router.post("/refresh", refresh);

router.post("/logout", logout);

router.get("/me", authenticate, me);

// router.post("/forgot-password");

// router.post("/reset-password");

export default router;