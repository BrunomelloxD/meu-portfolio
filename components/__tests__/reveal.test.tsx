import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useReducedMotion } from "motion/react";
import { Reveal, RevealItem } from "../reveal";

// Spec values (MOV-10, MOV-14): dur.slow 0.7, dur.base 0.32, ease.out [0.32, 0.72, 0, 1].
const EASE_OUT = [0.32, 0.72, 0, 1];
const motionOf = (el: Element) => JSON.parse(el.getAttribute("data-motion")!);

/** Puts every block at `top` px from the viewport top (jsdom's innerHeight is 768). */
function placeTop(top: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top, bottom: top + 100 } as DOMRect);
}

describe("<Reveal />", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function () {
        return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn(), takeRecords: vi.fn() };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("reveals in view, once, 10% before the bottom edge, at 10% visibility (MOV-10, MOV-12)", () => {
    placeTop(2000);
    render(<Reveal>Conteúdo</Reveal>);
    const props = motionOf(screen.getByText("Conteúdo"));
    expect(props.whileInView).toBe("show");
    expect(props.viewport).toEqual({ once: true, amount: 0.1, margin: "0px 0px -10% 0px" });
  });

  it("arms a block below the fold: the item goes from opacity 0, y 16 to opacity 1, y 0 over 0.7s ease-out (MOV-10)", () => {
    placeTop(2000);
    render(<Reveal>Conteúdo</Reveal>);
    const props = motionOf(screen.getByText("Conteúdo"));
    expect(props.initial).toBe(false);
    expect(props.animate).toBe("hidden");
    expect(props.variants.hidden).toMatchObject({ opacity: 0, y: 16 });
    expect(props.variants.show).toEqual({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } });
  });

  it("uses only opacity, 0.32s and no stagger under reduced motion (MOV-14)", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    placeTop(2000);
    render(
      <Reveal>
        <RevealItem>Um</RevealItem>
        <RevealItem>Dois</RevealItem>
      </Reveal>,
    );
    const group = motionOf(screen.getByText("Um").parentElement!);
    expect(group.variants.show.transition?.delayChildren).toBeUndefined();
    for (const text of ["Um", "Dois"]) {
      const item = motionOf(screen.getByText(text));
      expect(item.variants.hidden).toMatchObject({ opacity: 0, y: 0 });
      expect(item.variants.show).toEqual({ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT } });
    }
  });

  it("starts each RevealItem 70ms apart, in DOM order (MOV-11)", () => {
    placeTop(2000);
    render(
      <Reveal>
        <RevealItem>Um</RevealItem>
        <RevealItem>Dois</RevealItem>
      </Reveal>,
    );
    const group = motionOf(screen.getByText("Um").parentElement!);
    expect(group.animate).toBe("hidden");
    expect(group.variants.show.transition).toEqual({ delayChildren: { __stagger: [0.07, null] } });
    // The group only orchestrates; the items carry the values and inherit the variant names.
    expect(group.variants.hidden).toEqual({});
    for (const text of ["Um", "Dois"]) {
      const item = motionOf(screen.getByText(text));
      expect(item.animate).toBeUndefined();
      expect(item.variants.hidden).toMatchObject({ opacity: 0, y: 16 });
      expect(item.variants.show).toEqual({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } });
    }
  });

  it("keeps a block already on screen at mount in its shown state (MOV-15)", () => {
    placeTop(100);
    render(<Reveal>Conteúdo</Reveal>);
    expect(motionOf(screen.getByText("Conteúdo")).animate).toBe("show");
  });

  it("keeps content shown when IntersectionObserver is missing (MOV-13)", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    placeTop(2000);
    render(<Reveal>Conteúdo</Reveal>);
    const props = motionOf(screen.getByText("Conteúdo"));
    expect(props.animate).toBe("show");
    expect(props.variants.show.opacity).toBeUndefined();
  });

  it("keeps its className and children", () => {
    render(
      <Reveal className="mt-8">
        <span>Filho</span>
      </Reveal>,
    );
    expect(screen.getByText("Filho").parentElement).toHaveClass("mt-8");
  });
});
