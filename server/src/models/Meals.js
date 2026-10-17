import mongoose from "mongoose";

const mealsSchema = new mongoose.Schema({
  name: String,
  category: String,
  calories: Number,
  carbs: Number,
  fats: Number,
  protein: Number,
  intolerances: [String],
  type: [String],
});
export const Meals = mongoose.model("Meals", mealsSchema);
