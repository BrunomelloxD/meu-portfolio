import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Testimonials } from "../testimonials";
import { SECTION_IDS } from "@/lib/constants";

describe("<Testimonials />", () => {
  it("is the 'depoimentos' section labelled by its h2", () => {
    const { container } = render(<Testimonials />);
    expect(container.querySelector(`section#${SECTION_IDS.TESTIMONIALS}`)).toHaveAttribute("aria-labelledby", "depoimentos-title");
    expect(screen.getByRole("heading", { level: 2, name: "Depoimentos" })).toBeInTheDocument();
  });

  it("shows all three testimonials at once, with no interaction and no autoplay (TEST-01)", () => {
    vi.useFakeTimers();
    render(<Testimonials />);
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.getByText("Lucas Lopes de Souza Guilha")).toBeInTheDocument();
    expect(screen.getByText("Thiago André")).toBeInTheDocument();
    expect(screen.getByText("Engenheiro Desenvolvedor Full Stack Sênior")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Thiago André" })).toHaveAttribute("src", "/images/thiago-andre.jpg");
    expect(screen.getByText("Felipe Sasaki")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("highlights Lucas's line as the pull quote (TEST-02)", () => {
    render(<Testimonials />);
    const quote = screen.getByText("“Ele não espera os problemas acontecerem: vai atrás.”");
    expect(quote.closest("blockquote")).not.toBeNull();
    expect(screen.getByText("— Lucas Lopes de Souza Guilha, Gazin Tech")).toBeInTheDocument();
  });
});
