import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionLabel } from "../section-label";

describe("<SectionLabel />", () => {
  it("renders the label as an h2 whose accessible name excludes the decorative dots", () => {
    render(<SectionLabel>Sobre</SectionLabel>);
    expect(screen.getByRole("heading", { level: 2, name: "Sobre" })).toBeInTheDocument();
  });

  it("shows the inspiration pattern …/Label… with the dots hidden from assistive tech", () => {
    const { container } = render(<SectionLabel>Sobre</SectionLabel>);
    expect(container.textContent).toBe("…/Sobre…");
    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(Array.from(hidden).map((n) => n.textContent)).toEqual(["…/", "…"]);
  });

  it("forwards the id so the section can be aria-labelledby it", () => {
    render(<SectionLabel id="sobre-title">Sobre</SectionLabel>);
    expect(screen.getByRole("heading", { name: "Sobre" })).toHaveAttribute("id", "sobre-title");
  });
});
