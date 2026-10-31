import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach
} from "vitest";

import jwt from "jsonwebtoken";
import { authmiddleware } from "../routes/auth.js";

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn()
  }
}));

describe("JWT hitelesítési middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.resetAllMocks();

    vi.stubEnv("JWT_SECRET", "test-secret");

    req = {
      cookies: {
        token: "test-token"
      }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    next = vi.fn();

    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("Elutasítja a hiányzó JWT tokent", () => {
    req.cookies = {};

    authmiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized."
    });

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("Elutasítja a hamisított JWT tokent", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    authmiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid token."
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("Elutasítja a lejárt JWT tokent", () => {
    jwt.verify.mockImplementation(() => {
      const error = new Error("jwt expired");
      error.name = "TokenExpiredError";
      throw error;
    });

    authmiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("Érvényes token esetén továbbengedi a kérést", () => {
    jwt.verify.mockReturnValue({
      userID: "user123"
    });

    authmiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalledWith(401);
  });

  it("Beállítja a felhasználó azonosítóját", () => {
    jwt.verify.mockReturnValue({
      userID: "user123"
    });

    authmiddleware(req, res, next);

    expect(req.userID).toBe("user123");

    expect(jwt.verify).toHaveBeenCalledWith(
      "test-token",
      "test-secret",
      {
        algorithms: ["HS256"]
      }
    );
  });
});