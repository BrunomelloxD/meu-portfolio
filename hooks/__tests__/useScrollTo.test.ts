import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollTo } from "../useScrollTo";

describe("useScrollTo", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should return a stable callback reference across renders", () => {
    const { result, rerender } = renderHook(() => useScrollTo());
    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });

  it("should call scrollIntoView on the element with the given id", () => {
    const element = document.createElement("section");
    element.id = "about";
    const scrollSpy = vi.fn();
    element.scrollIntoView = scrollSpy;
    document.body.appendChild(element);

    const { result } = renderHook(() => useScrollTo());
    result.current("about");

    expect(scrollSpy).toHaveBeenCalledTimes(1);
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("should be a no-op when the element does not exist", () => {
    const { result } = renderHook(() => useScrollTo());
    expect(() => result.current("does-not-exist")).not.toThrow();
  });
});
