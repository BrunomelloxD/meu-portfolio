import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectCarousel } from "../project-carousel";

const slides = () => screen.getAllByRole("group", { hidden: true });
const activeTitle = () =>
  within(slides().find((s) => s.getAttribute("aria-hidden") !== "true")!).getByRole("heading").textContent;

describe("<ProjectCarousel />", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders Animal Helper, TypeRacer, Speed Test and API Ceps BR as labelled slides (PROJ-01, PROJ-04)", () => {
    render(<ProjectCarousel />);
    expect(slides().map((s) => s.getAttribute("aria-label"))).toEqual([
      "Projeto 1 de 4",
      "Projeto 2 de 4",
      "Projeto 3 de 4",
      "Projeto 4 de 4",
    ]);
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

  it("moves to the next and previous project with the buttons, in 400ms (PROJ-03)", async () => {
    const user = userEvent.setup();
    render(<ProjectCarousel />);

    await user.click(screen.getByRole("button", { name: "Próximo projeto" }));
    expect(activeTitle()).toBe("TypeRacer");
    expect(screen.getByText("2 / 4")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Projeto anterior" }));
    expect(activeTitle()).toBe("Animal Helper");
    expect(screen.getByTestId("track")).toHaveClass("duration-[400ms]");
  });

  it("wraps around from the first to the last project", async () => {
    const user = userEvent.setup();
    render(<ProjectCarousel />);
    await user.click(screen.getByRole("button", { name: "Projeto anterior" }));
    expect(activeTitle()).toBe("API Ceps BR");
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
});
