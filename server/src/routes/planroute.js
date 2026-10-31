import express from "express";
import {feedback,getCurrentPlan,savePlan } from "../controllers/plancontroller.js";

const router = express.Router();
router.get("/current",getCurrentPlan);
router.post("/save",savePlan);
router.post("/feedback",feedback);
export default router;