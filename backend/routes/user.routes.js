import express, { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);

export default router;
