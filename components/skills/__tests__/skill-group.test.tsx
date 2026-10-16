import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillGroup } from "../skill-group";
import { skillCategories } from "@/lib/content";

const frontend = skillCategories[0];

describe("<SkillGroup />", () => {
  it("lists every skill of the category separated by ' / ' (ABOUT-03)", () => {
    render(<SkillGroup category={frontend} />);
    expect(screen.getByRole("heading", { level: 3, name: "Frontend" })).toBeInTheDocument();
    expect(screen.getByText(frontend.skills.join(" / "))).toHaveClass("font-mono");
    expect(frontend.skills).toHaveLength(10);
  });

  it("uses the inverse card for the highlighted group", () => {
    render(<SkillGroup category={frontend} inverse />);
    expect(screen.getByRole("heading", { name: "Frontend" }).closest("div")).toHaveClass("bg-inverse");
  });
});
