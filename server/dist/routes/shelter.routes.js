import { Router } from "express";
import { create, getAll, getById, transferEvacuees, } from "../controllers/shelter.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = Router();
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getById);
router.post("/:id/transfer", authenticate, transferEvacuees);
router.post("/", authenticate, create);
export default router;
//# sourceMappingURL=shelter.routes.js.map