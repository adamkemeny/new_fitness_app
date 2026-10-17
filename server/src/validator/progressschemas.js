import { z } from "zod";

export const weightEntrySchema = z.strictObject({
  weight: z.union([
    z.number(),
    z.string()
      .trim()
      .min(1)
      .regex(/^\d+(.\d+)?$/)
      .transform(Number)
  ]).pipe(
    z.number().finite().min(20).max(400)
  )
});