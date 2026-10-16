import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeroSection } from "../HeroSection";
import { SECTION_IDS, SOCIAL_LINKS } from "@/lib/constants";

describe("<HeroSection />", () => {
  it("renders the role as the h1, with the name for screen readers (HERO-01)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Engenheiro");
    expect(h1).toHaveTextContent("Full Stack");
    expect(h1).toHaveTextContent("Bruno Mello");
  });

  it("aligns line one left and line two right from lg up, both left on phones (HERO-01, HERO-06)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    const line2 = screen.getByText("Full Stack");
    expect(line2.closest("[data-line]")).toHaveClass("lg:self-end");
    expect(screen.getByText("Engenheiro").closest("[data-line]")).not.toHaveClass("lg:self-end");
  });

  it("shows the supporting sentence (HERO-03)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    expect(
      screen.getByText((_, el) =>
        el?.tagName === "P" &&
        el.textContent === "Crio experiências digitais robustas com código limpo, arquitetura sólida e atenção aos detalhes.",
      ),
    ).toBeInTheDocument();
  });

  it("scrolls to projects from 'Ver projetos' (HERO-04)", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<HeroSection onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "Ver projetos" }));
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.PROJECTS);
  });

  it("links GitHub, LinkedIn and Email from SOCIAL_LINKS (HERO-05)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", SOCIAL_LINKS.github);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", SOCIAL_LINKS.linkedin);
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", `mailto:${SOCIAL_LINKS.email}`);
  });

  it("wraps each display line in its own mask for the reveal (MOT-01)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    for (const text of ["Engenheiro", "Full Stack"]) {
      expect(screen.getByText(text).closest("[data-line]")).toHaveClass("overflow-hidden");
      expect(screen.getByText(text)).toHaveClass("animate-mask-up");
    }
    expect(screen.getByText("Engenheiro")).toHaveStyle({ animationDelay: "0ms" });
    expect(screen.getByText("Full Stack")).toHaveStyle({ animationDelay: "110ms" });
  });

  it("no longer renders the Erdtree background image", () => {
    const { container } = render(<HeroSection onNavigate={() => {}} />);
    expect(container.querySelector('img[src="/images/hero-erdtree.jpg"]')).toBeNull();
  });
});
