import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AttributeBar } from "../attribute-bar";

describe("<AttributeBar />", () => {
  it("renders the name, description, and numeric value", () => {
    render(<AttributeBar name="Vigor" description="Anos de experiência" value={40} />);
    expect(screen.getByText("Vigor")).toBeInTheDocument();
    expect(screen.getByText("Anos de experiência")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("defaults max to 100 when omitted, so the bar width is value/100 * 100%", () => {
    render(<AttributeBar name="Vigor" description="desc" value={40} />);
    expect(screen.getByTestId("attribute-bar-fill")).toHaveStyle({ width: "40%" });
  });

  it("computes the bar width against an explicit max", () => {
    render(<AttributeBar name="Vigor" description="desc" value={5} max={10} />);
    expect(screen.getByTestId("attribute-bar-fill")).toHaveStyle({ width: "50%" });
  });

  it("renders a value of 0 at 0% width instead of a negative or broken bar", () => {
    render(<AttributeBar name="Vigor" description="desc" value={0} />);
    expect(screen.getByTestId("attribute-bar-fill")).toHaveStyle({ width: "0%" });
  });
});
