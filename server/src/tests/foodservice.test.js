import {
  describe, it, expect, vi, afterEach
} from "vitest";

import { randomItem } from "../services/foodservice.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Ételkiválasztás", () => {
  const foods = [
    {
      name: "Tejes zabkása",
      type: ["normal", "vegetarian"],
      intolerances: ["lactose"]
    },
    {
      name: "Vegán rizses étel",
      type: ["normal", "vegetarian", "vegan"],
      intolerances: []
    }
  ];

  it("Üres étellistánál hibát dob", () => {
    expect(() =>
      randomItem([], [], "normal")
    ).toThrow("The array does not exist!");
  });

  it("Megfelelő ételt választ vegán étrendhez", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.75);

    const result = randomItem(foods, [], "vegan");

    expect(result.name).toBe("Vegán rizses étel");
  });

  it("Ki tud választani laktózmentes ételt", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.75);

    const result = randomItem(
      foods,
      ["lactose"],
      "normal"
    );

    expect(result.intolerances).not.toContain("lactose");
  });

  it("Jelzi, ha nincs megfelelő étel", () => {
    const unsuitableFoods = [foods[0]];

    expect(() =>
      randomItem(
        unsuitableFoods,
        ["lactose"],
        "vegan"
      )
    ).toThrow("No suitable food found");
  });
});