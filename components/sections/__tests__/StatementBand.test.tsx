import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatementBand } from "../StatementBand";

describe("<StatementBand />", () => {
  it("shows the Gazin highlight on a flat surface band, without gradient (A-06)", () => {
    const { container } = render(<StatementBand />);
    expect(screen.getByText("Integrações críticas em produção")).toHaveClass("font-mono");
    expect(screen.getByText("Cadastro de clientes integrado a Serasa, SPC e Unico — Gazin Tech")).toBeInTheDocument();
    const band = container.firstElementChild!.firstElementChild!;
    expect(band).toHaveClass("bg-surface");
    expect(container.innerHTML).not.toMatch(/gradient/);
  });
});
