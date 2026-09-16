import express from "express";
import { complete,feedback } from "../controllers/plancontroller.js";


const router = express.Router();
router.post("/plan/complete",complete);
router.post("/plan/feedback",feedback);
export default router;