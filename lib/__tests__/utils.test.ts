import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
  it("should merge basic class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should resolve conflicting Tailwind utilities keeping the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("should handle arrays of classes", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("should handle objects with boolean values", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("should ignore null, undefined and false values", () => {
    expect(cn("foo", null, undefined, false, "bar")).toBe("foo bar");
  });

  it("should return an empty string when no arguments are passed", () => {
    expect(cn()).toBe("");
  });

  it("should deduplicate Tailwind classes that conflict", () => {
    expect(cn("text-sm text-lg")).toBe("text-lg");
  });
});
