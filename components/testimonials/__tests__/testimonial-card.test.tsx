import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestimonialCard } from "../testimonial-card";
import { testimonials } from "@/lib/content";

const [lucas, , felipe] = testimonials;

describe("<TestimonialCard />", () => {
  it("shows the full text, name, role and avatar (TEST-01)", () => {
    render(<TestimonialCard testimonial={felipe} />);
    expect(screen.getByText(felipe.paragraphs[0])).toBeInTheDocument();
    expect(screen.getByText("Felipe Sasaki")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer, IEBT Innovation")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Felipe Sasaki" })).toHaveAttribute("src", felipe.avatar);
  });

  it("clamps a long testimonial to 6 lines on phones with a 'Ler tudo' toggle (TEST-03)", async () => {
    const user = userEvent.setup();
    render(<TestimonialCard testimonial={lucas} />);

    const body = screen.getByTestId("testimonial-body");
    expect(body).toHaveClass("max-md:line-clamp-6");

    const more = screen.getByRole("button", { name: "Ler tudo" });
    expect(more).toHaveAttribute("aria-expanded", "false");
    expect(more).toHaveClass("md:hidden", "min-h-[44px]");

    await user.click(more);
    expect(body).not.toHaveClass("max-md:line-clamp-6");
    expect(screen.getByRole("button", { name: "Mostrar menos" })).toHaveAttribute("aria-expanded", "true");
  });

  it("does not offer 'Ler tudo' for a testimonial that fits in 6 lines", () => {
    render(<TestimonialCard testimonial={{ ...felipe, paragraphs: ["Ótimo colega de time."] }} />);
    expect(screen.queryByRole("button", { name: "Ler tudo" })).not.toBeInTheDocument();
  });

  it("falls back to the initial when the avatar fails (edge case)", () => {
    render(<TestimonialCard testimonial={felipe} />);
    fireEvent.error(screen.getByRole("img", { name: "Felipe Sasaki" }));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
  });
});
