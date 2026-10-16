import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkTable } from "../work-table";
import { SECTION_IDS } from "@/lib/constants";

describe("<WorkTable />", () => {
  it("is the 'experiencia' section titled 'Experiência'", () => {
    const { container } = render(<WorkTable />);
    expect(container.querySelector(`section#${SECTION_IDS.EXPERIENCE}`)).toHaveAttribute("aria-labelledby", "experiencia-title");
    expect(screen.getByRole("heading", { level: 2, name: "Experiência" })).toBeInTheDocument();
  });

  it("renders one collapsed row per experience, newest first (WORK-01)", () => {
    render(<WorkTable />);
    const rows = screen.getAllByRole("button");
    expect(rows.map((r) => r.getAttribute("aria-expanded"))).toEqual(["false", "false", "false", "false"]);
    expect(rows.map((r) => r.textContent)).toEqual([
      expect.stringContaining("Grupo UND"),
      expect.stringContaining("Desenvolvedor Júnior III"),
      expect.stringContaining("Desenvolvedor Júnior I"),
      expect.stringContaining("Alares Internet"),
    ]);
  });

  it("closes with 'Experiência total' and '+3 anos' (WORK-05)", () => {
    render(<WorkTable />);
    expect(screen.getByText("Experiência total")).toBeInTheDocument();
    expect(screen.getByText("+3 anos")).toBeInTheDocument();
  });
});
