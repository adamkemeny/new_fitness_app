import { z } from "zod";

export const registerSchema = z.strictObject({
  name: z.string()
    .trim()
    .min(2, "A név legalább 2 karakter legyen.")
    .max(100, "A név túl hosszú."),

  email: z.string()
    .trim()
    .toLowerCase()
    .email("Érvénytelen email-cím.")
    .max(254),

  password: z.string()
    .min(3, "A jelszó legalább 3 karakter legyen.")
    .max(72, "A jelszó túl hosszú.")
});

export const loginSchema = z.strictObject({
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Érvénytelen email-cím."),

  password: z.string()
    .min(1, "A jelszó megadása kötelező.")
});
