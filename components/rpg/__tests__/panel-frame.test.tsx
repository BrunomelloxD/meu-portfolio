import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PanelFrame } from "../panel-frame";

describe("<PanelFrame />", () => {
  it("renders its children unmodified", () => {
    render(
      <PanelFrame>
        <p>Conteúdo do painel</p>
      </PanelFrame>,
    );
    expect(screen.getByText("Conteúdo do painel")).toBeInTheDocument();
  });

  it("renders with the er-surface background and er-line border when no className is given", () => {
    render(
      <PanelFrame>
        <p>Conteúdo</p>
      </PanelFrame>,
    );
    const panel = screen.getByText("Conteúdo").parentElement;
    expect(panel).toHaveClass("bg-er-surface");
    expect(panel).toHaveClass("border-er-line");
  });

  it("merges an optional className while keeping the base classes", () => {
    render(
      <PanelFrame className="mt-4">
        <p>Conteúdo</p>
      </PanelFrame>,
    );
    const panel = screen.getByText("Conteúdo").parentElement;
    expect(panel).toHaveClass("mt-4");
    expect(panel).toHaveClass("bg-er-surface");
  });
});
