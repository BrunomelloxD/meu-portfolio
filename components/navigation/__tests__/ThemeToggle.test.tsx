import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const setThemeMock = vi.fn();
const useThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => useThemeMock(),
}));

import { ThemeToggle } from "../ThemeToggle";

describe("<ThemeToggle />", () => {
  beforeEach(() => {
    setThemeMock.mockClear();
  });

  describe("desktop variant", () => {
    it("should toggle from dark to light when current theme is dark", async () => {
      useThemeMock.mockReturnValue({ theme: "dark", setTheme: setThemeMock });
      const user = userEvent.setup();

      render(<ThemeToggle />);
      await user.click(screen.getByRole("button", { name: "Mudar para tema claro" }));

      expect(setThemeMock).toHaveBeenCalledWith("light");
    });

    it("should toggle from light to dark when current theme is light", async () => {
      useThemeMock.mockReturnValue({ theme: "light", setTheme: setThemeMock });
      const user = userEvent.setup();

      render(<ThemeToggle />);
      await user.click(screen.getByRole("button", { name: "Mudar para tema escuro" }));

      expect(setThemeMock).toHaveBeenCalledWith("dark");
    });

    it("should render label when showLabel is true", () => {
      useThemeMock.mockReturnValue({ theme: "light", setTheme: setThemeMock });
      render(<ThemeToggle showLabel isMenuOpen />);
      expect(screen.getByText("Tema Escuro")).toBeInTheDocument();
    });
  });

  describe("mobile variant", () => {
    it("should render the mobile button with proper aria when in dark theme", () => {
      useThemeMock.mockReturnValue({ theme: "dark", setTheme: setThemeMock });
      render(<ThemeToggle isMobile />);
      expect(screen.getByRole("button", { name: "Mudar para tema claro" })).toBeInTheDocument();
    });

    it("should toggle theme on mobile click", async () => {
      useThemeMock.mockReturnValue({ theme: "light", setTheme: setThemeMock });
      const user = userEvent.setup();

      render(<ThemeToggle isMobile />);
      await user.click(screen.getByRole("button"));

      expect(setThemeMock).toHaveBeenCalledWith("dark");
    });
  });
});
