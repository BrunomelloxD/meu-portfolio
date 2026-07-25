import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillsCloud from "../skills-cloud";

describe("<SkillsCloud />", () => {
  it("should render all 3 skill categories simultaneously", () => {
    render(<SkillsCloud />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Dados & DevOps")).toBeInTheDocument();
  });

  it("should render skills from each category", () => {
    render(<SkillsCloud />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("NestJS")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });
});
