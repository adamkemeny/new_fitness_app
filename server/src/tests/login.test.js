import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  login
} from "../controllers/authenticationcontroller.js";

vi.mock("../models/User.js", () => ({
  User: {
    findOne: vi.fn()
  }
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn()
  }
}));

describe("Bejelentkezés tesztelése", () => {
  let req;
  let res;

  const mockUser = {
    id: "123",
    name: "Teszt Elek",
    email: "teszt@example.com",
    password: "hashed-password"
  };

  beforeEach(() => {
    vi.resetAllMocks();

    process.env.JWT_SECRET = "test-secret";

    req = {
      body: {
        email: "teszt@example.com",
        password: "Test12345!"
      }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis()
    };
  });

  it("Sikeresen bejelentkezteti a felhasználót", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mock-token");

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Successful login",
      user: {
        id: "123",
        name: "Teszt Elek",
        email: "teszt@example.com"
      }
    });

    expect(res.status).not.toHaveBeenCalledWith(400);
  });

  it("Elutasítja a nem létező felhasználót", async () => {
    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      error: "Incorrect email or password."
    });

    expect(res.cookie).not.toHaveBeenCalled();
  });

  it("Elutasítja a hibás jelszót", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it("JWT tokent tartalmazó HTTP-only cookie-t hoz létre", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mock-token");

    await login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userID: "123" },
      "test-secret",
      { expiresIn: "7d" }
    );

    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "mock-token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
    );
  });

  it("Adatbázishiba esetén 500-as választ ad", async () => {
    User.findOne.mockRejectedValue(
      new Error("Database error")
    );

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.cookie).not.toHaveBeenCalled();
  });
});