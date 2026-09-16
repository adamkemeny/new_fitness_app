import { randomItem } from "./foodservice.js";

export const generateMeals = (calories, intolerances, foodData) => {
  const { breakfasts,morningsnacks,lunches,afternoonsnacks,dinners, snacks} = foodData;

  const breakfast = randomItem(breakfasts, intolerances);
  const morningsnack = randomItem(morningsnacks, intolerances);
  const lunch = randomItem(lunches, intolerances);
  const afternoonsnack = randomItem(afternoonsnacks, intolerances);
  const dinner = randomItem(dinners, intolerances);
  const snack = randomItem(snacks, intolerances);

  const breakfastCal = Math.round(calories * 0.1);
  const morningsnackCal = Math.round(calories * 0.066);
  const lunchCal = Math.round(calories * 0.4);
  const afternoonsnackCal = Math.round(calories * 0.066);
  const dinnerCal = Math.round(calories * 0.3);
  const snackCal = Math.round(calories * 0.066);

  const calculateGramm = (targetCalories, calPer100g) => {
    return Math.round((targetCalories / calPer100g) * 100);
  };

  if (!breakfast || !morningsnack || !lunch || !afternoonsnack || !dinner || !snack) {
    throw new Error("Meal generation failed!");
  }

 return [
    {
      type: "Reggeli",
      _id: breakfast._id,
      name: breakfast.name,
      calories: breakfastCal,
      gramms: calculateGramm(breakfastCal, breakfast.calories),
    },
    {
      type: "Tízórai",
      _id: morningsnack._id,
      name: morningsnack.name,
      calories: morningsnackCal,
      gramms: calculateGramm(morningsnackCal, morningsnack.calories),
    },
    {
      type: "Ebéd",
      _id: lunch._id,
      name: lunch.name,
      calories: lunchCal,
      gramms: calculateGramm(lunchCal, lunch.calories),
    },
    {
      type: "Uzsonna",
      _id: afternoonsnack._id,
      name: afternoonsnack.name,
      calories: afternoonsnackCal,
      gramms: calculateGramm(afternoonsnackCal, afternoonsnack.calories),
    },
    {
      type: "Vacsora",
      _id: dinner._id,
      name: dinner.name,
      calories: dinnerCal,
      gramms: calculateGramm(dinnerCal, dinner.calories),
    },
    {
      type: "Nasi",
      _id: snack._id,
      name: snack.name,
      calories: snackCal,
      gramms: calculateGramm(snackCal, snack.calories),
    }
  ];
};
