import express from "express";
import { calculating } from "../controllers/calculatecontroller.js";
import { validate } from "../validator/validate.js";
import { profileSchema } from "../validator/profileschemas.js";

const router = express.Router();
router.post("/calculate",validate(profileSchema),calculating);
export default router;