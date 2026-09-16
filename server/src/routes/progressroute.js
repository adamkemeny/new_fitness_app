import express from "express";
import {getWeightHistory, weightEntry} from "../controllers/progresscontroller.js";
import { ShowPrevModel } from "../controllers/previouscontroller.js";

const router = express.Router();
router.get("/plan/current",ShowPrevModel);
router.get("/weight",getWeightHistory);
router.post("/weight",weightEntry);
export default router;