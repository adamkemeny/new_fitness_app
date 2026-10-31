import {
  describe,
  it,
  expect,
  vi,
  afterEach
} from "vitest";

import { weightUpdater } from "../controllers/progresscontroller.js";

describe("Súlynaplózás tesztelése", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("Új súlybejegyzést hoz létre", () => {
    const user = {
      weight: 80,
      weightHistory: []
    };

    weightUpdater(user, 79.5);

    expect(user.weight).toBe(79.5);
    expect(user.weightHistory).toHaveLength(1);
    expect(user.weightHistory[0].weight).toBe(79.5);
  });

  it("Ugyanazon a napon frissíti a súlyt", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-30T12:00:00"));

    const user = {
      weight: 80,
      weightHistory: [
        {
          date: new Date("2026-10-30T08:00:00"),
          weight: 80
        }
      ]
    };

    weightUpdater(user, 79.5);

    expect(user.weight).toBe(79.5);
    expect(user.weightHistory).toHaveLength(1);
    expect(user.weightHistory[0].weight).toBe(79.5);
  });

  it("Másnap új bejegyzést hoz létre", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-31T12:00:00"));

    const user = {
      weight: 80,
      weightHistory: [
        {
          date: new Date("2026-10-30T12:00:00"),
          weight: 80
        }
      ]
    };

    weightUpdater(user, 79);

    expect(user.weightHistory).toHaveLength(2);
    expect(user.weightHistory[1].weight).toBe(79);
  });

  it("Megőrzi a korábbi súlyadatokat", () => {
    const oldDate = new Date("2025-01-01T12:00:00");

    const user = {
      weight: 80,
      weightHistory: [
        {
          date: oldDate,
          weight: 85
        }
      ]
    };

    weightUpdater(user, 79);

    expect(user.weightHistory[0].weight).toBe(85);
    expect(user.weightHistory[0].date).toEqual(oldDate);
  });
});