import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrnamentDivider } from "../ornament-divider";

describe("<OrnamentDivider />", () => {
  it("renders without throwing", () => {
    expect(() => render(<OrnamentDivider />)).not.toThrow();
  });

  it("exposes a stable role hook for later consumers to assert presence", () => {
    render(<OrnamentDivider />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("exposes a stable data-testid hook for later consumers to assert presence", () => {
    render(<OrnamentDivider />);
    expect(screen.getByTestId("ornament-divider")).toBeInTheDocument();
  });

  it("merges an optional className", () => {
    render(<OrnamentDivider className="my-8" />);
    expect(screen.getByRole("separator")).toHaveClass("my-8");
  });
});
