import express, { Router } from "express";
import { createSong } from "../controllers/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/songs", protectRoute, requireAdmin, createSong);

export default router;
