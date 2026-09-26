import { Plan } from "../models/Plan.js";
import { User } from "../models/User.js";
import { calculate } from "../services/calculateservice.js";
import { GeneratePlan } from "../services/plangenerator.js";

const oneWeek = 7*24*60*60*1000;

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

  const currentPlan = await Plan.findOne({ userID: req.userID }).sort({createdAt: -1});

  if(currentPlan){
    const nextPlanDate = new Date(currentPlan.createdAt).getTime() + oneWeek;
    if(Date.now() < nextPlanDate){
      return res.status(403).json({error: "Még nem generálhatsz új tervet.", nextPlanAt: new Date(nextPlanDate)});
    }
  }

  const draftUser = user.toObject();

  allowedFields.forEach((field) => {
    if (userData[field] !== undefined) {
      draftUser[field] = userData[field];
    }
  });

  if(!draftUser.availability){
    return res.status(400).json({error: "Availability is requred."});
  }

  const { calories, macros } = calculate(draftUser);

  const planData = await GeneratePlan(draftUser, macros, calories);
  
  const  draftPlan = {
    calories,
    macros,
    meals: planData.meals,
    workouts: planData.workouts,
  };
  
  res.json({ macros, plan: draftPlan, calories, user });
};
