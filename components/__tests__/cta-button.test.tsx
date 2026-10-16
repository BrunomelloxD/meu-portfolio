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
});
