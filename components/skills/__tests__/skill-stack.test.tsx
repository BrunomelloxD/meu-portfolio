import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillStack } from "../skill-stack";
import { SECTION_IDS } from "@/lib/constants";
import { SKILLS_CAPTION } from "@/lib/content";

describe("<SkillStack />", () => {
  it("renders the three groups with all 28 skills (ABOUT-03)", () => {
    const { container } = render(<SkillStack />);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Frontend", "Backend", "Dados & DevOps"]);
    const skills = Array.from(container.querySelectorAll("p.font-mono")).flatMap((p) => p.textContent!.split(" / "));
    expect(skills).toHaveLength(28);
  });

  it("highlights only the first group with the inverse card", () => {
    render(<SkillStack />);
    const cards = screen.getAllByRole("heading", { level: 3 }).map((h) => h.closest("div"));
    expect(cards.map((c) => c!.classList.contains("bg-inverse"))).toEqual([true, false, false]);
  });

  it("shows the black-and-white portrait with its alt text (ABOUT-02)", () => {
    render(<SkillStack />);
    const photo = screen.getByRole("img", { name: "Retrato de Bruno Mello" });
    expect(photo).toHaveAttribute("src", "/images/profile-img.jpg");
    expect(photo).toHaveClass("grayscale");
  });

  it("is the 'Habilidades' navigation target and shows the caption", () => {
    const { container } = render(<SkillStack />);
    expect(container.querySelector(`#${SECTION_IDS.SKILLS}`)).not.toBeNull();
    expect(screen.getByText((_, el) => el?.tagName === "P" && el.textContent === SKILLS_CAPTION)).toBeInTheDocument();
  });

  it("renders extra content under the portrait", () => {
    render(<SkillStack>Formação</SkillStack>);
    expect(screen.getByText("Formação")).toBeInTheDocument();
  });
});
