// melyik edzés lenne a legoptimálisabb a felhasználó számára (idő alapján, cél alapján, nap alapján[melyik nap ér rá])
//  ételek hozáadása

import { Meals } from "../models/Meals.js";
import { generateMeals } from "./mealgeneratorservice.js";
import { generateWorkouts } from "./workoutgenaratorservice.js";



export const GeneratePlan = async (User,Macros,calories) => {
    const breakfasts = await Meals.find({
        category : "breakfast"
    });
     const morningsnacks = await Meals.find({
        category : "morning_snack"
    });
     const lunches = await Meals.find({
        category : "lunch"
    });
     const afternoonsnacks = await Meals.find({
        category : "afternoon_snack"
    });
     const dinners = await Meals.find({
        category : "dinner"
    });
     const snacks = await Meals.find({
        category : "snack"
    });

    const foodData = {breakfasts,morningsnacks,lunches,afternoonsnacks,dinners,snacks};
    
    const days = ["Hetfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    
    const meals = days.map(day => ({
        day, meals:generateMeals(calories,User.intolerances,foodData)
    })
    );

   const workouts = await generateWorkouts(User);
   return{workouts,meals};
}