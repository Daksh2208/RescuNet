import { Router } from "express";
import { getNotifications, markNotificationAsReadController, } from "../controllers/notification.controller.js";
import { authenticate, } from "../middleware/auth.middleware.js";
const router = Router();
router.use(authenticate);
router.get("/", getNotifications);
router.patch("/:id/read", markNotificationAsReadController);
export default router;
//# sourceMappingURL=notification.routes.js.map