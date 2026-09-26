import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import axios from "./API/axios";
import AvailabilityGrid from "./AvailabilityGrid.jsx";

import "./All-pages.css";

function Home() {
  const navigate = useNavigate();

  /* =========================================================
     FORM DATA
  ========================================================= */

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
    lifestyle: "sitting",

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

  /* =========================================================
     STATES
  ========================================================= */

  const [isGridOpen, setIsGridOpen] = useState(false);

  const [macros, setMacros] = useState(null);
  const [calories, setCalories] = useState(null);

  const [plan, setPlan] = useState(null);
  const [savedPlan, setSavedPlan] = useState(null);

  const [isDraft, setIsDraft] = useState(false);

  const [canGenerate, setCanGenerate] = useState(false);
  const [nextPlanAt, setNextPlanAt] = useState(null);

  const [loadingPlan, setLoadingPlan] = useState(true);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");

    return saved ? JSON.parse(saved) : null;
  });

  /* =========================================================
     CHAT STATES
  ========================================================= */

  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  /* =========================================================
     CURRENT PLAN BETÖLTÉSE
  ========================================================= */

  useEffect(() => {
    axios
      .get("/api/health")
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Health check error:", error);
      });

    const loadCurrentPlan = async () => {
      try {
        const res = await axios.get("/api/plan/current");

        const currentPlan = res.data.plan;

        setSavedPlan(currentPlan);
        setPlan(currentPlan);

        setCanGenerate(res.data.canGenerate);
        setNextPlanAt(res.data.nextPlanAt);

        if (currentPlan) {
          setCalories(currentPlan.calories);
          setMacros(currentPlan.macros);
        }

        if (res.data.user) {
          const dbUser = res.data.user;

          setUser(dbUser);

          localStorage.setItem("user", JSON.stringify(dbUser));

          setFormdata((prev) => ({
            ...prev,

            age: dbUser.age ?? "",

            gender: dbUser.gender ?? "male",

            weight: dbUser.weight ?? "",

            height: dbUser.height ?? "",

            goal: dbUser.goal ?? "upkeep",

            intolerances: dbUser.intolerances ?? [],

            dailyTime: dbUser.dailyTime ?? "",

            lifestyle: dbUser.lifestyle ?? "sitting",

            difficulty: dbUser.difficulty ?? "beginner",

            preferedLocation: dbUser.preferedLocation ?? "gym",

            availability: dbUser.availability ?? prev.availability,
          }));
        }
      } catch (error) {
        console.error("CurrentPlan loading error:", error);
      } finally {
        setLoadingPlan(false);
      }
    };

    loadCurrentPlan();
  }, []);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     INTOLERANCE CHECKBOX
  ========================================================= */

  const handleCheckbox = (event) => {
    const { value, checked } = event.target;

    setFormdata((prev) => ({
      ...prev,

      intolerances: checked
        ? [...prev.intolerances, value]
        : prev.intolerances.filter((item) => item !== value),
    }));
  };

  /* =========================================================
     TERV GENERÁLÁS
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("/api/calculate/calculate", formdata);

      setUser(res.data.user);

      setCalories(res.data.calories);
      setMacros(res.data.macros);

      setPlan(res.data.plan);

      setIsDraft(true);
    } catch (error) {
      console.error("Plan generation error:", error);

      alert(
        error.response?.data?.error ?? "Nem sikerült legenerálni a tervet.",
      );
    }
  };

  /* =========================================================
     TERV MENTÉS
  ========================================================= */

  const handleSavedPlan = async () => {
    if (!isDraft || !plan) {
      return;
    }

    try {
      const res = await axios.post("/api/plan/save", {
        draftPlan: plan,
        profile: formdata,
      });

      setPlan(res.data.plan);
      setSavedPlan(res.data.plan);

      setUser(res.data.user);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setIsDraft(false);
      setCanGenerate(false);

      setNextPlanAt(res.data.nextPlanAt);

      alert("Terv elmentve.");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.error ?? "Nem sikerült menteni a tervet.");
    }
  };

  /* =========================================================
     MENTETT TERV VISSZAÁLLÍTÁS
  ========================================================= */

  const handleRestorePlan = () => {
    if (!savedPlan) {
      return;
    }

    setPlan(savedPlan);

    setCalories(savedPlan.calories);

    setMacros(savedPlan.macros);

    setIsDraft(false);
  };

  /* =========================================================
     WEIGHT GRAPH
  ========================================================= */

  const handleGraphRedirector = () => {
    navigate("/progress/weight");
  };

  /* =========================================================
     AI CHAT
  ========================================================= */

  const sendMessage = async () => {
    if (!chatMessage.trim()) {
      return;
    }

    const currentMessage = chatMessage.trim();

    const userMessage = {
      role: "user",
      content: currentMessage,
    };

    setChatHistory((prev) => [...prev, userMessage]);

    setChatMessage("");

    try {
      const res = await axios.post("/api/chat", {
        content: currentMessage,

        history: chatHistory.slice(-10),
      });

      const assistantMessage = {
        role: "assistant",
        content: res.data.reply,
      };

      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      setChatHistory((prev) => [
        ...prev,

        {
          role: "assistant",
          content: "Hiba történt a válasz generálása közben.",
        },
      ]);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loadingPlan) {
    return (
      <div className="app-container">
        <h2>Betöltés...</h2>
      </div>
    );
  }

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="app-container">
      {/* ===================================
          USER MENU
      =================================== */}

      {user && (
        <div className="user-menu">
          <span>👤 {user.name}</span>

          <button type="button" onClick={handleLogOut}>
            Kijelentkezés
          </button>
        </div>
      )}

      {/* ===================================
          PROFILE / PLAN FORM
      =================================== */}

      <form onSubmit={handleSubmit}>
        <input
          name="age"
          placeholder="Kor"
          onChange={handleChange}
          type="number"
          value={formdata.age}
          min="1"
        />

        <input
          name="weight"
          placeholder="Súly (kg)"
          onChange={handleChange}
          type="number"
          value={formdata.weight}
          min="1"
          step="0.1"
        />

        <input
          name="height"
          placeholder="Magasság (cm)"
          onChange={handleChange}
          type="number"
          value={formdata.height}
          min="1"
        />

        {/* GENDER */}

        <select name="gender" onChange={handleChange} value={formdata.gender}>
          <option value="male">Férfi</option>

          <option value="female">Nő</option>
        </select>

        {/* GOAL */}

        <select name="goal" onChange={handleChange} value={formdata.goal}>
          <option value="upkeep">Szintentartás</option>

          <option value="bulk">Izomtömegnövelés</option>

          <option value="lose">Fogyás</option>
        </select>

        {/* LIFESTYLE */}

        <select
          name="lifestyle"
          onChange={handleChange}
          value={formdata.lifestyle}
        >
          <option value="sitting">Ülő életmód</option>

          <option value="slightlyactive">Enyhén aktív</option>

          <option value="moderatelyactive">Mérsékelten aktív</option>

          <option value="veryactive">Nagyon aktív</option>

          <option value="extremelyactive">Extra aktív</option>
        </select>

        {/* DIFFICULTY */}

        <select
          name="difficulty"
          onChange={handleChange}
          value={formdata.difficulty}
        >
          <option value="beginner">Kezdő</option>

          <option value="semi-advanced">Közép-haladó</option>

          <option value="advanced">Haladó</option>

          <option value="pro">Profi</option>
        </select>

        {/* LOCATION */}

        <select
          name="preferedLocation"
          onChange={handleChange}
          value={formdata.preferedLocation}
        >
          <option value="gym">Edzőtermi edzés</option>

          <option value="other">Otthoni edzés</option>
        </select>

        {/* ===================================
            INTOLERANCES
        =================================== */}

        <div>
          <p>Ételintoleranciák:</p>

          <label>
            <input
              type="checkbox"
              value="lactose"
              checked={formdata.intolerances.includes("lactose")}
              onChange={handleCheckbox}
            />
            Laktóz
          </label>

          <label>
            <input
              type="checkbox"
              value="gluten"
              checked={formdata.intolerances.includes("gluten")}
              onChange={handleCheckbox}
            />
            Glutén
          </label>

          <label>
            <input
              type="checkbox"
              value="fish"
              checked={formdata.intolerances.includes("fish")}
              onChange={handleCheckbox}
            />
            Hal
          </label>

          <label>
            <input
              type="checkbox"
              value="egg"
              checked={formdata.intolerances.includes("egg")}
              onChange={handleCheckbox}
            />
            Tojás
          </label>
        </div>

        {/* ===================================
            AVAILABILITY
        =================================== */}

        <AvailabilityGrid
          isOpen={isGridOpen}
          onClose={() => {
            setIsGridOpen(false);
          }}
          value={formdata.availability}
          onChange={(newAvailability) => {
            setFormdata((prev) => ({
              ...prev,

              availability: newAvailability,
            }));
          }}
        />

        <button type="button" onClick={() => setIsGridOpen(true)}>
          Mikor érek rá edzeni?
        </button>

        {/* ===================================
            GENERATE PLAN
        =================================== */}

        {canGenerate && (
          <button type="submit">
            {savedPlan ? "Új terv generálása" : "Terv generálása"}
          </button>
        )}

        {/* ===================================
            DRAFT PLAN BUTTONS
        =================================== */}

        {isDraft && (
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button type="button" onClick={handleSavedPlan}>
              Terv mentése
            </button>

            {savedPlan && (
              <button type="button" onClick={handleRestorePlan}>
                Mentett terv visszaállítása
              </button>
            )}
          </div>
        )}

        {/* ===================================
            NEXT PLAN DATE
        =================================== */}

        {!canGenerate && nextPlanAt && (
          <p
            style={{
              gridColumn: "1 / -1",
            }}
          >
            Új terv generálható: {new Date(nextPlanAt).toLocaleString("hu-HU")}
          </p>
        )}
      </form>

      {/* ===================================
          GRAPH BUTTON
      =================================== */}

      <button type="button" onClick={handleGraphRedirector}>
        📈 Grafikon megtekintése
      </button>

      {/* ===================================
          CALORIES
      =================================== */}

      {calories != null && (
        <div className="calorie-card">
          <span>Napi kalóriacél</span>

          <h2>{calories} kcal</h2>
        </div>
      )}

      {/* ===================================
          MACROS
      =================================== */}

      {macros && (
        <div className="macros">
          <div className="macro-card">
            <span>Fehérje</span>

            <strong>{macros.protein} g</strong>
          </div>

          <div className="macro-card">
            <span>Szénhidrát</span>

            <strong>{macros.carbs} g</strong>
          </div>

          <div className="macro-card">
            <span>Zsír</span>

            <strong>{macros.fat} g</strong>
          </div>
        </div>
      )}

      {/* ===================================
          WEEKLY PLAN
      =================================== */}

      {plan && (
        <div className="weekly-plan">
          <h2>Heti terv</h2>

          {isDraft && (
            <p>
              Ez egy előnézet. Mentsd el a tervet, ha meg szeretnéd tartani.
            </p>
          )}

          <div className="plan-grid">
            {plan.meals?.map((dayPlan, i) => {
              const workoutDay = plan.workouts?.[i];

              return (
                <div
                  key={dayPlan._id ?? `${dayPlan.day}-${i}`}
                  className="day-card"
                >
                  {/* DAY */}

                  <h3>
                    {dayPlan.day}

                    {workoutDay?.type ? ` (${workoutDay.type})` : ""}
                  </h3>

                  {/* MEALS */}

                  <h4>🍽 Étrend</h4>

                  {dayPlan.meals?.length > 0 ? (
                    dayPlan.meals.map((meal, idx) => (
                      <div key={meal._id ?? idx}>
                        <b>{meal.type}</b>

                        {" — "}

                        {meal.name}

                        <br />

                        <span>
                          {meal.calories} kcal / {meal.gramms}g
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>Nincs étkezés megadva.</p>
                  )}

                  {/* WORKOUT */}

                  <h4
                    style={{
                      marginTop: "16px",
                    }}
                  >
                    🏋️ Edzés
                  </h4>

                  {workoutDay?.workouts?.length > 0 ? (
                    workoutDay.workouts.map((workout, idx) => {
                      if (typeof workout === "string") {
                        return (
                          <div key={idx}>
                            <b>{workout}</b> (Részletek betöltése...)
                          </div>
                        );
                      }

                      const isRest =
                        workout._id?.includes("rest") ||
                        workout.name?.includes("Pihenő");

                      return (
                        <div
                          key={workout._id ?? idx}
                          style={{
                            marginBottom: "10px",
                          }}
                        >
                          <b>{workout.name || "Pihenő nap"}</b>

                          <br />

                          {isRest ? (
                            <span>Élvezd a jól megérdemelt pihenést! 😴</span>
                          ) : (
                            <>
                              {workout.sets > 0 && workout.reps > 0 && (
                                <span>
                                  Sorozat: {workout.sets} × {workout.reps}
                                </span>
                              )}

                              {workout.duration > 0 && (
                                <>
                                  {workout.sets > 0 && workout.reps > 0 && (
                                    <br />
                                  )}

                                  <span>
                                    Időtartam: {workout.duration} perc
                                  </span>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p>Nincs mára tervezett edzés.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================
          AI FITNESS COACH
      =================================== */}

      <div className="chat-section">
        <h3>🤖 AI Fitness Coach</h3>

        <div className="chat-window">
          {chatHistory.length === 0 && (
            <p>Kérdezz valamit az edzésedről vagy étrendedről!</p>
          )}

          {chatHistory.map((msg, i) => {
            /*
             * Ha az AI mégis <br>
             * vagy <br /> tageket
             * generál, normál
             * sortöréssé alakítjuk.
             */

            const cleanMessage =
              msg.content
                ?.replace(/<br\s*\/?>/gi, "\n")
                .replace(/&nbsp;/gi, " ")
                .replace(/&#x20;/gi, " ") ?? "";

            return (
              <div
                key={i}
                className={`chat-message ${
                  msg.role === "user" ? "user" : "assistant"
                }`}
              >
                <b>{msg.role === "user" ? "Te" : "AI Coach"}</b>

                <div className="message-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {cleanMessage}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>

        {}

        <div className="chat-input-row">
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                sendMessage();
              }
            }}
            placeholder="Kérdezz valamit..."
          />

          <button type="button" onClick={sendMessage}>
            Küldés
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
