import { User } from "../models/User.js";
import { Plan } from "../models/Plan.js";

export const chatting = async (req, res) => {
  try {
    const { content, history = [] } = req.body;
    if (!content) {
      console.log("Messages requred!");
      return res.status(400).json({ error: "Messages requred!" });
    }
    const user = await User.findById(req.userID);
    if (!user) {
      console.log("User not found!");
      return res.status(400).json({ error: "User not found!" });
    }
    const plan = await Plan.findOne({ userID: req.userID }).sort({
      createdAt: -1,
    });
    const systemMessage = `Te egy személyi fitness asszisztens vagy.

A felhasználó adatai:

Név: ${user.name ?? "nincs megadva"}
Kor: ${user.age ?? "nincs megadva"}
Nem: ${user.gender ?? "nincs megadva"}
Testsúly: ${user.weight ?? "nincs megadva"} kg
Magasság: ${user.height ?? "nincs megadva"} cm
Cél: ${user.goal ?? "nincs megadva"}
Aktivitási szint: ${user.lifestyle ?? "nincs megadva"}
Edzettségi szint: ${user.difficulty ?? "nincs megadva"}
Edzés helye: ${user.preferedLocation ?? "nincs megadva"}
Ételintoleranciák: ${
      user.intolerances?.length ? user.intolerances.join(", ") : "nincs"
    }

${
  plan
    ? `
Jelenlegi terv:
Napi kalória: ${plan.calories} kcal
Makrók:
fehérje: ${plan.macros?.protein} g
szénhidrát: ${plan.macros?.carbs} g
zsír: ${plan.macros?.fat} g
`
    : "A felhasználónak jelenleg nincs elmentett terve."
}

Feladatod:
segíts edzéssel, táplálkozással és a terv értelmezésével kapcsolatban;
vedd figyelembe a felhasználó adatait és aktuális tervét;
válaszolj magyarul;
legyél tömör, érthető és barátságos;
ha egészségügyi/diagnosztikai kérdés merül fel, ne állíts fel diagnózist;
ne találj ki olyan adatot a felhasználóról, amit nem kaptál meg.
ha kérdi valaki hogy ki a király mond meg hogy Ádám és Krisztián a király.
`;
    const messages = [
      { role: "system", content: systemMessage },
      ...history.slice(-10),
      { role: "user", content: content },
    ];
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages,
          temperature: 0.7,
          max_tokens: 3000,
        }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      console.error("Groq error: ", data);
      return res
        .status(response.status)
        .json({ error: data.error.message ?? "Groq API error." });
    }
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(500).json({ error: "AI did not return a response." });
    }
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hiba az AI-al!" });
  }
};
