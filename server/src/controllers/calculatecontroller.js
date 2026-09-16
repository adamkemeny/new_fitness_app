import { Plan } from "../models/Plan.js";
import { User } from "../models/User.js";
import { calculate } from "../services/calculateservice.js";
import { GeneratePlan } from "../services/plangenerator.js";

export const calculating = async (req, res) => {
  const userData = req.body;
  const user = await User.findById(req.userID);

  if (!user) {
    return res.status(404).json({
      error: "User not found.",
    });
  }
  const allowedFields = [
    "name",
    "age",
    "weight",
    "height",
    "goal",
    "intolerances",
    "dailyTime",
    "lifestyle",
    "gender",
    "preferedLocation",
    "difficulty",
    "availability",
    "weightHistory",
  ];

  allowedFields.forEach((field) => {
    if (userData[field] !== undefined) {
      user[field] = userData[field];
    }
  });
  user.weightHistory.push({date: new Date(), weight: user.weight});
  await user.save();

  const { calories, macros } = calculate(user);

  await Plan.deleteMany({
    userID: user._id,
  });

  const planData = await GeneratePlan(user, macros, calories);
  let plan = await Plan.create({
    userID: user._id,
    calories,
    macros,
    meals: planData.meals,
    workouts: planData.workouts,
  });

  user.macroHistory.push({
    date: new Date(),
    calories: calories,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
  });

  user.workoutHistory.push({
    planId: plan._id,
    completed: false,
    duration: 0,
    date: new Date(),
  });
  await user.save();
  res.json({ macros, plan, calories, user });
};
