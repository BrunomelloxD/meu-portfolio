import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "../useActiveSection";

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: ObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();

function mountSections(ids: string[]) {
  return Object.fromEntries(
    ids.map((id) => {
      const el = document.createElement("section");
      el.id = id;
      document.body.appendChild(el);
      return [id, el];
    }),
  );
}

describe("useActiveSection", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (cb: ObserverCallback) {
        callback = cb;
        return { observe, disconnect, unobserve: vi.fn(), takeRecords: vi.fn() };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("should default to the first section", () => {
    const { result } = renderHook(() => useActiveSection(["home", "about", "contact"]));
    expect(result.current).toBe("home");
  });

  it("should observe every mounted section", () => {
    const els = mountSections(["home", "about"]);
    renderHook(() => useActiveSection(["home", "about"]));
    expect(observe).toHaveBeenCalledWith(els.home);
    expect(observe).toHaveBeenCalledWith(els.about);
  });

  it("should activate the section that crosses the detection line (NAV-02)", () => {
    const els = mountSections(["home", "about", "contact"]);
    const { result } = renderHook(() => useActiveSection(["home", "about", "contact"]));

    act(() => {
      callback([
        { target: els.home, isIntersecting: false },
        { target: els.about, isIntersecting: true },
      ]);
    });

    expect(result.current).toBe("about");
  });

  it("should not change the active section when nothing crosses the line", () => {
    const els = mountSections(["home", "about"]);
    const { result } = renderHook(() => useActiveSection(["home", "about"]));

    act(() => {
      callback([{ target: els.about, isIntersecting: false }]);
    });

    expect(result.current).toBe("home");
  });

  it("should disconnect the observer on unmount", () => {
    mountSections(["home"]);
    const { unmount } = renderHook(() => useActiveSection(["home"]));
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
