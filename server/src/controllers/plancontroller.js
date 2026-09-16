import { Plan } from "../models/Plan.js";

export const complete = async (req, res) => {
    try {
        const planID = req.body;

        if(!planID){
            return res.status(400).json({
                error: "PlanID is required."
            });
        }

        const plan = await Plan.findOne({
            _id:planID,
            userID: req.userID
        });

        if(!plan){
            return res.status(404).json({
                error: "Plan not found."
            });
        }
        plan.completed = true;
        await plan.save();
        res.json({
            message: "Plan completed."
        });

    } catch (error) {
        res.status(500).json({
            error: "An error occured while completed a plan."
        });
    }
};

export const feedback = async (req, res) => {
    try {

        const {planID, feedback} = req.body;

        if(!planID || !feedback){
            return res.status(400).json({
                error: "PlanID and feedback are required."
            });
        }

        if(feedback < 1 || feedback > 5){
            return res.status(400).json({
                error: "Feedback must be 1-5."
            });
        }

           const plan = await Plan.findOne({
            _id:planID,
            userID: req.userID
        });

        if(!plan){
            return res.status(404).json({
                error: "Plan not found."
            });
        }
        plan.feedback = feedback;
        await plan.save();
        res.json({
            message: "Feedback saved."
        });

    } catch (error) {
        res.status(500).json({
            error: "An error occured while giving feedback."
        });
    }
}