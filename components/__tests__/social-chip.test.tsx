import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialChip } from "../social-chip";

describe("<SocialChip />", () => {
  it("links to an external URL in a new tab with noopener (HERO-05)", () => {
    render(<SocialChip href="https://github.com/BrunomelloxD" label="GitHub" />);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", "https://github.com/BrunomelloxD");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps mailto links in the same tab", () => {
    render(<SocialChip href="mailto:brunomello.ti@gmail.com" label="Email" />);
    expect(screen.getByRole("link", { name: "Email" })).not.toHaveAttribute("target");
  });

  it("meets the 44px touch target and shows the accent focus ring", () => {
    render(<SocialChip href="https://linkedin.com/in/brunomelloxd/" label="LinkedIn" />);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveClass("min-h-[44px]", "focus-visible:ring-2", "focus-visible:ring-accent");
  });
});
