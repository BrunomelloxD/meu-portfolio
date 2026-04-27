import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

import { SideNavigation } from "../SideNavigation";
import { NAVIGATION_ITEMS, PERSONAL_INFO } from "@/lib/constants";

describe("<SideNavigation />", () => {
  it("should render personal name and all navigation items", () => {
    render(<SideNavigation isMenuOpen activeSection="home" onNavigate={() => {}} />);
    expect(screen.getByText(PERSONAL_INFO.name)).toBeInTheDocument();
    NAVIGATION_ITEMS.forEach((item) => {
      expect(screen.getByRole("button", { name: item.label })).toBeInTheDocument();
    });
  });

  it("should call onNavigate with the section id when an item is clicked", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<SideNavigation isMenuOpen activeSection="home" onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: NAVIGATION_ITEMS[1].label }));

    expect(onNavigate).toHaveBeenCalledWith(NAVIGATION_ITEMS[1].id);
  });

  it("should mark the active section with primary classes", () => {
    render(<SideNavigation isMenuOpen activeSection="sobre" onNavigate={() => {}} />);
    const activeBtn = screen.getByRole("button", { name: "Sobre" });
    expect(activeBtn.className).toMatch(/bg-primary/);
  });
});
