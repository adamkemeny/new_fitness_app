import { z } from "zod";

const messageSchema = z.strictObject({
  role: z.enum(["user", "assistant"]),

  content: z.string()
    .trim()
    .min(1)
    .max(4000)
});

export const chatSchema = z.strictObject({
  content: z.string()
    .trim()
    .min(1, "Az üzenet nem lehet üres.")
    .max(2000, "Az üzenet túl hosszú."),

  history: z.array(messageSchema)
    .max(10)
    .default([])
});
