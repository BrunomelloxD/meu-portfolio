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

  it("should render the Erdtree background via next/image with 100vw sizes", () => {
    const { container } = render(<HeroSection onNavigate={() => {}} />);
    const img = container.querySelector("img");

    expect(img).toHaveAttribute("src", "/images/hero-erdtree.jpg");
    expect(img).toHaveAttribute("sizes", "100vw");
  });

  it("should not render the removed terminal window code blocks", () => {
    render(<HeroSection onNavigate={() => {}} />);

    expect(screen.queryByText(/portfolio\.ts/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$ whoami/)).not.toBeInTheDocument();
  });
});
