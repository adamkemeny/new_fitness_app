import express from "express";
import {getWeightHistory, weightEntry} from "../controllers/progresscontroller.js";
import { ShowPrevModel } from "../controllers/previouscontroller.js";
import { weightEntrySchema } from "../validator/progressschemas.js";
import { validate } from "../validator/validate.js"; 

const router = express.Router();
router.get("/plan/current",ShowPrevModel);
router.get("/weight",getWeightHistory);
router.post("/weight",validate(weightEntrySchema),weightEntry);
export default router;