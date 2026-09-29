import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "../AboutSection";
import { EDUCATION, STATS, PERSONAL_INFO } from "@/lib/constants";

describe("<AboutSection />", () => {
  it("should render all education entries", () => {
    render(<AboutSection />);

    EDUCATION.forEach((edu) => {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
      expect(screen.getAllByText(edu.institution).length).toBeGreaterThan(0);
    });
  });

  it("should render the stats grid", () => {
    render(<AboutSection />);

    STATS.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    });
  });

  it("should render the Portrait panel with name, role and location", () => {
    render(<AboutSection />);

    expect(screen.getByText(PERSONAL_INFO.name)).toBeInTheDocument();
    expect(screen.getByText(PERSONAL_INFO.role)).toBeInTheDocument();
    expect(screen.getByText(PERSONAL_INFO.location)).toBeInTheDocument();
    expect(screen.getByText("Disponível para novos projetos")).toBeInTheDocument();
  });
});
