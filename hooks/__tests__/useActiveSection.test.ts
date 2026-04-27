import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "../useActiveSection";
import { SCROLL_THRESHOLD } from "@/lib/constants";

type Rect = { top: number; bottom: number };

function mountSections(rects: Record<string, Rect>) {
  Object.entries(rects).forEach(([id, rect]) => {
    const el = document.createElement("section");
    el.id = id;
    el.getBoundingClientRect = () =>
      ({
        top: rect.top,
        bottom: rect.bottom,
        left: 0,
        right: 0,
        width: 0,
        height: rect.bottom - rect.top,
        x: 0,
        y: rect.top,
        toJSON: () => ({}),
      }) as DOMRect;
    document.body.appendChild(el);
  });
}

describe("useActiveSection", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should default to the first section", () => {
    const sections = ["home", "about", "contact"] as const;
    const { result } = renderHook(() => useActiveSection(sections));
    expect(result.current).toBe("home");
  });

  it("should activate the section that crosses the scroll threshold", () => {
    const sections = ["home", "about", "contact"] as const;

    mountSections({
      home: { top: -500, bottom: -100 },
      about: { top: SCROLL_THRESHOLD - 10, bottom: SCROLL_THRESHOLD + 200 },
      contact: { top: 800, bottom: 1200 },
    });

    const { result } = renderHook(() => useActiveSection(sections));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe("about");
  });

  it("should not change activeSection when no section crosses the threshold", () => {
    const sections = ["home", "about"] as const;

    mountSections({
      home: { top: -1000, bottom: -500 },
      about: { top: 800, bottom: 1200 },
    });

    const { result } = renderHook(() => useActiveSection(sections));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe("home");
  });

  it("should remove the scroll listener on unmount", () => {
    const sections = ["home"] as const;
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useActiveSection(sections));
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
