import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { useReducedMotion, useSpring } from "motion/react";
import { ReadingProgress } from "../reading-progress";

const renderBar = () => {
  const { container } = render(<ReadingProgress />);
  return container.firstElementChild as HTMLElement;
};
const motionOf = (el: HTMLElement) => JSON.parse(el.dataset.motion ?? "{}");

describe("<ReadingProgress />", () => {
  it("drives scaleX with useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 }) (MOV-37)", () => {
    const bar = renderBar();

    expect(useSpring).toHaveBeenCalledWith(
      { __mv: "scrollYProgress" },
      expect.objectContaining({ stiffness: 100, damping: 30, restDelta: 0.001 }),
    );
    const { style } = motionOf(bar);
    expect(style.scaleX).toMatchObject({
      __mv: "spring",
      source: { __mv: "scrollYProgress" },
      options: { stiffness: 100, damping: 30, restDelta: 0.001 },
    });
  });

  it("grows from the left edge (MOV-37)", () => {
    expect(motionOf(renderBar()).style.originX).toBe(0);
  });

  it("uses scrollYProgress directly under reduced motion (MOV-38)", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    expect(motionOf(renderBar()).style.scaleX).toEqual({ __mv: "scrollYProgress" });
  });

  it("is a decorative 3px bar that never takes pointer events (MOV-39)", () => {
    const bar = renderBar();
    expect(bar).toHaveAttribute("aria-hidden", "true");
    expect(bar).toHaveClass("h-[3px]", "pointer-events-none", "absolute", "bottom-0", "inset-x-0", "bg-accent");
  });
});
