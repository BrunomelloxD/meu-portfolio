import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "../AboutSection";
import { EDUCATION, STATS } from "@/lib/constants";

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
});
