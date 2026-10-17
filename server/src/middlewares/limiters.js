import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error:
      "Túl sok bejelentkezési kísérlet, kérlek próbáld újra 15 perc múlva.",
  },
});

export const registerLimiter = rateLimit({
  windowMs: 1000 * 60 * 60,
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error:
      "Túl sok sikertelen regisztrációs kísérlet. Kérlek próbáld újra később.",
  },
});

export const chatLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 50,

  keyGenerator: (req) => String(req.userID),

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error: "Elérted a napi 50 AI-üzenetes limitet.",
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    error: "Túl sok kérés érkezett. Próbáld újra később!",
  },
});
