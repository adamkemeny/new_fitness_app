import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { Plan } from "./models/Plan.js";
import { Workout } from "./models/Workout.js";
import { GeneratePlan } from "./services/plangenerator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authmiddleware } from "./routes/auth.js";
import { calculate } from "./services/calculateservice.js";
import chatrouter from "./routes/chatroute.js";
import calculating from "./routes/calculateroute.js";
import authenticationrouter from "./routes/authenticationroute.js";
import planrouter from "./routes/planroute.js";
import progressrouter from "./routes/progressroute.js";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/limiters.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.10:5173"
]

const app = express();
dotenv.config();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api",apiLimiter);

mongoose
  .connect(process.env.MONGO_ATLAS_URI, { dbName: "fitness-app" })
  .then(() => console.log("MongoDB is running"))
  .catch((R) => console.error("MongoDB Error: ", R));

app.use("/api/chat", authmiddleware, chatrouter);

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend működik 🚀" });
});

app.use("/api", (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const origin = req.get("Origin");

    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({
        error: "Forbidden origin.",
      });
    }
  }

  next();
});

app.use("/api/auth", authenticationrouter);

app.use("/api/calculate", authmiddleware, calculating);

app.use("/api/plan", authmiddleware, planrouter);

app.use("/api/progress", authmiddleware, progressrouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
