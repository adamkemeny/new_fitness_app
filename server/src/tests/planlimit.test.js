import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach
} from "vitest";

import { User } from "../models/User.js";
import { Plan } from "../models/Plan.js";
import { calculate } from "../services/calculateservice.js";
import { GeneratePlan } from "../services/plangenerator.js";
import { calculating } from "../controllers/calculatecontroller.js";

vi.mock("../models/User.js", () => ({
  User: {
    findById: vi.fn()
  }
}));

vi.mock("../models/Plan.js", () => ({
  Plan: {
    findOne: vi.fn()
  }
}));

vi.mock("../services/calculateservice.js", () => ({
  calculate: vi.fn()
}));

vi.mock("../services/plangenerator.js", () => ({
  GeneratePlan: vi.fn()
}));

describe("7 napos tervgenerálási korlátozás", () => {
  const NOW = new Date("2026-10-30T12:00:00Z");
  const DAY = 24 * 60 * 60 * 1000;

  let req;
  let res;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    req = {
      userID: "test-user-id",
      body: {
        availability: {
          Hétfő: [8, 9]
        },
        diet: "normal"
      }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    User.findById.mockResolvedValue({
      toObject: () => ({
        age: 25,
        weight: 80,
        height: 180,
        availability: {
          Hétfő: [8, 9]
        }
      })
    });

    calculate.mockReturnValue({
      calories: 2200,
      macros: {
        protein: 140,
        carbs: 250,
        fat: 70
      }
    });

    GeneratePlan.mockResolvedValue({
      meals: [],
      workouts: []
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockPreviousPlan = (daysAgo) => {
    const createdAt = new Date(
      NOW.getTime() - daysAgo * DAY
    );

    Plan.findOne.mockReturnValue({
      sort: vi.fn().mockResolvedValue({
        createdAt
      })
    });
  };

  it("Engedélyezi a generálást, ha nincs korábbi terv", async () => {
    Plan.findOne.mockReturnValue({
      sort: vi.fn().mockResolvedValue(null)
    });

    await calculating(req, res);

    expect(GeneratePlan).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalled();

    expect(res.status).not.toHaveBeenCalledWith(403);
  });

  it("Tiltja a generálást 3 nap után", async () => {
    mockPreviousPlan(3);

    await calculating(req, res);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Még nem generálhatsz új tervet."
      })
    );

    expect(GeneratePlan).not.toHaveBeenCalled();
  });

  it("Tiltja a generálást közvetlenül a 7 nap lejárta előtt", async () => {
    const createdAt = new Date(
      NOW.getTime() - 7 * DAY + 60 * 1000
    );

    Plan.findOne.mockReturnValue({
      sort: vi.fn().mockResolvedValue({
        createdAt
      })
    });

    await calculating(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(GeneratePlan).not.toHaveBeenCalled();
  });

  it("Pontosan 7 nap után engedélyezi a generálást", async () => {
    mockPreviousPlan(7);

    await calculating(req, res);

    expect(GeneratePlan).toHaveBeenCalledOnce();

    expect(res.status).not.toHaveBeenCalledWith(403);
  });

  it("8 nap után is engedélyezi a generálást", async () => {
    mockPreviousPlan(8);

    await calculating(req, res);

    expect(GeneratePlan).toHaveBeenCalledOnce();

    expect(res.status).not.toHaveBeenCalledWith(403);
  });
});