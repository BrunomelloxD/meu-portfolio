import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "../theme-provider";

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="next-themes" data-attribute={String(props.attribute ?? "")}>
      {children}
    </div>
  ),
}));

describe("<ThemeProvider />", () => {
  it("should render children", () => {
    render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("should forward props to next-themes provider", () => {
    render(
      <ThemeProvider attribute="class">
        <span>x</span>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("next-themes")).toHaveAttribute("data-attribute", "class");
  });
});
