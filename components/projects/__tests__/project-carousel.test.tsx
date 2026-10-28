import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, within, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectCarousel } from "../project-carousel";
import { SCRAMBLE_GLYPHS } from "@/lib/text-motion";

const motionOf = (el: Element) => JSON.parse(el.getAttribute("data-motion")!);

/** Simulates a viewport of `width` px for every media query the carousel reads. */
const setViewport = (width: number) => {
  vi.mocked(window.matchMedia).mockImplementation((query: string) => {
    const min = /min-width:\s*(\d+)px/.exec(query);
    const max = /max-width:\s*(\d+)px/.exec(query);
    const matches = (!min || width >= Number(min[1])) && (!max || width <= Number(max[1]));
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  });
};

const slides = () => screen.getAllByRole("group", { hidden: true });
/** Text as assistive tech reads it: aria-hidden subtrees (the painted scramble) are skipped. */
const spokenText = (node: Node): string =>
  node.nodeType === Node.TEXT_NODE
    ? node.textContent!
    : (node as Element).getAttribute?.("aria-hidden") === "true"
      ? ""
      : [...node.childNodes].map(spokenText).join("");
const activeTitle = () =>
  spokenText(within(slides().find((s) => s.getAttribute("aria-hidden") !== "true")!).getByRole("heading"));

