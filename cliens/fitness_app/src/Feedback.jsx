import { useState } from "react";
import axios from "./API/axios";

export default function Feedback (){
    const [planID,setPlanID] = useState("");
    const [feedback,setFeedback] = useState("");

    const handleFeedback = async () => {
        try {
            await axios.patch("/feedback",
                { planID: planID,
                  feedback: feedback
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            alert("Feedback saved.");
            setPlanID("");
            setFeedback("");
        } catch (error) {
            alert("Error while sending feedback.");
        }
    }
    return (
    <div>
      <h2>Plan Feedback</h2>

      <input
        value={planID}
        onChange={(e) => setPlanID(e.target.value)}
        placeholder="Plan ID"
      />

      <input
        type="number"
        min="1"
        max="5"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Rating (1-5)"
      />

      <button onClick={handleFeedback}>
        Submit
      </button>
      <div>
        <h6>
          See weight history <a href="/progress/weight">here</a>
        </h6>
        <h6>
          See workout history <a href="/progress/workout">here</a>
        </h6>
        <h6>
          See calorie history <a href="/progress/macro">here</a>
        </h6>
        <h6>
          Mark a plan as completed <a href="/plan/complete">here</a>
        </h6>
      </div>
    </div>
  );
}