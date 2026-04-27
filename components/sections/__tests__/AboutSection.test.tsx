import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AboutSection } from "../AboutSection";
import { SECTION_IDS, PERSONAL_INFO, EDUCATION } from "@/lib/constants";

describe("<AboutSection />", () => {
  it("should render personal info and all education entries", () => {
    render(<AboutSection onNavigate={() => {}} />);

    expect(screen.getByText(PERSONAL_INFO.location)).toBeInTheDocument();
    expect(screen.getByText(PERSONAL_INFO.experience)).toBeInTheDocument();

    EDUCATION.forEach((edu) => {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
      expect(screen.getAllByText(edu.institution).length).toBeGreaterThan(0);
    });
  });

  it("should navigate to experience section when CTA is clicked", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(<AboutSection onNavigate={onNavigate} />);
    await user.click(screen.getByRole("button", { name: "Minha Experiência" }));

    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.EXPERIENCE);
  });
});
