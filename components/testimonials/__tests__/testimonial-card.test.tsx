import { describe, it, expect, vi } from "vitest";
import { AnimatePresence } from "motion/react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestimonialCard } from "../testimonial-card";
import { testimonials } from "@/lib/content";

const [lucas, , felipe] = testimonials;

const motionOf = (el: Element | null) => JSON.parse(el?.getAttribute("data-motion") ?? "null");
const laterParagraphs = (paragraphs: string[]) => paragraphs.slice(1).map((p) => screen.getByText(p));

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

  it("fades and slides paragraphs 2+ open after 'Ler tudo' (MOV-40)", async () => {
    const user = userEvent.setup();
    render(<TestimonialCard testimonial={lucas} />);
    expect(lucas.paragraphs.length).toBeGreaterThan(1);

    expect(motionOf(screen.getByText(lucas.paragraphs[0]))).toBeNull();
    for (const p of laterParagraphs(lucas.paragraphs)) {
      expect(motionOf(p)).toMatchObject({ initial: false, animate: "clamped" });
    }

    await user.click(screen.getByRole("button", { name: "Ler tudo" }));

    for (const p of laterParagraphs(lucas.paragraphs)) {
      const motion = motionOf(p);
      expect(motion.animate).toBe("open");
      expect(motion.variants.open).toEqual({
        opacity: 1,
        y: 0,
        transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] },
      });
    }

    await user.click(screen.getByRole("button", { name: "Mostrar menos" }));
    for (const p of laterParagraphs(lucas.paragraphs)) expect(motionOf(p).animate).toBe("clamped");
  });

  it("keeps paragraphs 'open' when the testimonial is short (MOV-40)", () => {
    render(<TestimonialCard testimonial={{ ...felipe, paragraphs: ["Curto.", "Também curto."] }} />);
    expect(motionOf(screen.getByText("Também curto.")).animate).toBe("open");
  });

  it("swaps the toggle label inside AnimatePresence mode wait with dur.instant (MOV-41)", async () => {
    const user = userEvent.setup();
    vi.mocked(AnimatePresence).mockClear();
    render(<TestimonialCard testimonial={lucas} />);

    const props = vi.mocked(AnimatePresence).mock.calls.at(-1)![0] as Record<string, unknown>;
    expect(props).toMatchObject({ mode: "wait", initial: false });

    const label = screen.getByText("Ler tudo");
    expect(motionOf(label)).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.12, ease: [0.32, 0.72, 0, 1] },
    });

    await user.click(screen.getByRole("button", { name: "Ler tudo" }));
    const button = screen.getByRole("button", { name: "Mostrar menos" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(motionOf(screen.getByText("Mostrar menos")).transition.duration).toBe(0.12);
  });

  it("rests at the CSS var opacity, which is 1 from md up (MOV-42)", () => {
    const { container } = render(<TestimonialCard testimonial={lucas} />);
    const [second] = laterParagraphs(lucas.paragraphs);
    expect(motionOf(second).variants.clamped).toEqual({
      opacity: "var(--tst-rest-opacity)",
      y: "var(--tst-rest-y)",
    });
    expect(container.querySelector("figure")).toHaveClass(
      "[--tst-rest-opacity:0]",
      "md:[--tst-rest-opacity:1]",
      "[--tst-rest-y:8px]",
      "md:[--tst-rest-y:0px]",
    );
  });
});
