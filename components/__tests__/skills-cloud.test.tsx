import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkillsCloud from "../skills-cloud";

describe("<SkillsCloud />", () => {
  it("should render frontend skills by default", () => {
    render(<SkillsCloud />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.queryByText("NestJS")).not.toBeInTheDocument();
  });

  it("should switch to backend category and show backend skills", async () => {
    const user = userEvent.setup();
    render(<SkillsCloud />);

    await user.click(screen.getByRole("button", { name: "Backend" }));

    expect(screen.getByText("NestJS")).toBeInTheDocument();
    expect(screen.getByText("Laravel")).toBeInTheDocument();
    expect(screen.queryByText("Tailwind CSS")).not.toBeInTheDocument();
  });

  it("should switch to outros category and show tooling skills", async () => {
    const user = userEvent.setup();
    render(<SkillsCloud />);

    await user.click(screen.getByRole("button", { name: "Outros" }));

    expect(screen.getByText("Git")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  it("should label skill levels correctly (Avançado/Intermediário/Básico)", async () => {
    const user = userEvent.setup();
    render(<SkillsCloud />);
    await user.click(screen.getByRole("button", { name: "Outros" }));

    // Git = 90 -> Avançado
    expect(screen.getAllByText("Avançado").length).toBeGreaterThan(0);
    // Docker = 50 -> Básico
    expect(screen.getAllByText("Básico").length).toBeGreaterThan(0);
    // ElasticSearch = 60 -> Intermediário
    expect(screen.getAllByText("Intermediário").length).toBeGreaterThan(0);
  });
});
