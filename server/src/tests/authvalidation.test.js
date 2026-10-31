import { describe, it, expect } from "vitest";

import {
  registerSchema,
  loginSchema
} from "../validator/authschemas.js";

describe("Regisztrációs validáció", () => {
  const validUser = {
    name: "Teszt Elek",
    email: "teszt@example.com",
    password: "Test12345!"
  };

  it("Elfogadja az érvényes adatokat", () => {
    const result = registerSchema.safeParse(validUser);

    expect(result.success).toBe(true);
  });

  it("Elutasítja a hibás email címet", () => {
    const result = registerSchema.safeParse({
      ...validUser,
      email: "hibasemail"
    });

    expect(result.success).toBe(false);
  });

  it("Elutasítja a túl rövid jelszót", () => {
    const result = registerSchema.safeParse({
      ...validUser,
      password: "1"
    });

    expect(result.success).toBe(false);
  });

  it("Elutasítja az üres nevet", () => {
    const result = registerSchema.safeParse({
      ...validUser,
      name: ""
    });

    expect(result.success).toBe(false);
  });

  it("Kisbetűssé alakítja az email címet", () => {
    const result = registerSchema.parse({
      ...validUser,
      email: "TESZT@EXAMPLE.COM"
    });

    expect(result.email).toBe("teszt@example.com");
  });
});

describe("Bejelentkezési validáció", () => {
  it("Elfogadja az érvényes bejelentkezési adatokat", () => {
    const result = loginSchema.safeParse({
      email: "teszt@example.com",
      password: "Test12345!"
    });

    expect(result.success).toBe(true);
  });

  it("Elutasítja a hiányzó jelszót", () => {
    const result = loginSchema.safeParse({
      email: "teszt@example.com"
    });

    expect(result.success).toBe(false);
  });
});