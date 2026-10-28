import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CtaButton } from "../cta-button";

describe("<CtaButton />", () => {
  it("renders one button named by its label, with the arrow circle hidden from assistive tech", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<CtaButton onClick={onClick}>Ver projetos</CtaButton>);

    await user.click(screen.getByRole("button", { name: "Ver projetos" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("→");
  });

  it("renders an external link in a new tab when given an href", () => {
    render(<CtaButton href="https://typeracer-front-production.up.railway.app/">Ver projeto</CtaButton>);
    const link = screen.getByRole("link", { name: "Ver projeto" });
    expect(link).toHaveAttribute("href", "https://typeracer-front-production.up.railway.app/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("supports submit buttons", () => {
    render(<CtaButton type="submit">Enviar mensagem</CtaButton>);
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toHaveAttribute("type", "submit");
  });

  const press = { type: "spring", stiffness: 500, damping: 45, mass: 1 };
  const motionOf = (el: Element) => JSON.parse(el.getAttribute("data-motion")!);

  it("lifts 2px on hover and nudges the arrow 4px with the press spring (MOV-16)", () => {
    const { container } = render(<CtaButton>Ver projetos</CtaButton>);
    const button = motionOf(screen.getByRole("button", { name: "Ver projetos" }));
    expect(button.whileHover).toBe("hover");
    expect(button.variants.hover).toEqual({ y: -2 });
    expect(button.transition).toEqual(press);
    const arrow = motionOf(container.querySelector('[aria-hidden="true"]')!);
    expect(arrow.variants.hover).toEqual({ x: 4 });
  });

  it("scales to 0.98 when pressed, as a button and as a link (MOV-17)", () => {
    render(
      <>
        <CtaButton>Botão</CtaButton>
        <CtaButton href="https://example.com/">Link</CtaButton>
      </>,
    );
    expect(motionOf(screen.getByRole("button", { name: "Botão" })).whileTap).toEqual({ scale: 0.98 });
    const link = motionOf(screen.getByRole("link", { name: "Link" }));
    expect(link.whileTap).toEqual({ scale: 0.98 });
    expect(link.whileHover).toBe("hover");
    expect(link.transition).toEqual(press);
  });

  it("defines no hover or press motion when disabled (MOV-21)", () => {
    render(<CtaButton disabled>Enviando…</CtaButton>);
    const button = screen.getByRole("button", { name: "Enviando…" });
    expect(button).toBeDisabled();
    const motionProps = motionOf(button);
    expect(motionProps).not.toHaveProperty("whileHover");
    expect(motionProps).not.toHaveProperty("whileTap");
  });

  it("keeps the focus ring out of any transition list (MOV-20)", () => {
    const { container } = render(<CtaButton>Ver projetos</CtaButton>);
    const button = screen.getByRole("button", { name: "Ver projetos" });
    expect(button).toHaveClass("focus-visible:ring-2", "focus-visible:ring-accent");
    for (const el of [button, ...Array.from(container.querySelectorAll("*"))]) {
      const classes = Array.from(el.classList);
      expect(classes).not.toContain("transition");
      expect(classes).not.toContain("transition-all");
      for (const cls of classes.filter((c) => c.startsWith("transition-["))) {
        expect(cls).not.toMatch(/box-shadow/);
      }
    }
  });
});

