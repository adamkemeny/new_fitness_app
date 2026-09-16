import { Workout } from "../models/Workout.js";
import { generateBroSplit } from "./workoutstrategies/brosplitgeneratorservice.js";
import { generateFullbody } from "./workoutstrategies/fullbodygeneratorservice.js";
import { generateHIIT } from "./workoutstrategies/hiitgeneratorservice.js";
import { generateHomeWorkout } from "./workoutstrategies/homeworkoutgeneratorservice.js";
import { generatePPL } from "./workoutstrategies/pplgeneratorservice.js";
import { generateUpperLower } from "./workoutstrategies/upperlowergeneratorservice.js";

export const generateWorkouts = async (user) => {
  
  const all = await Workout.find().lean();
  const workoutMap = Object.fromEntries(all.map((w) => [w._id, w]));
  const preferedLocation = user.preferedLocation;
  const goal = user.goal;
  const availability = user.availability;
  let dayCount = 0;
  let workouts;
  let listOfAvailableDays = [];
  for(const [day,hours] of Object.entries(availability)){
    if(hours.length > 0){
      dayCount += 1;
      listOfAvailableDays.push(day);
    }
  }
  if(preferedLocation == "gym" || preferedLocation == "both"){
    if(dayCount === 1 || dayCount === 2){
      workouts = await generateFullbody(user);
    }
    else if(dayCount === 3){
      let isEverydaySuitable = true;
      for(const day of listOfAvailableDays){
        console.log(day);
        if(availability[day].length != 1){
          isEverydaySuitable = false;
          break;
        }
      }
      if(isEverydaySuitable){
        workouts = await generatePPL(user);
      }
      else{
        workouts = await generateFullbody(user);
      }
    }
    else if(dayCount == 4){
      workouts = await generateUpperLower(user);
    }
    else if(dayCount == 5){
      workouts = await generateBroSplit(user);
    }
    else if(dayCount == 6){
      workouts = await generatePPL(user);
    }
    else if(dayCount == 7){
      workouts = await generateUpperLower(user);
    }

  }
  else{
    if(goal == "lose"){
      workouts = await generateHIIT(user,dayCount);
    }
    else{
      workouts = await generateHomeWorkout(user);
    }
  }
    
  

  /*if(preferedLocation == "gym" || preferedLocation == "both"){
    if(goal == "lose"){
      workouts = await generateFullbody(user); 
    }
    else if(goal == "upkeep"){
      workouts = await generatePPL(user);
    }
    else
    {
      workouts = await generateUpperLower(user);
    }
  }
  else if(preferedLocation == "other" || preferedLocation == "both"){
    if(goal == "lose"){
      workouts = await generateHIIT(user); 
    }
    else if(goal == "upkeep"){
      workouts = await generateHomeWorkout(user);
    }
    else
    {
      workouts = await generateHomeWorkout(user);
    }
  }*/

  
  return workouts;
};
