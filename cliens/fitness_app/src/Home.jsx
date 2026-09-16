//ai implementálás
import { useEffect } from "react";
import axios from "./API/axios";
import { useState } from "react";
import AvailabilityGrid from "./AvailabilityGrid.jsx";
import { useNavigate } from "react-router-dom";
function Home() {
  useEffect(() => {
    axios.get("/api/health").then((res) => console.log(res.data));
  }, []);
  const [formdata, setFormdata] = useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    goal: "upkeep",
    intolerances: [],
    dailyTime: "",
    preferedLocation: "gym",
    difficulty: "beginner",
    availability: {
      Hétfő: [],
      Kedd: [],
      Szerda: [],
      Csütörtök: [],
      Péntek: [],
      Szombat: [],
      Vasárnap: [],
    },
  });

  const [isGridOpen, setIsGridOpen] = useState(false);

  const [macros, setMacros] = useState(null);
  const [plan, setPlan] = useState(null);
  const [calories, setCalories] = useState(null);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const todayName = new Intl.DateTimeFormat("hu-HU", {
    weekday: "long",
  }).format(new Date());

  const capitalise = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const today = capitalise(todayName);

  const handleChange = (E) => {
    if (E.target.name === "gender" && E.target.value === undefined) {
      setFormdata({ ...formdata, [E.target.name]: "male" });
    } else if (E.target.name === "goal" && E.target.value === undefined) {
      setFormdata({ ...formdata, [E.target.name]: "upkeep" });
    } else if (
      E.target.name === "preferedLocation" &&
      E.target.value === undefined
    ) {
      setFormdata({ ...formdata, [E.target.name]: "gym" });
    } else {
      setFormdata({ ...formdata, [E.target.name]: E.target.value });
    }
  };

  const handleSubmit = async (E) => {
    E.preventDefault();

    try {
      const res = await axios.post("/api/calculate/calculate", formdata);
      setUser(res.data.user);
      setCalories(res.data.calories);
      setMacros(res.data.macros);
      setPlan(res.data.plan);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckbox = (E) => {
    const { value, checked } = E.target;
    if (checked) {
      setFormdata({
        ...formdata,
        intolerances: [...formdata.intolerances, value],
      });
    } else {
      setFormdata({
        ...formdata,
        intolerances: formdata.intolerances.filter((i) => i !== value),
      });
    }
  };

  const navigate = useNavigate();
  const handleGraphRedirector = () => {
    navigate("/progress/weight");
  };
  const sendMessage = async () => {
    if (!chatMessage.trim()) {
      return;
    }
    const currentMessage = chatMessage;
    const userMessage = { role: "user", content: currentMessage };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatMessage("");
    try {
      const res = await axios.post("/api/chat", {
        content: currentMessage,
        history: chatHistory.slice(-10),
      });
      const assistantMessage = { role: "assistant", content: res.data.reply };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "An error occured while responding." },
      ]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <input
          name="age"
          placeholder="Kor"
          onChange={handleChange}
          type="number"
          value={formdata.age}
        />

        <input
          name="weight"
          placeholder="Súly"
          onChange={handleChange}
          type="number"
          value={formdata.weight}
        />

        <input
          name="height"
          placeholder="Magasság"
          onChange={handleChange}
          type="number"
          value={formdata.height}
        />

        <input
          name="dailyTime"
          placeholder="Mennyi időd van naponta?"
          onChange={handleChange}
          type="number"
          value={formdata.dailyTime}
        />

        <select name="gender" onChange={handleChange}>
          <option value="male">Férfi</option>
          <option value="female">Nő</option>
        </select>

        <select name="goal" onChange={handleChange}>
          <option value="upkeep">Szintentartás</option>
          <option value="bulk">Izomtömegnövelés</option>
          <option value="lose">Fogyás</option>
        </select>

        <select name="lifestyle" onChange={handleChange}>
          <option value="sitting">Ülő életmód</option>
          <option value="slightlyactive">Enyhén aktív</option>
          <option value="moderatelyactive">Mérsékelten aktív</option>
          <option value="veryactive">Nagyon aktív</option>
          <option value="extremelyactive">Extra aktív</option>
        </select>

        <select name="difficulty" onChange={handleChange}>
          <option value="beginner">Kezdő</option>
          <option value="semi-advanced">Közép-haladó</option>
          <option value="advanced">Haladó</option>
          <option value="pro">Profi</option>
        </select>

        <select name="preferedLocation" onChange={handleChange}>
          <option value="gym">Edzőtermi edzés</option>
          <option value="other">Otthoni edzés (nem edzőtermi edzés)</option>
        </select>

        <div>
          <p>Ételintoleranciák:</p>

          <label>
            <input type="checkbox" value="lactose" onChange={handleCheckbox} />
            Laktóz
          </label>

          <label>
            <input type="checkbox" value="gluten" onChange={handleCheckbox} />
            Glutén
          </label>

          <label>
            <input type="checkbox" value="fish" onChange={handleCheckbox} />
            Hal
          </label>

          <label>
            <input type="checkbox" value="egg" onChange={handleCheckbox} />
            Tojás
          </label>
        </div>
        <AvailabilityGrid
          isOpen={isGridOpen}
          onClose={() => {
            setIsGridOpen(false);
          }}
          value={formdata.availability}
          onChange={(newAvailability) => {
            setFormdata({ ...formdata, availability: newAvailability });
          }}
        />
        <button type="button" onClick={() => setIsGridOpen(true)}>
          Inkább megmondom mikor érek rá...
        </button>

        <button type="submit">Terv generálása</button>
      </form>

      <button type="navigateToGraph" onClick={handleGraphRedirector}>
        Grafikon megtekintése
      </button>

      {calories && <h2>Napi kalória: {calories}</h2>}

      {macros && (
        <div>
          <p>Fehérje: {macros.protein}</p>
          <p>Szénhidrát: {macros.carbs}</p>
          <p>Zsír: {macros.fat}</p>
        </div>
      )}

      {plan && (
        <div style={{ marginTop: "30px" }}>
          <h2>Heti terv</h2>

          {plan.meals.map((dayPlan, i) => {
            
            const workoutDay = plan.workouts?.[i];

            return (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  marginBottom: "20px",
                  padding: "10px",
                }}
              >
                <h3>
                  {dayPlan.day} {workoutDay?.type ? `(${workoutDay.type})` : ""}
                </h3>

                <h4>Étrend</h4>
                {dayPlan.meals?.map((meal, idx) => (
                  <div key={idx}>
                    <b>{meal.type}</b> — {meal.name}
                    <br />
                    {meal.calories} kcal / {meal.gramms}g
                  </div>
                ))}

                <h4 style={{ marginTop: "10px" }}>Edzés</h4>

                {workoutDay?.workouts?.length > 0 ? (
                  workoutDay.workouts.map((w, idx) => {
                    
                    if (typeof w === "string") {
                      return (
                        <div key={idx}>
                          <b>{w}</b> (Részletek betöltése...)
                        </div>
                      );
                    }

                    const isRest =
                      w._id?.includes("rest") || w.name?.includes("Pihenő");

                    return (
                      <div key={idx} style={{ marginBottom: "8px" }}>
                        <b>{w.name || "Pihenő nap"}</b>
                        <br />

                        {isRest ? (
                          <span>Élvezd a jól megérdemelt pihenést!</span>
                        ) : (
                          <>
                            {w.sets > 0 && w.reps > 0 && (
                              <span>
                                Sorozat: {w.sets} × {w.reps}
                              </span>
                            )}
                            {w.duration > 0 && (
                              <span>Időtartam: {w.duration} perc</span>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p>Nincs mára tervezett edzés</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "50px" }}>
        <h3>🤖 AI Fitness Coach</h3>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            height: "300px",
            overflowY: "auto",
            marginBottom: "10px",
          }}
        >
          {chatHistory.length === 0 && (
            <p style={{ color: "#777" }}>
              Kérdezz valamit az edzésedről vagy étrendedről!
            </p>
          )}

          {chatHistory.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                marginBottom: "10px",
              }}
            >
              <b>{msg.role === "user" ? "Te" : "AI Coach"}</b>

              <div>{msg.content}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Kérdezz valamit..."
            style={{
              flex: 1,
              padding: "10px",
            }}
          />

          <button type="button" onClick={sendMessage}>
            Küldés
          </button>
        </div>
      </div>

      {user && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 20,
            padding: "8px 12px",
            background: "#222",
            color: "white",
            borderRadius: "8px",
          }}
        >
          👤 {user.name}
          <button onClick={handleLogOut}>Kijelentkezés</button>
        </div>
      )}
    </div>
  );
}

export default Home;
/*
 */
