import { Workout } from "../../models/Workout.js";
import { ratingGenerator } from "../ratinggeneratorservice.js";

const shuffle = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5);
};

const pickOne = (arr, used, difficulty) => {
  const available1 = arr.filter((w) => !used.has(w._id));
  const available2 = available1.filter((w) => w.difficulty === difficulty);
  const available3 = available2.filter(
    (w) => w.location === "gym" || w.location === "both",
  );
  const available4 = available3.filter((w) => w.type != "cardio");

  if (available4.length == 0) {
    return null;
  }

  const selected = shuffle(available4)[0];

  used.add(selected._id);

  return selected;
};
export const generateBroSplit = async (user) => {
  const difficulty = user.difficulty;
  const goal = user.goal;
  const workouts = await Workout.find().lean();
  const used = new Set();
  const chest = workouts.filter(
    (w) => w.muscles.includes("mell") && w.type != "cardio",
  );
  const back = workouts.filter(
    (w) => w.muscles.includes("hát") && w.type != "cardio",
  );
  const legs = workouts.filter(
    (w) => w.muscles.includes("láb") && w.type != "cardio",
  );
  const legs_push = workouts.filter(
    (w) => w.muscles.includes("feszítő") && w.type != "cardio",
  );
  const legs_pull = workouts.filter(
    (w) => w.muscles.includes("hajlító") && w.type != "cardio",
  );
  const glutes = workouts.filter(
    (w) => w.muscles.includes("fenék") && w.type != "cardio",
  );
  const calves = workouts.filter(
    (w) => w.muscles.includes("vádli") && w.type != "cardio",
  );
  const shoulders = workouts.filter(
    (w) => w.muscles.includes("váll") && w.type != "cardio",
  );
  const shoulders_push = workouts.filter(
    (w) =>
      (w.muscles.includes("elülsőváll") || w.muscles.includes("oldalsóváll")) &&
      w.type != "cardio",
  );
  const shoulders_pull = workouts.filter(
    (w) => w.muscles.includes("hátsóváll") && w.type != "cardio",
  );
  const arms = workouts.filter(
    (w) => w.muscles.includes("kar") && w.type != "cardio",
  );
  const arms_push = workouts.filter(
    (w) => w.muscles.includes("tricepsz") && w.type != "cardio",
  );
  const arms_pull = workouts.filter(
    (w) => w.muscles.includes("bicepsz") && w.type != "cardio",
  );
  const abs = workouts.filter(
    (w) => w.muscles.includes("hasizom") && w.type != "cardio",
  );

  const exercises = {
    chest: 0,
    back: 0,
    legs: 0,
    legs_push: 0,
    legs_pull: 0,
    glutes: 0,
    calves: 0,
    shoulders: 0,
    shoulders_push: 0,
    shoulders_pull: 0,
    arms: 0,
    arms_push: 0,
    arms_pull: 0,
    abs: 0,
  };
  let day = 1;
  const prototype_chest = () => {
    const rating = ratingGenerator(user);
    if (goal == "bulk") {
      if (rating <= 4) {
        exercises.chest = 3;
        exercises.abs = 1;
      } else if (rating > 4 && rating < 9) {
        exercises.chest = 4;
        exercises.abs = 1;
      } else if (rating >= 9 && rating < 13) {
        exercises.chest = 5;
        exercises.abs = 1;
      } else if (rating >= 13 && rating <= 16) {
        exercises.chest = 6;
        exercises.abs = 1;
      } else {
        exercises.chest = 7;
        exercises.abs = 1;
      }
    } else {
      if (rating <= 4) {
        exercises.chest = 3;
      } else if (rating > 4 && rating < 9) {
        exercises.chest = 4;
      } else if (rating >= 9 && rating < 13) {
        exercises.chest = 5;
      } else if (rating >= 13 && rating <= 16) {
        exercises.chest = 6;
      } else {
        exercises.chest = 7;
      }
    }
  };
  const prototype_back = () => {
    const rating = ratingGenerator(user);
    if (goal == "bulk") {
      if (rating <= 4) {
        exercises.back = 3;
        exercises.abs = 1;
      } else if (rating > 4 && rating < 9) {
        exercises.back = 4;
        exercises.abs = 1;
      } else if (rating >= 9 && rating < 13) {
        exercises.back = 5;
        exercises.abs = 1;
      } else if (rating >= 13 && rating <= 16) {
        exercises.back = 6;
        exercises.abs = 1;
      } else {
        exercises.back = 7;
        exercises.abs = 1;
      }
    } else {
      if (rating <= 4) {
        exercises.back = 3;
      } else if (rating > 4 && rating < 9) {
        exercises.back = 4;
      } else if (rating >= 9 && rating < 13) {
        exercises.back = 5;
      } else if (rating >= 13 && rating <= 16) {
        exercises.back = 6;
      } else {
        exercises.back = 7;
      }
    }
  };

  const prototype_legs = () => {
    const rating = ratingGenerator(user);
    if (goal == "bulk") {
      if (rating <= 4) {
        exercises.legs = 3;
        exercises.abs = 1;
      } else if (rating > 4 && rating < 9) {
        exercises.legs = 2;
        exercises.legs_push = 1;
        exercises.legs_pull = 1;
        exercises.abs = 1;
      } else if (rating >= 9 && rating < 13) {
        exercises.legs = 2;
        exercises.legs_push = 1;
        exercises.legs_pull = 1;
        exercises.glutes = 1;
        exercises.abs = 1;
      } else if (rating >= 13 && rating <= 16) {
        exercises.legs = 2;
        exercises.legs_push = 1;
        exercises.legs_pull = 1;
        exercises.glutes = 1;
        exercises.calves = 1;
        exercises.abs = 1;
      } else {
        exercises.legs = 1;
        exercises.legs_push = 2;
        exercises.legs_pull = 2;
        exercises.glutes = 1;
        exercises.calves = 1;
        exercises.abs = 1;
      }
    } else {
      if (rating <= 4) {
        exercises.legs = 3;
      } else if (rating > 4 && rating < 9) {
        exercises.abs = 2;
        exercises.legs_push = 1;
        exercises.legs_pull = 1;
      } else if (rating >= 9 && rating < 13) {
        exercises.legs = 2;
        exercises.legs_push = 1;
        exercises.legs_pull = 1;
        exercises.glutes = 1;
      } else if (rating >= 13 && rating <= 16) {
        exercises.legs = 2;
        exercises.legs_push = 1;
        exercises.legs_pull = 1;
        exercises.glutes = 1;
        exercises.calves = 1;
      } else {
        exercises.legs = 1;
        exercises.legs_push = 2;
        exercises.legs_pull = 2;
        exercises.glutes = 1;
        exercises.calves = 1;
      }
    }
  };

  const prototype_shoulders = () => {
    const rating = ratingGenerator(user);
    if (goal == "bulk") {
      if (rating <= 4) {
        exercises.shoulders = 3;
        exercises.abs = 1;
      } else if (rating > 4 && rating < 9) {
        exercises.shoulders = 2;
        exercises.shoulders_push = 1;
        exercises.shoulders_pull = 1;
        exercises.abs = 1;
      } else if (rating >= 9 && rating < 13) {
        exercises.shoulders = 1;
        exercises.shoulders_push = 2;
        exercises.shoulders_pull = 2;
        exercises.abs = 1;
      } else if (rating >= 13 && rating <= 16) {
        exercises.shoulders = 2;
        exercises.shoulders_push = 2;
        exercises.shoulders_pull = 2;
        exercises.abs = 1;
      } else {
        exercises.shoulders = 3;
        exercises.shoulders_push = 2;
        exercises.shoulders_pull = 2;
        exercises.abs = 1;
      }
    } else {
      if (rating <= 4) {
        exercises.shoulders = 3;
      } else if (rating > 4 && rating < 9) {
        exercises.shoulders = 2;
        exercises.shoulders_push = 1;
        exercises.shoulders_pull = 1;
      } else if (rating >= 9 && rating < 13) {
        exercises.shoulders = 1;
        exercises.shoulders_push = 2;
        exercises.shoulders_pull = 2;
      } else if (rating >= 13 && rating <= 16) {
        exercises.shoulders = 2;
        exercises.shoulders_push = 2;
        exercises.shoulders_pull = 2;
      } else {
        exercises.shoulders = 3;
        exercises.shoulders_push = 2;
        exercises.shoulders_pull = 2;
      }
    }
  };
  const prototype_arms = () => {
    const rating = ratingGenerator(user);
    if (goal == "bulk") {
      if (rating <= 4) {
        exercises.arms = 3;
        exercises.abs = 1;
      } else if (rating > 4 && rating < 9) {
        exercises.arms = 2;
        exercises.arms_push = 1;
        exercises.arms_pull = 1;
        exercises.abs = 1;
      } else if (rating >= 9 && rating < 13) {
        exercises.arms = 1;
        exercises.arms_push = 2;
        exercises.arms_pull = 2;
        exercises.abs = 1;
      } else if (rating >= 13 && rating <= 16) {
        exercises.arms = 2;
        exercises.arms_push = 2;
        exercises.arms_pull = 2;
        exercises.abs = 1;
      } else {
        exercises.arms = 3;
        exercises.arms_push = 2;
        exercises.arms_pull = 2;
        exercises.abs = 1;
      }
    } else {
      if (rating <= 4) {
        exercises.arms = 3;
      } else if (rating > 4 && rating < 9) {
        exercises.arms = 2;
        exercises.arms_push = 1;
        exercises.arms_pull = 1;
      } else if (rating >= 9 && rating < 13) {
        exercises.arms = 1;
        exercises.arms_push = 2;
        exercises.arms_pull = 2;
      } else if (rating >= 13 && rating <= 16) {
        exercises.arms = 2;
        exercises.arms_push = 2;
        exercises.arms_pull = 2;
      } else {
        exercises.arms = 3;
        exercises.arms_push = 2;
        exercises.arms_pull = 2;
      }
    }
  };

  const buildWorkout = () => {
    switch (day) {
      case 1:
        prototype_chest();
        break;
      case 2:
        prototype_back();
        break;
      case 3:
        prototype_legs();
        break;
      case 4:
        prototype_shoulders();
        break;
      case 5:
        prototype_arms();
        break;
      default:
        break;
    }

    let pickedExercises = [];
    for (let i = 0; i < exercises.chest; i++) {
      const item = pickOne(chest, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.back; i++) {
      const item = pickOne(back, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.legs; i++) {
      const item = pickOne(legs, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.legs_push; i++) {
      const item = pickOne(legs_push, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.legs_pull; i++) {
      const item = pickOne(legs_pull, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.glutes; i++) {
      const item = pickOne(glutes, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.calves; i++) {
      const item = pickOne(calves, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.shoulders; i++) {
      const item = pickOne(shoulders, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.shoulders_push; i++) {
      const item = pickOne(shoulders_push, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.shoulders_pull; i++) {
      const item = pickOne(shoulders_pull, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.arms; i++) {
      const item = pickOne(arms, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.arms_push; i++) {
      const item = pickOne(arms_push, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.arms_pull; i++) {
      const item = pickOne(arms_pull, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }
    for (let i = 0; i < exercises.abs; i++) {
      const item = pickOne(abs, used, difficulty);
      if (item) {
        pickedExercises.push(item);
      }
    }

    for (let exercise in exercises) {
      exercise = 0;
    }

    day += 1;
    if (day == 6) {
      day = 1;
    }
    for (let key in exercises) {
      exercises[key] = 0;
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
