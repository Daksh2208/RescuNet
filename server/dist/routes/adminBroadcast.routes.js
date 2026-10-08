import { Router } from "express";
import { sendBroadcastController, } from "../controllers/adminBroadcast.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
const router = Router();
router.use(authenticate, requireAdmin);
router.post("/", sendBroadcastController);
export default router;
//# sourceMappingURL=adminBroadcast.routes.js.map