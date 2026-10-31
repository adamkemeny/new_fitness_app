import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import { User } from "../models/User.js";
import bcrypt from "bcrypt";

import {
  register
} from "../controllers/authenticationcontroller.js";

vi.mock("../models/User.js", () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn()
  }
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}));

describe("Regisztráció tesztelése", () => {
  let req;
  let res;

  beforeEach(() => {
    vi.resetAllMocks();

    req = {
      body: {
        name: "Teszt Elek",
        email: "teszt@example.com",
        password: "Test12345!"
      }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
  });

  it("Sikeresen regisztrál egy új felhasználót", async () => {
    User.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-password");

    User.create.mockResolvedValue({
      id: "123",
      name: "Teszt Elek"
    });

    await register(req, res);

    expect(User.create).toHaveBeenCalledWith({
      name: "Teszt Elek",
      email: "teszt@example.com",
      password: "hashed-password"
    });

    expect(res.json).toHaveBeenCalledWith({
      message: "User created."
    });
  });

  it("Elutasítja a már létező e-mail címet", async () => {
    User.findOne.mockResolvedValue({
      id: "123",
      email: "teszt@example.com"
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(User.create).not.toHaveBeenCalled();
  });

  it("Hash-eli a jelszót mentés előtt", async () => {
    User.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-password");
    User.create.mockResolvedValue({ id: "123" });

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith(
      "Test12345!",
      10
    );

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: "hashed-password"
      })
    );
  });

  it("Adatbázishibánál 500-as választ ad", async () => {
    User.findOne.mockRejectedValue(
      new Error("Database error")
    );

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      error: "Error while registering."
    });
  });
});