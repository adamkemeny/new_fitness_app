import { response } from "express";
import { Plan } from "../models/Plan.js";
import { User } from "../models/User.js";

//az izomépítő gyakorlatokhoz caloriesPerReps

const estimateCalories = (w) => {
  if (w.type === "cardio") {
    return w.duration * w.caloriesPerMin;
  } else {
    return w.sets * w.reps * w.caloriesPerMin;
  }
};

const calculateBurn = (w, input) => {
  if (w.type === "cardio") {
    return input.durationDone * w.caloriesPerMin;
  } else {
    return input.repsDone * w.caloriesPerMin;
  }
};

export const saveProgress = async (req, res) => {
  const userID = req.userID;
  const { planID, date, workouts, meals } = req.body;
  const plan = await Plan.findById(planID);
  if (!plan) {
    return res.status(404).json({ Error: "Error: Plan not found" });
  }
  const normalize = (s) => s?.trim().toLowerCase();
  const dayPlan = plan.workouts.find(
    (w) => normalize(w.day) === normalize(date),
  );
  const mealPlan = plan.meals.find((w) => normalize(w.day) === normalize(date));
  let totalBurned = 0;
  let totalIntake = 0;

  const workoutResults = dayPlan.workouts.map((w) => {
    const input = workouts?.find((x) => x.workoutID === w._id);
    if (!input) {
      const burned = estimateCalories(w);
      totalBurned += burned;
      return {
        workoutID: w._id,
        done: true,
        repsDone: w.reps,
        durationDone: w.duration || null,
        caloriesBurned: burned,
      };
    }
    const burned = calculateBurn(w, input);
    totalBurned += burned;
    return {
      workoutID: w._id,
      done: true,
      repsDone: w.reps || input.repsDone,
      durationDone: w.duration || input.durationDone,
      caloriesBurned: burned,
    };
  });

  const mealResults = mealPlan.meals.map((m) => {
    const input = meals?.find((x) => x.mealID === m._id);
    if (!input) {
      totalIntake += m.calories;
      return {
        mealID: m._id,
        grammsDone: m.gramms,
        calories: m.calories,
      };
    }
    const ratio = input.grammsDone / m.gramms;
    const calories = m.calories * ratio;
    totalIntake += calories;
    return {
      mealID: m._id,
      grammsDone: input.grammsDone,
      calories: calories,
    };
  });
  const net = totalIntake - totalBurned;
  const log = {
    date: new Date(),
    workouts: workoutResults,
    meals: mealResults,
    totalBurned,
    totalIntake,
    net
  };
  plan.dailyLog.push(log);
  await plan.save();
  res.json(log);
};

export const getWeightHistory = async (req,res) => {
  const user = await User.findById(req.userID);
  if(!user){
    return res.status(404).json({error : "User not found"});
  }
  res.json({weightHistory : user.weightHistory});
};

export const weightEntry = async (req,res) => {
  const user = await User.findById(req.userID);
  if(!user){
    return res.status(404).json({error : "User not found"});
  }
  const {weight} = req.body;
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23,59,59,999);
  const existingEnrty = user.weightHistory.find((entry) => {
    return entry.date >= startOfDay && entry.date <= endOfDay;
  })
  if(existingEnrty){
    existingEnrty.weight = weight;
    existingEnrty.date = now;
  }
  else{
    user.weightHistory.push({date: new Date(), weight });
  }
  user.weight = weight;
  await user.save();
  res.json({weightHistory : user.weightHistory, userWeight: weight});
}
