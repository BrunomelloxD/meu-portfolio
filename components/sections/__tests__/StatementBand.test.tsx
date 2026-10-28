import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useAnimationFrame, useInView, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import * as motionModule from "motion/react";
import { StatementBand } from "../StatementBand";
import { spring } from "@/lib/motion";

const TITLE = "Integrações críticas em produção";
const SUBTITLE = "Cadastro de clientes integrado a Serasa, SPC e Unico — Gazin Tech";
const motionOf = (el: Element | null) => JSON.parse(el?.getAttribute("data-motion") ?? "null");

let velocity = 0;

/** Live x of the track: the motion value itself, kept by the mock's registry (data-motion is a render snapshot). */
const trackX = () => {
  const { __motionPropsOf } = motionModule as unknown as { __motionPropsOf: (el: Element) => { style: { x: { get: () => number } } } };
  return __motionPropsOf(document.querySelector("[data-track]")!).style.x.get();
};
const frame = (delta: number) => {
  const cb = vi.mocked(useAnimationFrame).mock.lastCall![0] as (t: number, delta: number) => void;
  act(() => cb(0, delta));
};

beforeEach(() => {
  velocity = 0;
  // The marquee reads the smoothed scroll velocity every frame.
  vi.mocked(useSpring).mockImplementation(((source: unknown, options: unknown) => ({
    __mv: "spring",
    source,
    options,
    get: () => velocity,
  })) as unknown as typeof useSpring);
  vi.mocked(useInView).mockReturnValue(true);
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(2000);
});

describe("<StatementBand /> (A-06)", () => {
  it("shows the Gazin highlight in mono on a flat surface band, without gradient", () => {
    const { container } = render(<StatementBand />);
    expect(container.querySelector("[data-track]")).toHaveClass("font-mono");
    expect(screen.getByText(SUBTITLE)).toBeInTheDocument();
    const band = container.firstElementChild!.firstElementChild!;
    expect(band).toHaveClass("bg-surface");
    expect(container.innerHTML).not.toMatch(/gradient/);
  });
});

describe("structure (SIG-70, SIG-71)", () => {
  it("reads the title from a real paragraph and hides the two running copies", () => {
    const { container } = render(<StatementBand />);
    const readable = screen.getAllByText(TITLE).filter((el) => !el.closest("[aria-hidden]"));
    expect(readable).toHaveLength(1);
    expect(readable[0].tagName).toBe("P");
    const track = container.querySelector("[data-track]")!;
    expect(track).toHaveAttribute("aria-hidden", "true");
    const copies = track.querySelectorAll("[data-copy]");
    expect(copies).toHaveLength(2);
    for (const copy of copies) expect(copy.textContent).toBe(`${TITLE}✦Serasa✦SPC✦Unico✦Gazin Tech✦`);
    const stars = track.querySelectorAll("[data-star]");
    expect(stars).toHaveLength(10);
    for (const star of stars) expect(star).toHaveClass("text-accent");
  });

  it("keeps the subtitle as still, visible text outside the track", () => {
    const { container } = render(<StatementBand />);
    const subtitle = screen.getByText(SUBTITLE);
    expect(container.querySelector("[data-track]")).not.toContainElement(subtitle);
    expect(subtitle.closest("[aria-hidden]")).toBeNull();
  });
});

describe("running (SIG-72)", () => {
  it("moves 40px/s left at rest and 3× faster at 2000px/s of scroll", () => {
    render(<StatementBand />);
    frame(1000);
    expect(trackX()).toBeCloseTo(-40);
    velocity = 2000;
    frame(500);
    expect(trackX()).toBeCloseTo(-40 - 60);
  });

  it("reverses when scrolling up and wraps over one copy's width", () => {
    render(<StatementBand />);
    velocity = -1000;
    frame(1000); // +80px from 0 → wraps to −1920 within (−2000, 0]
    expect(trackX()).toBeCloseTo(-1920);
  });
});

describe("lean (SIG-73)", () => {
  it("skews ±8° over ±2000px/s of spring-smoothed scroll velocity, clamped", () => {
    render(<StatementBand />);
    const velocityCall = vi.mocked(useVelocity).mock.calls[0];
    expect(velocityCall).toBeDefined();
    const smoothed = vi.mocked(useSpring).mock.calls.find(([source]) => (source as unknown as { __mv: string }).__mv === "velocity");
    expect(smoothed![1]).toEqual(spring.velocity);
    const calls = vi.mocked(useTransform).mock.calls as unknown as unknown[][];
    const skewCall = calls.find(([, input]) => Array.isArray(input) && input[0] === -2000);
    expect(skewCall!.slice(1)).toEqual([[-2000, 2000], [-8, 8], { clamp: true }]);
    expect(motionOf(document.querySelector("[data-track]")).style.skewX.__mv).toBe("transform");
  });
});

describe("pausing (SIG-74)", () => {
  it("holds still off screen", () => {
    vi.mocked(useInView).mockReturnValue(false);
    render(<StatementBand />);
    frame(1000);
    expect(trackX()).toBe(0);
  });

  it("holds still under the pointer and while focused, and runs again after", () => {
    const { container } = render(<StatementBand />);
    const band = container.firstElementChild!.firstElementChild!;
    fireEvent.pointerEnter(band);
    frame(1000);
    expect(trackX()).toBe(0);
    fireEvent.pointerLeave(band);
    fireEvent.focus(band);
    frame(1000);
    expect(trackX()).toBe(0);
    fireEvent.blur(band);
    frame(1000);
    expect(trackX()).toBeCloseTo(-40);
  });
});

describe("reduced motion (SIG-75)", () => {
  it("shows the title still, with no track, no skew and no clip", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<StatementBand />);
    expect(container.querySelector("[data-track]")).toBeNull();
    expect(screen.getByText(TITLE).tagName).toBe("P");
    expect(screen.getByText(TITLE)).not.toHaveClass("sr-only");
    expect(container.firstElementChild!.firstElementChild).not.toHaveAttribute("data-motion");
  });
});

describe("entrance clip (SIG-76)", () => {
  it("opens from the centre as the band enters, linked to its scroll", () => {
    const { container } = render(<StatementBand />);
    const options = vi.mocked(useScroll).mock.calls.map(([o]) => o).find((o) => o && "target" in o) as { offset: string[] };
    expect(options.offset).toEqual(["start end", "start center"]);
    const clip = motionOf(container.firstElementChild!.firstElementChild).style.clipPath;
    expect(clip.input).toEqual([0, 1]);
    expect(clip.output).toEqual(["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]);
  });
});

describe("stop control (SIG-77)", () => {
  it("stops and restarts the track with an aria-pressed button that has a 44px target and a visible focus ring", () => {
    render(<StatementBand />);
    const button = screen.getByRole("button", { name: "Pausar faixa" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveClass("min-h-[44px]", "focus-visible:ring-2", "focus-visible:ring-accent");
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Retomar faixa" })).toHaveAttribute("aria-pressed", "true");
    frame(1000);
    expect(trackX()).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Retomar faixa" }));
    frame(1000);
    expect(trackX()).toBeCloseTo(-40);
  });

  it("is not shown when nothing moves (reduced motion)", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<StatementBand />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
