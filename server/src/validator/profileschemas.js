import { z } from "zod";

const numberInput = (min, max) =>
  z.union([
    z.number(),
    z.string().trim()
      .min(1)
      .regex(/^\d+(.\d+)?$/)
      .transform(Number)
  ])
  .pipe(z.number().finite().min(min).max(max));

const days = [
  "Hétfő", "Kedd", "Szerda", "Csütörtök",
  "Péntek", "Szombat", "Vasárnap"
];

const hours = z.array(
  z.number().int().min(6).max(21)
).max(16);

const availabilitySchema = z.strictObject(
  Object.fromEntries(
    days.map(day => [day, hours])
  )
);

export const profileSchema = z.strictObject({
  name: z.string().trim().min(2).max(100).optional(),

  age: numberInput(18, 100).pipe(z.number().int()),

  weight: numberInput(20, 400),

  height: numberInput(100, 250),

  goal: z.enum(["upkeep", "bulk", "lose"]),

  gender: z.enum(["male", "female"]),

  lifestyle: z.enum([
    "sitting",
    "slightlyactive",
    "moderatelyactive",
    "veryactive",
    "extremelyactive"
  ]),

  difficulty: z.enum([
    "beginner",
    "semi-advanced",
    "advanced",
    "pro"
  ]),

  preferedLocation: z.enum(["gym", "other"]),

  intolerances: z.array(
    z.enum(["lactose", "gluten", "fish", "egg"])
  ).max(4),

 dailyTime: z.preprocess(
        (value) => value === "" ? undefined : value,
        numberInput(0, 1440).optional()
    ),

  availability: availabilitySchema,
  
  diet: z.enum([
    "normal",
    "vegetarian",
    "vegan"
  ])
});