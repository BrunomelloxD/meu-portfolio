import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkRow } from "../work-row";
import { experiences } from "@/lib/content";

const [und, gazinJr3] = experiences;

describe("<WorkRow />", () => {
  it("shows period, company and role with the stack summary", () => {
    render(<WorkRow experience={gazinJr3} />);
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveTextContent("10/2025 — 05/2026");
    expect(toggle).toHaveTextContent("Gazin Tech");
    expect(toggle).toHaveTextContent("Desenvolvedor Júnior III");
    expect(toggle).toHaveTextContent("Angular & NestJS");
  });

  it("marks 'Presente' with the accent colour (WORK-02)", () => {
    render(<WorkRow experience={und} />);
    expect(screen.getByText("Presente")).toHaveClass("text-accent");
  });

  it("uses tabular figures for the period", () => {
    render(<WorkRow experience={und} />);
    expect(screen.getByText("Presente").parentElement).toHaveClass("tabular-nums");
  });

  it("starts collapsed and expands highlights and technologies on activation (WORK-03)", async () => {
    const user = userEvent.setup();
    render(<WorkRow experience={gazinJr3} />);
    const toggle = screen.getByRole("button");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(gazinJr3.highlights[0])).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region");
    expect(toggle).toHaveAttribute("aria-controls", panel.id);
    const [highlights, technologies] = within(panel).getAllByRole("list");
    expect(within(highlights).getAllByRole("listitem").map((li) => li.textContent)).toEqual(gazinJr3.highlights);
    expect(within(technologies).getAllByRole("listitem").map((li) => li.textContent)).toEqual(gazinJr3.technologies);
  });

  it("inverts the row colours on hover, focus and while expanded (WORK-04)", () => {
    const { container } = render(<WorkRow experience={gazinJr3} />);
    expect(container.firstElementChild).toHaveClass(
      "hover:bg-inverse",
      "has-[:focus-visible]:bg-inverse",
      "data-[expanded=true]:bg-inverse",
    );
  });
});
