import { Router } from "express";

import { getIncident, getMyReports, getRadarIncidents, reportIncident } from "./incident.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

import { createIncidentValidation } from "./incident.validation.js";

import { validate } from "../../middleware/validate.middleware.js";

const router = Router();

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