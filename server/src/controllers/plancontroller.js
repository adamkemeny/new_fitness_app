import { Plan } from "../models/Plan.js";
import { User } from "../models/User.js";
import { GenerateMeals } from "../services/plangenerator.js";

const oneWeek = 7 * 24 * 60 * 60 * 1000;

export const complete = async (req, res) => {
  try {
    const planID = req.body;

    if (!planID) {
      return res.status(400).json({
        error: "PlanID is required.",
      });
    }

    const plan = await Plan.findOne({
      _id: planID,
      userID: req.userID,
    });

    if (!plan) {
      return res.status(404).json({
        error: "Plan not found.",
      });
    }
    plan.completed = true;
    await plan.save();
    res.json({
      message: "Plan completed.",
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occured while completed a plan.",
    });
  }
};

export const feedback = async (req, res) => {
  try {
    const { planID, feedback } = req.body;

    if (!planID || !feedback) {
      return res.status(400).json({
        error: "PlanID and feedback are required.",
      });
    }

    if (feedback < 1 || feedback > 5) {
      return res.status(400).json({
        error: "Feedback must be 1-5.",
      });
    }

    const plan = await Plan.findOne({
      _id: planID,
      userID: req.userID,
    });

    if (!plan) {
      return res.status(404).json({
        error: "Plan not found.",
      });
    }
    plan.feedback = feedback;
    await plan.save();
    res.json({
      message: "Feedback saved.",
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occured while giving feedback.",
    });
  }
};

export const getCurrentPlan = async (req, res) => {
  try {
    const user = await User.findById(req.userID);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const plan = await Plan.findOne({ userID: req.userID }).sort({
      createdAt: -1,
    });
    if (!plan) {
      return res.json({
        plan: null,
        user,
        canGenerate: true,
        nextPlanAt: null,
      });
    }
    const lastMealUpdate = plan.mealsUpdatedAt || plan.createdAt;
    const now = Date.now();
    if (now - new Date(lastMealUpdate).getTime() >= oneWeek) {
      const newMeals = await GenerateMeals(user, plan.calories);
      plan.meals = newMeals;
      plan.mealsUpdatedAt = new Date();
      await plan.save();
    }
    const nextTime = new Date(plan.createdAt).getTime() + oneWeek;
    const canGenerate = now >= nextTime;
    res.json({ plan, user, canGenerate, nextPlanAt: new Date(nextTime) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while loading current plan." });
  }
};
export const savePlan = async (req, res) => {
  try {
    const { draftPlan, profile } = req.body;
    if (!draftPlan || !draftPlan.meals || !draftPlan.workouts) {
      return res.status(400).json({ error: "DraftPlan is required." });
    }
    const user = await User.findById(req.userID);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const currentPlan = await Plan.findOne({ userID: req.userID }).sort({
      createdAt: -1,
    });
    if (currentPlan) {
      const nextTime = new Date(plan.createdAt).getTime() + oneWeek;
      if (Date.now() < nextTime) {
        return res.status(403).json({
          error: `You can not create a new plan at the moment. Try again at:${nextTime} `,
        });
      }
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
      if (profile?.[field] !== undefined) {
        user[field] = profile[field];
      }
    });
    const newPlan = await Plan.create({
      userID: req.userID,
      calories: draftPlan.calories,
      macros: draftPlan.macros,
      meals: draftPlan.meals,
      workouts: draftPlan.workouts,
      mealsUpdatedAt: new Date(),
    });
    if (profile?.weight) {
      user.weightHistory.push({ date: new Date(), weight: profile.weight });
    }
    await user.save();
    const nextPlanAt = new Date(newPlan.createdAt.getTime() + oneWeek);
    res.json({message: "Plan saved.", plan: newPlan, user, canGenerate: false, nextPlanAt});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Error while saving Plan."});
  }
};
