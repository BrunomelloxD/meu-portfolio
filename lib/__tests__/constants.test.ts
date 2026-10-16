import { describe, it, expect } from "vitest";
import { STATS, EDUCATION } from "../constants";

describe("constants", () => {
  it("keeps only the verifiable stats 3+, 20+ and 10+ (ABOUT-04, A-04)", () => {
    expect(STATS.map((s) => s.value)).toEqual(["3+", "20+", "10+"]);
  });

  it("lists the three degrees (ABOUT-04)", () => {
    expect(EDUCATION).toHaveLength(3);
  });
});
