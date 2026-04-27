import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeroSection } from "../HeroSection";
import { SECTION_IDS } from "@/lib/constants";

describe("<HeroSection />", () => {
  it("should render hero name and role", () => {
    render(<HeroSection onNavigate={() => {}} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bruno");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Mello");
  });

  it("should navigate to projects when 'Ver Projetos' is clicked", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(<HeroSection onNavigate={onNavigate} />);
    await user.click(screen.getByRole("button", { name: "Ver Projetos" }));

    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.PROJECTS);
  });

  it("should navigate to contact when 'Fale Comigo' is clicked", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(<HeroSection onNavigate={onNavigate} />);
    await user.click(screen.getByRole("button", { name: "Fale Comigo" }));

    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.CONTACT);
  });

  it("should navigate to about when scroll-down arrow is clicked", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(<HeroSection onNavigate={onNavigate} />);
    await user.click(screen.getByRole("button", { name: "Rolar para baixo" }));

    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.ABOUT);
  });
});
