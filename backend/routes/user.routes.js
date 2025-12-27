import express, { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("hello user vaiii");
});

export default router;
