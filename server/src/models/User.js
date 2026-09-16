import mongoose from "mongoose";

const weightHistorySchema = new mongoose.Schema({
    date : {type: Date, default : Date.now},
    weight : Number
});

const workoutHistorySchema = new mongoose.Schema({
    planID : {type: mongoose.Schema.Types.ObjectId, ref: "Plan"},
    date : {type: Date, default : Date.now},
    completed : Boolean,
    duration : Number
});

const macroHistorySchema = new mongoose.Schema({
    date : {type: Date, default : Date.now},
    calories : Number,
    carb : Number,
    protein : Number,
    fat : Number
});

const dailyLogSchema = new mongoose.Schema({
  day: String,
  date: { type: Date, default: Date.now() },
  workouts: [
    {
      workoutID: String,
      done: Boolean,
      repsDone: Number,
      durationDone: Number,
      caloriesBurned: Number,
    },
  ],
  meals: [{ mealID: String, grammsDone: Number, calories: Number }],
  totalBurned: Number,
  totalIntake: Number
});

const userSchema = new mongoose.Schema({
    name : String,
    age : Number,
    gender : String,
    weight : Number,
    height : Number,
    goal : String,
    intolerances : [String],
    dailyTime : Number,
    calories : Number,
    lifestyle : String,
    difficulty : String,
    preferedLocation : String,
    email : {type : String , unique : true},
    password : {type: String, required : true},
    weightHistory : [weightHistorySchema],
    workoutHistory : [workoutHistorySchema],
    macroHistory : [macroHistorySchema],
    dailyLog:[dailyLogSchema]
});

export const  User = mongoose.model("User", userSchema);
