//  ételek hozáadása

import { Meals } from "../models/Meals.js";
import { User } from "../models/User.js";
import { generateMeals } from "./mealgeneratorservice.js";
import { generateWorkouts } from "./workoutgenaratorservice.js";

const getFoodData = async () => {
  const breakfasts = await Meals.find({
    category: "breakfast",
  });
  const morningsnacks = await Meals.find({
    category: "morning_snack",
  });
  const lunches = await Meals.find({
    category: "lunch",
  });
  const afternoonsnacks = await Meals.find({
    category: "afternoon_snack",
  });
  const dinners = await Meals.find({
    category: "dinner",
  });
  const snacks = await Meals.find({
    category: "snack",
  });

  return {
    breakfasts,
    morningsnacks,
    lunches,
    afternoonsnacks,
    dinners,
    snacks,
  };
};

export const GenerateMeals = async (user, calories) => {
    const days = [
    "Hetfő",
    "Kedd",
    "Szerda",
    "Csütörtök",
    "Péntek",
    "Szombat",
    "Vasárnap",
  ];
  const foodData = await getFoodData();
  const meals = days.map((day) => ({
    day,
    meals: generateMeals(calories, user.intolerances, foodData),
  }));
  return meals;
}

export const GeneratePlan = async (User, Macros, calories) => {
  const workouts = await generateWorkouts(User);
  const meals = await GenerateMeals (User, calories);
  return { workouts, meals };
};
