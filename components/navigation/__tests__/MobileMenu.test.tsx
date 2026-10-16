import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "../MobileMenu";
import { SECTION_IDS } from "@/lib/constants";

const links = [
  { id: SECTION_IDS.ABOUT, label: "Sobre" },
  { id: SECTION_IDS.CONTACT, label: "Contato" },
];

describe("<MobileMenu />", () => {
  it("renders a modal dialog with the section links and moves focus to 'Fechar'", () => {
    render(<MobileMenu links={links} activeSection={SECTION_IDS.ABOUT} onNavigate={() => {}} onClose={() => {}} />);

    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveFocus();
  });

  it("calls onClose on Escape (NAV-04)", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<MobileMenu links={links} activeSection="" onNavigate={() => {}} onClose={onClose} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("navigates to contact from the 'Fale comigo' CTA", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<MobileMenu links={links} activeSection="" onNavigate={onNavigate} onClose={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Fale comigo" }));
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.CONTACT);
  });
});
