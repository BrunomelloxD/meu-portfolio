import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnimatePresence } from "motion/react";
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

  describe("panel presence (MOV-28, MOV-29)", () => {
    beforeEach(() => {
      vi.mocked(AnimatePresence).mockClear();
    });

    const openPanel = async () => {
      const user = userEvent.setup();
      render(<WorkRow experience={gazinJr3} />);
      await user.click(screen.getByRole("button"));
      const panel = screen.getByRole("region");
      return { panel, motion: JSON.parse(panel.getAttribute("data-motion") ?? "{}") };
    };

    it("wraps the panel in AnimatePresence without an initial animation", () => {
      render(<WorkRow experience={gazinJr3} />);
      expect(vi.mocked(AnimatePresence)).toHaveBeenCalled();
      expect(vi.mocked(AnimatePresence).mock.calls.at(-1)?.[0]).toMatchObject({ initial: false });
    });

    it("enters with opacity 0 → 1 and y 8 → 0 over 0.32s ease-out (MOV-28)", async () => {
      const { motion } = await openPanel();
      expect(motion.initial).toEqual({ opacity: 0, y: 8 });
      expect(motion.animate).toMatchObject({ opacity: 1, y: 0 });
      expect(motion.animate.transition).toMatchObject({ duration: 0.32, ease: [0.32, 0.72, 0, 1] });
    });

    it("exits with opacity 0 over 0.18s and never animates layout or height (MOV-29)", async () => {
      const { motion } = await openPanel();
      expect(motion.exit).toMatchObject({ opacity: 0, transition: { duration: 0.18 } });
      expect(motion).not.toHaveProperty("layout");
      for (const state of [motion.initial, motion.animate, motion.exit]) {
        expect(state).not.toHaveProperty("height");
      }
    });

    it("keeps the panel accessible: id, region role and label wired to the toggle", async () => {
      const { panel } = await openPanel();
      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      expect(toggle).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-label", `${gazinJr3.company}, ${gazinJr3.role}`);
    });
  });

  it("shows the focus ring without transitioning box-shadow (MOV-20)", () => {
    const { container } = render(<WorkRow experience={gazinJr3} />);
    const elements = [container.firstElementChild!, ...container.querySelectorAll("*")];
    for (const el of elements) {
      const classes = Array.from(el.classList);
      expect(classes).not.toContain("transition");
      expect(classes).not.toContain("transition-all");
      expect(classes.filter((c) => c.startsWith("transition-[") && c.includes("box-shadow"))).toEqual([]);
    }
    expect(container.firstElementChild).toHaveClass("transition-colors");
  });
});
