import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../Footer";
import { SOCIAL_LINKS, SECTION_IDS } from "@/lib/constants";

describe("<Footer />", () => {
  it("renders the current year in the copyright text", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Bruno Mello. Todos os direitos reservados.`)).toBeInTheDocument();
  });

  it("exposes all social links with proper rel/target", () => {
    render(<Footer />);

    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", SOCIAL_LINKS.github);
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", SOCIAL_LINKS.linkedin);
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", `mailto:${SOCIAL_LINKS.email}`);
  });

  it("closes with the name at display size and a 'Voltar ao topo' link to the start", () => {
    render(<Footer />);
    expect(screen.getByText("Bruno Mello")).toHaveClass("font-mono", "font-bold");
    expect(screen.getByRole("link", { name: "Voltar ao topo" })).toHaveAttribute("href", `#${SECTION_IDS.HOME}`);
  });

  it("no longer renders the RPG micro-label", () => {
    render(<Footer />);
    expect(screen.queryByText("Sítio da Graça")).not.toBeInTheDocument();
  });
});
