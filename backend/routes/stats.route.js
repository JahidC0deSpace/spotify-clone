import express, { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("hello stats vaiii");
});

export default router;
