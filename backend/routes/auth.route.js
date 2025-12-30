import express, { Router } from "express";
import { authCallback } from "../controllers/auth.controller.js";

const router = Router();
// Clerk webhook
router.post("/callback", authCallback);

export default router;
