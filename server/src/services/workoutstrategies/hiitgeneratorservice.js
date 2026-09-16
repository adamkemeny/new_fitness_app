import { Workout } from "../../models/Workout.js";
import { ratingGenerator } from "../ratinggeneratorservice.js";

const shuffle = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5);
};

const pickOne = (arr, used, difficulty) => {
  const available1 = arr.filter((w) => !used.has(w._id));
  const available2 = available1.filter((w) => w.difficulty === difficulty);
  const available3 = available2.filter(
    (w) => w.location === "other" || w.location === "both",
  );

  if (available3.length == 0) {
    return null;
  }

  const selected = shuffle(available3)[0];

  used.add(selected._id);

  return selected;
};

export const generateHIIT = async (user, dayCount) => {
  const workouts = await Workout.find({ type: "cardio" }).lean();
  const used = new Set();
  const difficulty = user.difficulty;
  const numberOfCardios = {
    cardio: 0,
  };
  let day = 1;
  const prototype_hiit = () => {
    const rating = ratingGenerator(user);
    if (rating <= 5) {
      numberOfCardios.cardio = 1;
    } else if (rating > 5 && rating <= 10) {
      numberOfCardios.cardio = 2;
    } else if (rating >= 11 && rating <= 15) {
      numberOfCardios.cardio = 3;
    } else {
      numberOfCardios.cardio = 4;
    }
  };

  const buildWorkout = () => {
    prototype_hiit();
    let pickedExercises = [];
    for (let i = 0; i < numberOfCardios.cardio; i++) {
      const item = pickOne(workouts, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }

    day += 1;
    if (day == dayCount) {
      day = 1;
    }
    for (let key in numberOfCardios) {
      numberOfCardios[key] = 0;
    }
    return pickedExercises;
  };
  const weekDays = [
    "Hétfő",
    "Kedd",
    "Szerda",
    "Csütörtök",
    "Péntek",
    "Szombat",
    "Vasárnap",
  ];

  return await Promise.all(
    weekDays.map(async (dayName) => {
      if (user.availability[dayName]?.length > 0) {
        return {
          day: dayName,
          workouts: buildWorkout(),
        };
      }

      return {
        day: dayName,
        type: "rest",
        workouts: await Workout.find({ _id: "rest" }),
      };
    }),
  );
};
