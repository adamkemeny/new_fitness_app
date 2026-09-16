import express from "express";
import { calculating } from "../controllers/calculatecontroller.js";

const router = express.Router();
router.post("/calculate",calculating);
export default router;