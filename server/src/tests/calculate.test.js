import { describe, it, expect } from "vitest";
import { calculate } from "../services/calculateservice.js";

describe("Kalória- és makrószámítás", () => {
  const user = {
    age: 25,
    weight: 80,
    height: 180,
    gender: "male",
    lifestyle: "sitting",
    goal: "upkeep",
    intolerances: []
  };

  it("Helyesen számolja a szintentartó kalóriát", () => {
    const result = calculate(user);

    expect(result.calories).toBe(2166);
    expect(result.macros).toEqual({
      protein: 112,
      fat: 64,
      carbs: 285
    });
  });

  it("Fogyásnál csökkenti a kalóriaszükségletet", () => {
    const result = calculate({
      ...user,
      goal: "lose"
    });

    expect(result.calories).toBe(1732);
    expect(result.macros.protein).toBe(128);
  });

  it("Tömegelésnél növeli a kalóriaszükségletet", () => {
    const result = calculate({
      ...user,
      goal: "bulk"
    });

    expect(result.calories).toBe(2599);
    expect(result.macros.protein).toBe(160);
  });

  it("Aktívabb életmódhoz több kalóriát rendel", () => {
    const sitting = calculate(user);

    const active = calculate({
      ...user,
      lifestyle: "veryactive"
    });

    expect(active.calories).toBeGreaterThan(
      sitting.calories
    );
  });

  it("Nem módosítja az eredeti felhasználói adatokat", () => {
    const original = structuredClone(user);

    calculate(user);

    expect(user).toEqual(original);
  });
});