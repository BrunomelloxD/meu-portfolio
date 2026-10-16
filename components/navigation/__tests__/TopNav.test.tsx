import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopNav } from "../TopNav";
import { SECTION_IDS } from "@/lib/constants";

const desktopNav = () => screen.getByRole("navigation", { name: "Principal" });

describe("<TopNav />", () => {
  it("lists exactly Sobre, Experiência, Projetos, Habilidades, Contato (NAV-01)", () => {
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);
    const labels = within(desktopNav()).getAllByRole("link").map((l) => l.textContent);
    expect(labels).toEqual(["Sobre", "Experiência", "Projetos", "Habilidades", "Contato"]);
  });

  it("marks the active section link with aria-current (NAV-02)", () => {
    render(<TopNav activeSection={SECTION_IDS.PROJECTS} onNavigate={() => {}} />);
    expect(within(desktopNav()).getByRole("link", { name: "Projetos" })).toHaveAttribute("aria-current", "true");
    expect(within(desktopNav()).getByRole("link", { name: "Sobre" })).not.toHaveAttribute("aria-current");
    const indicator = within(desktopNav()).getByRole("link", { name: "Projetos" }).querySelector('[aria-hidden="true"]');
    expect(indicator).toHaveClass("bg-accent", "opacity-0", "group-aria-[current=true]:opacity-100");
  });

  it("renders the two-line wordmark that navigates home", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);

    const logo = screen.getByRole("button", { name: "Ir para o início" });
    expect(logo).toHaveTextContent("BrunoMello");
    await user.click(logo);
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.HOME);
  });

  it("navigates to the section of the clicked link", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);

    await user.click(within(desktopNav()).getByRole("link", { name: "Projetos" }));
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.PROJECTS);
  });

  it("navigates to contact from the 'Fale comigo' pill", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "Fale comigo" }));
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.CONTACT);
  });

  it("offers 'Pular para o conteúdo' as the first focusable element (NAV-05)", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    await user.tab();
    const skip = screen.getByRole("link", { name: "Pular para o conteúdo" });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute("href", "#conteudo");
  });

  it("shows a 'Menu' button with aria-expanded for the mobile layout (NAV-03)", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    const menu = screen.getByRole("button", { name: "Menu" });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveClass("md:hidden");

    await user.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  });

  it("closes the menu on Escape and returns focus to the 'Menu' button (NAV-04)", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
  });

  it("closes the menu after navigating from it", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Experiência" }));

    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.EXPERIENCE);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
