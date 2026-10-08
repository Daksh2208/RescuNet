import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { pendingIncidents, verifiedIncidents, verifyIncidentController, rejectIncidentController, rescueTeamsListController, assignIncidentController, } from "../controllers/adminIncident.controller.js";
const router = Router();
router.use(authenticate, requireAdmin);
router.get("/pending", pendingIncidents);
router.get("/verified", verifiedIncidents);
router.get("/rescue-teams", rescueTeamsListController);
router.post("/:id/assign", assignIncidentController);
router.post("/assign", assignIncidentController);
router.patch("/:id/verify", verifyIncidentController);
router.patch("/:id/reject", rejectIncidentController);
export default router;
//# sourceMappingURL=adminIncident.routes.js.map