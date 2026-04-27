import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExperienceTimeline from "../experience-timeline";

describe("<ExperienceTimeline />", () => {
  it("should render all experience entries with role, company and period", () => {
    render(<ExperienceTimeline />);

    expect(screen.getByText("Desenvolvedor Pleno")).toBeInTheDocument();
    expect(screen.getByText("Desenvolvedor Júnior")).toBeInTheDocument();
    expect(screen.getByText("Desenvolvedor Backend Júnior")).toBeInTheDocument();

    expect(screen.getAllByText(/Gazin Tech/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Alares Internet/).length).toBeGreaterThan(0);

    expect(screen.getByText("2025 - Presente")).toBeInTheDocument();
    expect(screen.getByText("2024 - 2025")).toBeInTheDocument();
    expect(screen.getByText("2023 - 2024")).toBeInTheDocument();
  });

  it("should render technology badges for each experience", () => {
    render(<ExperienceTimeline />);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Docker").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NestJS").length).toBeGreaterThan(0);
  });
});
