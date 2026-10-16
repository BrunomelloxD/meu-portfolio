import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("<Button />", () => {
  it("renders the primary pill: inverse fill, dark text, fully round (HERO-04)", () => {
    render(<Button variant="pill">Ver projetos</Button>);
    const btn = screen.getByRole("button", { name: "Ver projetos" });
    expect(btn).toHaveClass("rounded-full", "bg-inverse", "text-inverse-ink", "hover:bg-accent");
  });

  it("renders the outline pill with a 3:1 control border", () => {
    render(<Button variant="pill-outline">Menu</Button>);
    expect(screen.getByRole("button", { name: "Menu" })).toHaveClass("rounded-full", "border-line-strong", "text-ink");
  });

  it("renders the icon circle at 52px", () => {
    render(<Button variant="icon-circle" aria-label="Próximo">→</Button>);
    expect(screen.getByRole("button", { name: "Próximo" })).toHaveClass("h-[52px]", "w-[52px]", "rounded-full");
  });

  it("shows a 2px accent focus ring and a pressed scale on every variant", () => {
    render(<Button variant="pill">Enviar</Button>);
    expect(screen.getByRole("button", { name: "Enviar" })).toHaveClass(
      "focus-visible:ring-2",
      "focus-visible:ring-accent",
      "active:scale-[0.98]",
    );
  });
});
