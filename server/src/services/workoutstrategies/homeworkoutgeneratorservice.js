import { Workout } from "../../models/Workout.js";

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
export const generateHomeWorkout = async (user) => {
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
  const calves = workouts.filter(
    (w) => w.muscles.includes("vádli") && w.type != "cardio",
  );
  const shoulders = workouts.filter(
    (w) => w.muscles.includes("váll") && w.type != "cardio",
  );
  const arms = workouts.filter(
    (w) => w.muscles.includes("kar") && w.type != "cardio",
  );
  const abs = workouts.filter(
    (w) => w.muscles.includes("hasizom") && w.type != "cardio",
  );
  const cardio = workouts.filter((w) => w.type === "cardio");
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
    cardio: 0,
  };
  let day = 1;
  const prototype_home = () => {
    const rating = ratingGenerator(user);
    if (user.gender == "male") {
      if (goal == "bulk") {
        if (rating <= 4) {
          exercises.chest = 2;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.legs = 2;
          exercises.abs = 1;
        } else if (rating > 4 && rating < 9) {
          exercises.chest = 2;
          exercises.shoulders_push = 1;
          exercises.arms = 1;
          exercises.back = 1;
          exercises.shoulders_pull = 1;
          exercises.legs = 2;
          exercises.abs = 1;
        } else if (rating >= 9 && rating < 13) {
          exercises.chest = 2;
          exercises.shoulders_push = 1;
          exercises.arms_push = 1;
          exercises.back = 1;
          exercises.shoulders_pull = 1;
          exercises.arms_pull = 1;
          exercises.legs = 2;
          exercises.abs = 1;
        } else if (rating >= 13 && rating <= 16) {
          exercises.chest = 2;
          exercises.shoulders_push = 1;
          exercises.arms_push = 1;
          exercises.back = 2;
          exercises.shoulders_pull = 1;
          exercises.arms_pull = 1;
          exercises.legs = 2;
          exercises.abs = 1;
        } else {
          exercises.chest = 2;
          exercises.shoulders_push = 1;
          exercises.arms_push = 2;
          exercises.back = 2;
          exercises.shoulders_pull = 1;
          exercises.arms_pull = 2;
          exercises.legs = 1;
          exercises.legs_push = 1;
          exercises.legs_pull = 1;
          exercises.abs = 1;
        }
      } else {
        if (rating <= 4) {
          exercises.chest = 2;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.legs = 2;
          exercises.cardio = 1;
        } else if (rating > 4 && rating < 9) {
          exercises.chest = 2;
          exercises.shoulders_push = 1;
          exercises.arms = 1;
          exercises.back = 1;
          exercises.shoulders_pull = 1;
          exercises.legs = 2;
          exercises.cardio = 1;
        } else if (rating >= 9 && rating < 13) {
          exercises.chest = 2;
          exercises.shoulders_push = 1;
          exercises.arms_push = 1;
          exercises.back = 1;
          exercises.shoulders_pull = 1;
          exercises.arms_pull = 1;
          exercises.legs = 2;
          exercises.cardio = 1;
        } else if (rating >= 13 && rating <= 16) {
          exercises.chest = 2;
          exercises.shoulders_push = 1;
          exercises.arms_push = 1;
          exercises.back = 2;
          exercises.shoulders_pull = 1;
          exercises.arms_pull = 1;
          exercises.legs = 2;
          exercises.cardio = 1;
        } else {
          exercises.chest = 2;
          exercises.shoulders_push = 1;
          exercises.arms_push = 2;
          exercises.back = 2;
          exercises.shoulders_pull = 1;
          exercises.arms_pull = 2;
          exercises.legs = 1;
          exercises.legs_push = 1;
          exercises.legs_pull = 1;
          exercises.cardio = 1;
        }
      }
    } else {
      if (goal == "bulk") {
        if (rating <= 4) {
          exercises.legs = 2;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.abs = 1;
        } else if (rating > 4 && rating < 9) {
          exercises.legs = 3;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.abs = 1;
        } else if (rating >= 9 && rating < 13) {
          exercises.legs = 2;
          exercises.legs_push = 1;
          exercises.legs_pull = 1;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.abs = 1;
        } else if (rating >= 13 && rating <= 16) {
          exercises.legs = 1;
          exercises.legs_push = 2;
          exercises.legs_pull = 2;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.abs = 1;
        } else {
          exercises.legs = 2;
          exercises.legs_push = 2;
          exercises.legs_pull = 2;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.abs = 1;
        }
      } else {
        if (rating <= 4) {
          exercises.legs = 2;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.cardio = 1;
        } else if (rating > 4 && rating < 9) {
          exercises.legs = 3;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.cardio = 1;
        } else if (rating >= 9 && rating < 13) {
          exercises.legs = 2;
          exercises.legs_push = 1;
          exercises.legs_pull = 1;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.cardio = 1;
        } else if (rating >= 13 && rating <= 16) {
          exercises.legs = 1;
          exercises.legs_push = 2;
          exercises.legs_pull = 2;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.cardio = 1;
        } else {
          exercises.legs = 2;
          exercises.legs_push = 2;
          exercises.legs_pull = 2;
          exercises.chest = 1;
          exercises.shoulders = 1;
          exercises.back = 1;
          exercises.cardio = 1;
        }
      }
    }
  };

  const buildWorkout = () => {
    prototype_home();

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
