import express from "express";
import {
  register,
  login,
  logout,
  getme,
} from "../controllers/authenticationcontroller.js";
import { authmiddleware } from "./auth.js";
import { registerSchema, loginSchema } from "../validator/authschemas.js";
import { validate } from "../validator/validate.js";
import { loginLimiter } from "../middlewares/limiters.js";
import { registerLimiter } from "../middlewares/limiters.js";

const router = express.Router();
router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authmiddleware, getme);
export default router;
