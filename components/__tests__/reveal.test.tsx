import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Reveal } from "../reveal";

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let callback: ObserverCallback;

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("<Reveal />", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (cb: ObserverCallback) {
        callback = cb;
        return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn(), takeRecords: vi.fn() };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hides content until it enters the viewport, then shows it", () => {
    mockReducedMotion(false);
    render(<Reveal>Conteúdo</Reveal>);
    const el = screen.getByText("Conteúdo");
    expect(el).toHaveAttribute("data-reveal", "hidden");

    act(() => callback([{ isIntersecting: true, target: el }]));
    expect(el).toHaveAttribute("data-reveal", "shown");
  });

  it("never hides content when the user prefers reduced motion (MOT-02)", () => {
    mockReducedMotion(true);
    render(<Reveal>Conteúdo</Reveal>);
    expect(screen.getByText("Conteúdo")).not.toHaveAttribute("data-reveal", "hidden");
  });

  it("animates only opacity and transform (MOT-03)", () => {
    mockReducedMotion(false);
    render(<Reveal>Conteúdo</Reveal>);
    expect(screen.getByText("Conteúdo")).toHaveClass("transition-[opacity,transform]");
  });
});
