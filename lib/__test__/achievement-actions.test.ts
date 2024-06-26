import { expect, describe, it, vi } from "vitest";
import { updateAchievements } from "../achievement-actions";
import { Stat } from "../interfaces";
import { updateAchievementsQuery, evaluateStats } from "../utils";
// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: vi.fn().mockReturnValue({ value: "mocked-token" }),
  }),
}));

// Mock client
vi.mock("../client", () => ({
  client: {
    withGlobals: vi.fn().mockReturnThis(),
    querySingle: vi.fn(),
  },
}));
describe("output string array when given a Stat object", () => {
  it("should return an array of strings", () => {
    const res = evaluateStats({ score: 69, friendly_collisions: 1 } as Stat);
    expect(res).toEqual(["sixty_nine := true", "falcore_mentioned := true"]);
  });

  it("should return undefined, if no Stats are passed in", () => {
    const res = evaluateStats({} as Stat);
    expect(res).toEqual(undefined);
  });
});

describe("output a query when given an array of achiements", () => {
  it("should return a query that includes the correct field additions", () => {
    const achievementsUpdates = [
      "sixty_nine := true",
      "falcore_mentioned := true",
    ];
    const res = updateAchievementsQuery(achievementsUpdates);
    expect(res.trim()).to.equal(
      `
        UPDATE User
        FILTER .id = global current_user.id
        SET {
            achievements := (
                UPDATE Achievement
                FILTER .id = global current_user.achievements.id
                SET {
                    sixty_nine := true,
falcore_mentioned := true
                }
            )
        };
    `.trim()
    );
  });
  it("should return a query that has the exact same SET statement", () => {
    const achievementsUpdates = ["sixty_nine := true"];
    const res = updateAchievementsQuery(achievementsUpdates);
    expect(res.trim()).to.equal(
      `
        UPDATE User
        FILTER .id = global current_user.id
        SET {
            achievements := (
                UPDATE Achievement
                FILTER .id = global current_user.achievements.id
                SET {
                    sixty_nine := true
                }
            )
        };
    `.trim()
    );
  });
});
