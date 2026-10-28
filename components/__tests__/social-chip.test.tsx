import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
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

  it("lifts 2px on hover and scales to 0.97 when pressed, with the press spring (MOV-18, MOV-19)", () => {
    render(<SocialChip href="https://github.com/BrunomelloxD" label="GitHub" />);
    const motionProps = JSON.parse(screen.getByRole("link", { name: "GitHub" }).getAttribute("data-motion")!);
    expect(motionProps.whileHover).toEqual({ y: -2 });
    expect(motionProps.whileTap).toEqual({ scale: 0.97 });
    expect(motionProps.transition).toEqual({ type: "spring", stiffness: 500, damping: 45, mass: 1 });
  });

  it("keeps the focus ring out of any transition list (MOV-20)", () => {
    render(<SocialChip href="https://github.com/BrunomelloxD" label="GitHub" />);
    const classes = Array.from(screen.getByRole("link", { name: "GitHub" }).classList);
    expect(classes).not.toContain("transition");
    expect(classes).not.toContain("transition-all");
    for (const cls of classes.filter((c) => c.startsWith("transition-["))) {
      expect(cls).not.toMatch(/box-shadow/);
    }
  });
});

describe("<SocialChip /> email copy (CONT-06..CONT-08)", () => {
  const writeText = vi.fn();
  const setClipboard = (value: unknown) => Object.defineProperty(navigator, "clipboard", { configurable: true, value });
  const status = () => screen.getByRole("status");

  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset().mockResolvedValue(undefined);
    setClipboard({ writeText });
  });
  afterEach(() => {
    vi.useRealTimers();
    setClipboard(undefined);
  });

  it("copies the address and still lets the mailto open (CONT-06)", async () => {
    render(<SocialChip href="mailto:brunomello.ti@gmail.com" label="Email" />);
    const notCancelled = fireEvent.click(screen.getByRole("link", { name: "Email" }));
    expect(notCancelled).toBe(true);
    expect(writeText).toHaveBeenCalledWith("brunomello.ti@gmail.com");
  });

  it("announces 'Email copiado' for 2s, shows 'Copiado ✓' and keeps the link named 'Email' (CONT-07)", async () => {
    render(<SocialChip href="mailto:brunomello.ti@gmail.com" label="Email" />);
    expect(status()).toHaveTextContent("");
    fireEvent.click(screen.getByRole("link", { name: "Email" }));
    await act(async () => {});
    expect(status()).toHaveTextContent("Email copiado");
    expect(screen.getByText("Copiado")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("✓")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email" })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1999));
    expect(status()).toHaveTextContent("Email copiado");
    act(() => vi.advanceTimersByTime(1));
    expect(status()).toHaveTextContent("");
    expect(screen.getByText("↗")).toBeInTheDocument();
  });

  it("says nothing when the copy fails or there is no clipboard (CONT-08)", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    const { unmount } = render(<SocialChip href="mailto:brunomello.ti@gmail.com" label="Email" />);
    expect(fireEvent.click(screen.getByRole("link", { name: "Email" }))).toBe(true);
    await act(async () => {});
    expect(status()).toHaveTextContent("");
    unmount();

    setClipboard(undefined);
    render(<SocialChip href="mailto:brunomello.ti@gmail.com" label="Email" />);
    expect(fireEvent.click(screen.getByRole("link", { name: "Email" }))).toBe(true);
    await act(async () => {});
    expect(status()).toHaveTextContent("");
  });

  it("leaves other links alone: no copy, no status region", () => {
    render(<SocialChip href="https://github.com/BrunomelloxD" label="GitHub" />);
    fireEvent.click(screen.getByRole("link", { name: "GitHub" }));
    expect(writeText).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
