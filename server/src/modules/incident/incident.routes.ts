import { Router } from "express";

import { getIncident, getMyReports, getRadarIncidents, reportIncident } from "./incident.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

import { createIncidentValidation } from "./incident.validation.js";

import { validate } from "../../middleware/validate.middleware.js";

import rateLimit from "express-rate-limit";
import { reportPublicIncident } from "./incident.controller.js";

const router = Router();

const publicIncidentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many reports. Please try again later.",
  },
});

router.post(
  "/public",
  publicIncidentLimiter,
  createIncidentValidation,
  validate,
  reportPublicIncident
);

router.post(
  "/",
  authenticate,
  createIncidentValidation,
  validate,
  reportIncident
);

router.get(
  "/my",
  authenticate,
  getMyReports
);

router.get(
  "/radar",
  authenticate,
  getRadarIncidents
);

router.get(
  "/:id",
  authenticate,
  getIncident
);

export default router;