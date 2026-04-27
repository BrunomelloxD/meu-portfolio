import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectGrid from "../project-grid";

describe("<ProjectGrid />", () => {
  it("should render all projects by default (filter = all)", () => {
    render(<ProjectGrid />);
    expect(screen.getByText("Meu Portfólio Profissional")).toBeInTheDocument();
    expect(screen.getByText("Cronometro Codecon")).toBeInTheDocument();
    expect(screen.getByText("API Ceps BR")).toBeInTheDocument();
    expect(screen.getByText("Speed Test - Medidor de Velocidade")).toBeInTheDocument();
  });

  it("should filter projects by category when a filter button is clicked", async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    await user.click(screen.getByRole("button", { name: "backend" }));

    expect(screen.getByText("API Ceps BR")).toBeInTheDocument();
    expect(screen.queryByText("Meu Portfólio Profissional")).not.toBeInTheDocument();
    expect(screen.queryByText("Cronometro Codecon")).not.toBeInTheDocument();
  });

  it("should filter to fullstack and show only matching projects", async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    await user.click(screen.getByRole("button", { name: "Full Stack" }));

    expect(screen.getByText("Speed Test - Medidor de Velocidade")).toBeInTheDocument();
    expect(screen.queryByText("API Ceps BR")).not.toBeInTheDocument();
  });

  it("should restore all projects when clicking 'Todos'", async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    await user.click(screen.getByRole("button", { name: "backend" }));
    await user.click(screen.getByRole("button", { name: "Todos" }));

    expect(screen.getByText("Meu Portfólio Profissional")).toBeInTheDocument();
    expect(screen.getByText("Cronometro Codecon")).toBeInTheDocument();
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

  it("should show empty filter result for mobile category", async () => {
    const user = userEvent.setup();
    render(<ProjectGrid />);

    await user.click(screen.getByRole("button", { name: "mobile" }));

    expect(screen.queryByText("Meu Portfólio Profissional")).not.toBeInTheDocument();
    expect(screen.queryByText("API Ceps BR")).not.toBeInTheDocument();
  });
});
