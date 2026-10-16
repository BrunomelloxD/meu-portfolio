import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("<Badge />", () => {
  it("renders the outline variant as a 13px mono pill (WORK-03)", () => {
    render(<Badge variant="outline">TypeScript</Badge>);
    expect(screen.getByText("TypeScript")).toHaveClass("font-mono", "text-[13px]", "rounded-full", "border-line-strong", "text-ink-soft");
  });

  it("renders the inverse variant for inverted rows", () => {
    render(<Badge variant="inverse">NestJS</Badge>);
    expect(screen.getByText("NestJS")).toHaveClass("font-mono", "border-inverse-line", "text-inverse-ink");
  });
});
