import express from "express";
import { complete,feedback,getCurrentPlan,savePlan } from "../controllers/plancontroller.js";


const router = express.Router();
router.get("/current",getCurrentPlan);
router.post("/save",savePlan);
router.post("/plan/complete",complete);
router.post("/plan/feedback",feedback);
export default router;