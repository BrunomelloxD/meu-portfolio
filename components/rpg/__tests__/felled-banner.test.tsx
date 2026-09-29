import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FelledBanner } from "../felled-banner";

describe("<FelledBanner />", () => {
  it("renders the title and subtitle text as passed inside the gold-gradient band", () => {
    render(
      <FelledBanner
        title="Integrações críticas em produção"
        subtitle="Serasa, SPC e Unico integrados com sucesso"
      />,
    );
    expect(screen.getByText("Integrações críticas em produção")).toBeInTheDocument();
    expect(screen.getByText("Serasa, SPC e Unico integrados com sucesso")).toBeInTheDocument();
  });
});
