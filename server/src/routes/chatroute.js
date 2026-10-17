import express from "express";
import { chatting } from "../controllers/chatcontroller.js";
import { chatSchema } from "../validator/chatschemas.js";
import { validate } from "../validator/validate.js";
import { chatLimiter } from "../middlewares/limiters.js";

const router = express.Router();
router.post("/",chatLimiter,validate(chatSchema),chatting);
export default router;
