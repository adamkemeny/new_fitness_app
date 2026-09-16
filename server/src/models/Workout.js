import mongoose from "mongoose";

export const workoutSchema = new mongoose.Schema({
  _id: String,
  name: String,
  type: String,
  sets: Number,
  reps: Number,
  duration: Number,
  caloriesPerMin: Number,
});
export const Workout = mongoose.model("Workout", workoutSchema);
