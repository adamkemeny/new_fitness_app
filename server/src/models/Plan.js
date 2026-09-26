import mongoose from "mongoose";
import { workoutSchema } from "./Workout.js";

const mealItemSchema = new mongoose.Schema({
  day: String,
  meals: [{ type: Object, ref: "Meals" }],
});
const workoutItemSchema = new mongoose.Schema(
  {
    day: String,
    workouts: [workoutSchema],
  },
  { _id: false },
);
const dailyLogSchema = new mongoose.Schema({
  day: String,
  date: { type: Date, default: Date.now() },
  workouts: [
    {
      workoutID: String,
      done: Boolean,
      repsDone: Number,
      durationDone: Number,
      caloriesBurned: Number,
    },
  ],
  meals: [{ mealID: String, grammsDone: Number, calories: Number }],
});

const planSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  calories: Number,
  workouts: [workoutItemSchema],
  meals: [mealItemSchema],
  mealsUpdatedAt: {type: Date, default: Date.now},
  createdAt: { type: Date, default: Date.now },
  macros: { protein: Number, fat: Number, carbs: Number },
  completed: { type: Boolean, default: false },
  feedback: { type: Number, min: 1, max: 5 },
  dailyLog: [dailyLogSchema]
});

export const Plan = mongoose.model("Plan", planSchema);
