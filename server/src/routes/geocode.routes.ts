import { Router } from "express";
import { geocodeAddress } from "../controllers/geocode.controller.js";

const router = Router();

router.get("/", geocodeAddress);

export default router;