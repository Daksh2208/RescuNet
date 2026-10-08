import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { dashboard, activeMissions, completedMissions, getMission, acceptMission, completeMission, listChannels, createChannel, channelMessages, sendMessage, listFleetAssets, getFleetAssetController, createFleetAssetController, updateFleetAssetController, mapData, listProtocols, getProtocol, listActionReports, getReport, fileReport, reviewReport, listDispatchedTasks, cancelTask, } from "../controllers/rescue.controller.js";
const router = Router();
// All rescue routes require authentication + RESCUE role
router.use(authenticate);
router.use(authorize("RESCUE", "ADMIN"));
// ─── Dashboard ───
router.get("/dashboard", dashboard);
// ─── Missions ───
router.get("/missions", activeMissions);
router.get("/missions/completed", completedMissions);
router.get("/missions/:id", getMission);
router.patch("/missions/:id/accept", acceptMission);
router.patch("/missions/:id/complete", completeMission);
// ─── Comms ───
router.get("/comms/channels", listChannels);
router.post("/comms/channels", createChannel);
router.get("/comms/channels/:id/messages", channelMessages);
router.post("/comms/channels/:id/messages", sendMessage);
// ─── Fleet & Equipment ───
router.get("/fleet", listFleetAssets);
router.post("/fleet", createFleetAssetController);
router.get("/fleet/:id", getFleetAssetController);
router.patch("/fleet/:id", updateFleetAssetController);
// ─── Map ───
router.get("/map/data", mapData);
// ─── Protocols ───
router.get("/protocols", listProtocols);
router.get("/protocols/:id", getProtocol);
// ─── Action Reports ───
router.get("/reports", listActionReports);
router.post("/reports", fileReport);
router.get("/reports/:id", getReport);
router.patch("/reports/:id/review", reviewReport);
// ─── Dispatcher (Volunteer Tasks) ───
router.get("/dispatcher/tasks", listDispatchedTasks);
router.patch("/dispatcher/tasks/:id/cancel", cancelTask);
export default router;
//# sourceMappingURL=rescue.routes.js.map