describe("<ProjectCarousel />", () => {
  afterEach(() => {
    vi.useRealTimers();
    setViewport(390);
  });

  it("renders Animal Helper, TypeRacer and Speed Test as labelled slides (PROJ-01, PROJ-04)", () => {
    render(<ProjectCarousel />);
    expect(slides().map((s) => s.getAttribute("aria-label"))).toEqual(["Projeto 1 de 3", "Projeto 2 de 3", "Projeto 3 de 3"]);
    expect(screen.getByRole("region", { name: "Projetos" })).toHaveAttribute("aria-roledescription", "carrossel");
    expect(activeTitle()).toBe("Animal Helper");
  });

  it("hides inactive slides from assistive tech and keyboard", () => {
    render(<ProjectCarousel />);
    const [, second, third] = slides();
    expect(second).toHaveAttribute("aria-hidden", "true");
    expect(second).toHaveAttribute("inert");
    expect(third).toHaveAttribute("aria-hidden", "true");
  });

  it("moves to the next and previous project with the buttons (PROJ-03)", async () => {
    const user = userEvent.setup();
    render(<ProjectCarousel />);

    await user.click(screen.getByRole("button", { name: "Próximo projeto" }));
    expect(activeTitle()).toBe("TypeRacer");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Projeto anterior" }));
    expect(activeTitle()).toBe("Animal Helper");
  });

  it("wraps around from the first to the last project", async () => {
    const user = userEvent.setup();
    render(<ProjectCarousel />);
    await user.click(screen.getByRole("button", { name: "Projeto anterior" }));
    expect(activeTitle()).toBe("Speed Test");
  });

  it("is operable with the arrow keys when focused (PROJ-04)", () => {
    render(<ProjectCarousel />);
    const region = screen.getByRole("region", { name: "Projetos" });

    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(activeTitle()).toBe("TypeRacer");
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(activeTitle()).toBe("Animal Helper");
  });

  it("never advances on its own (PROJ-05)", () => {
    vi.useFakeTimers();
    render(<ProjectCarousel />);
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(activeTitle()).toBe("Animal Helper");
  });

  it("uses horizontal scroll-snap with 88%-wide slides on phones (PROJ-06)", () => {
    render(<ProjectCarousel />);
    expect(screen.getByTestId("track")).toHaveClass("snap-x", "snap-mandatory", "overflow-x-auto", "lg:overflow-visible");
    for (const slide of slides()) expect(slide).toHaveClass("w-[88%]", "snap-center");
  });

  describe("motion (desktop >= 1024px)", () => {
    it("springs the track to x = -812 after 'Próximo projeto', with the settle spring (MOV-25)", async () => {
      setViewport(1280);
      const user = userEvent.setup();
      render(<ProjectCarousel />);
      const track = screen.getByTestId("track");
      expect(motionOf(track).animate).toEqual({ x: 0 });

      await user.click(screen.getByRole("button", { name: "Próximo projeto" }));
      expect(motionOf(track).animate).toEqual({ x: -812 });
      expect(motionOf(track).transition).toEqual({ type: "spring", stiffness: 220, damping: 32, mass: 1 });

      await user.click(screen.getByRole("button", { name: "Próximo projeto" }));
      expect(motionOf(track).animate).toEqual({ x: -1624 });
      expect(track.style.transform).toBe("");
    });

    it("keeps one spring target per click so rapid clicks retarget it instead of jumping (MOV-25, edge case)", async () => {
      setViewport(1280);
      const user = userEvent.setup();
      render(<ProjectCarousel />);
      const next = screen.getByRole("button", { name: "Próximo projeto" });
      await user.click(next);
      await user.click(next);
      await user.click(next);
      // Wraps back to the first project; the same motion.div keeps animating from its current x.
      expect(motionOf(screen.getByTestId("track")).animate).toEqual({ x: 0 });
      expect(activeTitle()).toBe("Animal Helper");
    });

    it("dims inactive slides to 0.35 and keeps the active one at 1, over 0.32s inOut (MOV-27)", async () => {
      setViewport(1280);
      const user = userEvent.setup();
      render(<ProjectCarousel />);
      const inOut = { duration: 0.32, ease: [0.76, 0, 0.24, 1] };

      expect(slides().map((s) => motionOf(s).animate.opacity)).toEqual([1, 0.35, 0.35]);
      for (const slide of slides()) expect(motionOf(slide).transition).toEqual(inOut);

      await user.click(screen.getByRole("button", { name: "Próximo projeto" }));
      expect(slides().map((s) => motionOf(s).animate.opacity)).toEqual([0.35, 1, 0.35]);
      expect(slides()[0]).toHaveAttribute("inert");
      expect(slides()[1]).not.toHaveAttribute("aria-hidden");
    });

    it("no longer uses the CSS transform/opacity transitions", () => {
      setViewport(1280);
      render(<ProjectCarousel />);
      const track = screen.getByTestId("track");
      expect(track.style.getPropertyValue("--i")).toBe("");
      expect(track.className).not.toMatch(/transition-transform|translateX|duration-\[400ms\]/);
      for (const slide of slides()) expect(slide.className).not.toMatch(/transition-opacity|opacity-\[0\.35\]/);
    });
  });

  describe("motion (below 1024px)", () => {
    it("gives the track no Motion x so native scroll-snap drives it (MOV-26)", async () => {
      setViewport(390);
      const user = userEvent.setup();
      const scrollIntoView = vi.mocked(HTMLElement.prototype.scrollIntoView);
      scrollIntoView.mockClear();
      render(<ProjectCarousel />);
      const track = screen.getByTestId("track");

      await user.click(screen.getByRole("button", { name: "Próximo projeto" }));
      expect(motionOf(track).animate).toBeUndefined();
      expect(track.style.transform).toBe("none");
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", inline: "center", block: "nearest" });
      expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });

    it("keeps every slide fully opaque on phones (MOV-27 applies only >= 1024px)", () => {
      setViewport(390);
      render(<ProjectCarousel />);
      expect(slides().map((s) => motionOf(s).animate.opacity)).toEqual([1, 1, 1]);
    });

    it("follows the viewport when it crosses 1024px", () => {
      let listener: (() => void) | undefined;
      let wide = false;
      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        get matches() {
          return query.includes("min-width") ? wide : !wide;
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((_: string, cb: () => void) => {
          if (query.includes("min-width")) listener = cb;
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList);
      render(<ProjectCarousel />);
      const track = screen.getByTestId("track");
      expect(motionOf(track).animate).toBeUndefined();

      wide = true;
      act(() => listener!());
      expect(motionOf(track).animate).toEqual({ x: 0 });
    });
  });
});

describe("hover on the active project (SIG-122, SIG-126)", () => {
  const article = (slide: Element) => slide.querySelector("article")!;
  const base = { duration: 0.32, ease: [0.32, 0.72, 0, 1] };

  /** A desktop-wide viewport whose pointer is fine or coarse. */
  const setPointer = (fine: boolean) =>
    vi.mocked(window.matchMedia).mockImplementation(
      (query: string) =>
        ({
          matches: query === "(hover: hover) and (pointer: fine)" ? fine : /min-width:\s*1024px/.test(query),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );

  it("zooms the picture to 1.03 inside its frame and lifts the CTA block 6px, over dur.base out (SIG-122)", () => {
    setPointer(true);
    render(<ProjectCarousel />);
    const active = article(slides()[0]);
    expect(motionOf(active).whileHover).toBe("hover");

    const picture = active.querySelector("[data-picture]")!;
    expect(picture.parentElement).toHaveClass("overflow-hidden");
    expect(motionOf(picture)).toMatchObject({ variants: { hover: { scale: 1.03 } }, transition: base });
    expect(within(picture as HTMLElement).getByRole("img")).toBeInTheDocument();

    const cta = active.querySelector("[data-cta]")!;
    expect(motionOf(cta)).toMatchObject({ variants: { hover: { y: -6 } }, transition: base });
    // The CTA keeps its own magnetic pull: the slide's "hover" label must not reach its variants.
    expect(motionOf(within(cta as HTMLElement).getByRole("link", { name: /Ver projeto/ })).inherit).toBe(false);
  });

  it("gives inactive slides no hover", () => {
    setPointer(true);
    render(<ProjectCarousel />);
    for (const slide of slides().slice(1)) expect(motionOf(article(slide))?.whileHover).toBeUndefined();
  });

  it("has no hover with a coarse pointer, below 1024px or under reduced motion (SIG-122, SIG-126)", async () => {
    const hoverOfActive = () => motionOf(article(slides()[0]))?.whileHover;
    setPointer(false);
    const { unmount } = render(<ProjectCarousel />);
    expect(hoverOfActive()).toBeUndefined();
    unmount();

    setViewport(390);
    const phone = render(<ProjectCarousel />);
    expect(hoverOfActive()).toBeUndefined();
    phone.unmount();

    setPointer(true);
    const { useReducedMotion } = await import("motion/react");
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<ProjectCarousel />);
    expect(hoverOfActive()).toBeUndefined();
  });

  it("no longer tilts the card nor draws a spotlight", () => {
    setPointer(true);
    render(<ProjectCarousel />);
    expect(document.querySelector("[data-spotlight]")).toBeNull();
    for (const el of document.querySelectorAll("[data-motion]")) {
      expect(motionOf(el).style ?? {}).not.toHaveProperty("rotateX");
      expect(motionOf(el).style ?? {}).not.toHaveProperty("transformPerspective");
    }
  });
});

describe("drag on desktop (SIG-121, SIG-64, SIG-65, SIG-126)", () => {
  type DragProps = {
    drag?: string;
    dragElastic?: number;
    dragMomentum?: boolean;
    dragConstraints?: { left: number; right: number };
    onDragEnd?: (event: unknown, info: { offset: { x: number }; velocity: { x: number } }) => void;
  };
  const propsOf = async (el: Element) =>
    ((await import("motion/react")) as unknown as { __motionPropsOf: (el: Element) => DragProps }).__motionPropsOf(el);
  const release = async (offsetX: number, velocityX = 0) => {
    const { onDragEnd } = await propsOf(screen.getByTestId("track"));
    act(() => onDragEnd!({}, { offset: { x: offsetX }, velocity: { x: velocityX } }));
  };
  const trackX = () => motionOf(screen.getByTestId("track")).animate.x;

  it("drags the track on x with elastic 0.12, held between the first and last slide", async () => {
    setViewport(1440);
    render(<ProjectCarousel />);
    const props = await propsOf(screen.getByTestId("track"));
    expect(props.drag).toBe("x");
    expect(props.dragElastic).toBe(0.12);
    expect(props.dragConstraints).toEqual({ left: -(slides().length - 1) * 812, right: 0 });
  });

  it("advances after −121px or a −501px/s flick, goes back after +121px, stays otherwise (SIG-121)", async () => {
    setViewport(1440);
    render(<ProjectCarousel />);
    await release(-121);
    expect(trackX()).toBe(-812);
    await release(-10, -501);
    expect(trackX()).toBe(-1624);
    await release(121);
    expect(trackX()).toBe(-812);
    await release(-120, -500);
    expect(trackX()).toBe(-812);
  });

  it("settles with the settle spring after a drag, the same as after a button (SIG-121)", async () => {
    setViewport(1440);
    const user = userEvent.setup();
    render(<ProjectCarousel />);
    const settle = { type: "spring", stiffness: 220, damping: 32, mass: 1 };
    await release(-200);
    expect(trackX()).toBe(-812);
    expect(motionOf(screen.getByTestId("track")).transition).toEqual(settle);
    await user.click(screen.getByRole("button", { name: "Próximo projeto" }));
    expect(motionOf(screen.getByTestId("track")).transition).toEqual(settle);
  });

  it("springs the track back to the slide after a drag that stays on it, with settle and the release velocity (SIG-121)", async () => {
    setViewport(1440);
    const motion = await import("motion/react");
    render(<ProjectCarousel />);
    await release(-121); // now on the second slide, x = -812
    vi.mocked(motion.animate).mockClear();
    await release(-60, -300);
    expect(trackX()).toBe(-812);
    const { style } = (await propsOf(screen.getByTestId("track"))) as { style: { x: unknown } };
    expect(vi.mocked(motion.animate)).toHaveBeenCalledTimes(1);
    const [value, target, options] = vi.mocked(motion.animate).mock.calls[0] as unknown as [unknown, number, object];
    expect(value).toBe(style.x); // the track's own x, the value the drag moved
    expect(target).toBe(-812);
    expect(options).toEqual({ type: "spring", stiffness: 220, damping: 32, mass: 1, velocity: -300 });
  });

  it("leaves a drag that changes slide to the animate target (no extra animation)", async () => {
    setViewport(1440);
    const motion = await import("motion/react");
    render(<ProjectCarousel />);
    vi.mocked(motion.animate).mockClear();
    await release(-200);
    expect(trackX()).toBe(-812);
    expect(vi.mocked(motion.animate)).not.toHaveBeenCalled();
  });

  it("stops at the ends instead of wrapping", async () => {
    setViewport(1440);
    render(<ProjectCarousel />);
    await release(300);
    expect(trackX()).toBe(0); // still the first slide (wrapping would land on the last)
    expect(activeTitle()).toBe(within(slides()[0]).getByRole("heading").textContent);
  });

  it("swallows the click that ends a drag longer than 6px, not a shorter one (SIG-64)", async () => {
    setViewport(1440);
    render(<ProjectCarousel />);
    const link = within(slides()[0]).getAllByRole("link")[0];
    const onClick = vi.fn((e: Event) => e.preventDefault());
    link.addEventListener("click", onClick);
    await release(-7);
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
    await release(-6);
    fireEvent.click(within(slides()[0]).getAllByRole("link")[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has no drag below 1024px (SIG-65)", async () => {
    setViewport(390);
    render(<ProjectCarousel />);
    expect((await propsOf(screen.getByTestId("track"))).drag).toBeUndefined();
  });

  it("has no drag under reduced motion, and the buttons still move (SIG-126)", async () => {
    setViewport(1440);
    const { useReducedMotion } = await import("motion/react");
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const user = userEvent.setup();
    render(<ProjectCarousel />);
    expect((await propsOf(screen.getByTestId("track"))).drag).toBeUndefined();
    await user.click(screen.getByRole("button", { name: "Próximo projeto" }));
    expect(trackX()).toBe(-812);
  });
});

describe("entrance of the newly active slide (SIG-123, SIG-124, SIG-126)", () => {
  const pictureOf = (slide: Element) => slide.querySelector('[data-enter="picture"]');
  const textOf = (slide: Element) => slide.querySelector('[data-enter="text"]');
  const active = () => slides().find((s) => s.getAttribute("aria-hidden") !== "true")!;
  const base = { duration: 0.32, ease: [0.32, 0.72, 0, 1] };

  it("fades the picture in and the text in from 12px, both over dur.base out, without clip or scale (SIG-123)", async () => {
    setViewport(1440);
    const user = userEvent.setup();
    render(<ProjectCarousel />);
    await user.click(screen.getByRole("button", { name: "Próximo projeto" }));

    const picture = pictureOf(active())!;
    expect(motionOf(picture)).toEqual({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: base });
    expect(within(picture as HTMLElement).getByRole("img")).toBeInTheDocument();

    const text = textOf(active())!;
    expect(motionOf(text)).toEqual({ initial: { opacity: 0, x: 12 }, animate: { opacity: 1, x: 0 }, transition: base });
    expect(within(text as HTMLElement).getByRole("heading")).toBeInTheDocument();

    expect(document.querySelector("[data-shutter]")).toBeNull();
    expect(document.body.innerHTML).not.toMatch(/clipPath|"scale":1\.12/);
    // Only the active slide carries it.
    expect(slides().filter((s) => pictureOf(s) || textOf(s))).toEqual([active()]);
  });

  it("replays the entrance on the next slide", async () => {
    setViewport(1440);
    const user = userEvent.setup();
    render(<ProjectCarousel />);
    const next = screen.getByRole("button", { name: "Próximo projeto" });
    await user.click(next);
    const first = textOf(active());
    await user.click(next);
    expect(textOf(active())).not.toBe(first);
    expect(motionOf(textOf(active())!).initial).toEqual({ opacity: 0, x: 12 });
  });

  it("does not replay the entrance after a drag that lands on the same slide (edge case)", async () => {
    setViewport(1440);
    const { __motionPropsOf } = (await import("motion/react")) as unknown as {
      __motionPropsOf: (el: Element) => { onDragEnd: (e: unknown, i: { offset: { x: number }; velocity: { x: number } }) => void };
    };
    render(<ProjectCarousel />);
    act(() => __motionPropsOf(screen.getByTestId("track")).onDragEnd({}, { offset: { x: -60 }, velocity: { x: 0 } }));
    expect(slides().filter((s) => pictureOf(s) || textOf(s))).toHaveLength(0);
  });

  it("renders the slide that is active on mount without an entrance (SIG-124)", () => {
    setViewport(1440);
    render(<ProjectCarousel />);
    expect(slides().filter((s) => pictureOf(s) || textOf(s))).toHaveLength(0);
  });

  it("plays the entrance on the slide reached by native scroll on phones", () => {
    setViewport(390);
    render(<ProjectCarousel />);
    const track = screen.getByTestId("track");
    Object.defineProperty(track.children[0], "offsetWidth", { configurable: true, value: 343 });
    Object.defineProperty(track, "scrollLeft", { configurable: true, value: 359 });
    fireEvent.scroll(track);
    expect(pictureOf(active())).not.toBeNull();
    expect(textOf(active())).not.toBeNull();
  });

  it("only fades, without the x offset, under reduced motion (SIG-126)", async () => {
    setViewport(1440);
    const { useReducedMotion } = await import("motion/react");
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const user = userEvent.setup();
    render(<ProjectCarousel />);
    await user.click(screen.getByRole("button", { name: "Próximo projeto" }));
    expect(motionOf(pictureOf(active())!)).toEqual({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: base });
    expect(motionOf(textOf(active())!)).toEqual({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: base });
  });
});

describe("title scramble on the newly active slide (SIG-125, SIG-126)", () => {
  let frames: FrameRequestCallback[];
  const runFrame = (now: number) => {
    const queue = frames;
    frames = [];
    act(() => queue.forEach((cb) => cb(now)));
  };
  const heading = () => within(slides().find((s) => s.getAttribute("aria-hidden") !== "true")!).getByRole("heading");
  const painted = () => heading().querySelector("[aria-hidden]");
  const next = () => fireEvent.keyDown(screen.getByRole("region", { name: "Projetos" }), { key: "ArrowRight" });

  beforeEach(() => {
    frames = [];
    vi.stubGlobal("requestAnimationFrame", vi.fn((cb: FrameRequestCallback) => frames.push(cb)));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it("decodes the title once, with titleResolve, and keeps the final title as the heading name (SIG-125)", () => {
    setViewport(1440);
    render(<ProjectCarousel />);
    next();

    runFrame(1000); // t = 0: every character is a glyph
    const first = painted()!.textContent!;
    expect(first).toHaveLength("TypeRacer".length);
    for (const ch of first) expect(SCRAMBLE_GLYPHS).toContain(ch);
    expect(activeTitle()).toBe("TypeRacer");
    expect(screen.getByRole("heading", { name: "TypeRacer" })).toBe(heading());

    runFrame(1000 + 280 + 35); // two characters settled (280ms lead, 35ms each)
    expect(painted()!.textContent!.slice(0, 2)).toBe("Ty");

    runFrame(1000 + 280 + 8 * 35); // last character settles: plain text again
    expect(painted()).toBeNull();
    expect(heading().textContent).toBe("TypeRacer");
    expect(frames).toHaveLength(0);
  });

  it("does not scramble the title of the slide that is active on mount", () => {
    setViewport(1440);
    render(<ProjectCarousel />);
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(painted()).toBeNull();
  });

  it("does not scramble under reduced motion (SIG-126)", async () => {
    setViewport(1440);
    const { useReducedMotion } = await import("motion/react");
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<ProjectCarousel />);
    next();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(heading().textContent).toBe("TypeRacer");
  });
});
