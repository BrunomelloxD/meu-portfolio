import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "../card";

describe("<Card />", () => {
  it("renders the default card on the surface tone with a 1px line border and no shadow (ABOUT-03)", () => {
    render(<Card>Backend</Card>);
    const card = screen.getByText("Backend");
    expect(card).toHaveClass("rounded-card", "border", "border-line", "bg-surface");
    expect(card.className).not.toMatch(/shadow/);
  });

  it("renders the inverse variant with inverse fill and dark ink (ABOUT-03)", () => {
    render(<Card variant="inverse">Frontend</Card>);
    expect(screen.getByText("Frontend")).toHaveClass("bg-inverse", "text-inverse-ink");
  });
});
