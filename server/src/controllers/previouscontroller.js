import { User } from "../models/User.js";
import { Plan } from "../models/Plan.js";

export const ShowPrevModel = async (req, res) => {
  try {
    const userID = req.userID;
    const plan = await Plan.findOne({ userID: userID }).sort({ createdAt: -1 });
    const user = await User.findById(userID);
    res.json({plan,user});
  } catch (error) {
    console.log(error);
  }
};
