import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectCarousel } from "../project-carousel";

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
const activeTitle = () =>
  within(slides().find((s) => s.getAttribute("aria-hidden") !== "true")!).getByRole("heading").textContent;

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
