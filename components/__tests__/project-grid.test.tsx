import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectGrid from "../project-grid";

describe("<ProjectGrid />", () => {
  it("should render the 3 featured projects", () => {
    render(<ProjectGrid />);
    expect(screen.getByText("TypeRacer")).toBeInTheDocument();
    expect(screen.getByText("Speed Test - Medidor de Velocidade")).toBeInTheDocument();
    expect(screen.getByText("API Ceps BR")).toBeInTheDocument();
  });

  it("should render external links to github with proper rel/target", () => {
    render(<ProjectGrid />);

    const githubLinks = screen.getAllByRole("link", { name: /Ver código/i });
    expect(githubLinks.length).toBeGreaterThan(0);
    githubLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("should render a 'Ver projeto' link for each project", () => {
    render(<ProjectGrid />);
    expect(screen.getAllByRole("link", { name: /Ver projeto/i })).toHaveLength(3);
  });
});
