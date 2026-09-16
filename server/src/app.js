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
import  chatrouter  from "./routes/chatroute.js";
import  calculating  from "./routes/calculateroute.js";
import  authenticationrouter  from "./routes/authenticationroute.js";
import  planrouter  from "./routes/planroute.js"
import  progressrouter  from "./routes/progressroute.js"
//import  userRouter  from "./routes/userRoute.js";
//import profileRouter from "./routes/profileRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

mongoose
  .connect(process.env.MONGO_ATLAS_URI,{dbName: "fitness-app"})
  .then(() => console.log("MongoDB is running"))
  .catch((R) => console.error("MongoDB Error: ", R));

app.get("/api/users", authmiddleware,async (req, res) => {
  const users = await User.find();
  res.json({users});
});


app.use("/api/chat",authmiddleware,chatrouter);

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend működik 🚀" });
});

app.get("/api/users", async (req, res) => {
  const Users = await User.find();
  res.json({ Users });
});

app.use("/api/auth",authenticationrouter);

app.use("/api/calculate", authmiddleware,calculating);

app.use("/api/plan",authmiddleware,planrouter);

app.use ("/api/progress",authmiddleware,progressrouter);



const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
