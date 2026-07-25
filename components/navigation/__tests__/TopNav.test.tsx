import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopNav } from "../TopNav";
import { SECTION_IDS } from "@/lib/constants";

describe("<TopNav />", () => {
  it("should render the logo and nav links, excluding Home", () => {
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    expect(screen.getByRole("button", { name: "Ir para o início" })).toBeInTheDocument();
    expect(screen.getAllByText("Sobre").length).toBeGreaterThan(0);
    expect(screen.queryByText("Início")).not.toBeInTheDocument();
  });

  it("should call onNavigate with HOME when the logo is clicked", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);
    await user.click(screen.getByRole("button", { name: "Ir para o início" }));

    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.HOME);
  });

  it("should call onNavigate with the section id when a nav link is clicked", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);
    await user.click(screen.getAllByText("Projetos")[0]);

    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.PROJECTS);
  });

  it("should call onNavigate with CONTACT when 'Fale Comigo' is clicked", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);
    await user.click(screen.getAllByRole("button", { name: "Fale Comigo" })[0]);

    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.CONTACT);
  });

  it("should toggle the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    expect(screen.getAllByText("Sobre")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(screen.getAllByText("Sobre")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Fechar menu" }));
    expect(screen.getAllByText("Sobre")).toHaveLength(1);
  });

  it("should close the mobile menu after navigating", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    const mobileLinks = screen.getAllByText("Sobre");
    await user.click(mobileLinks[mobileLinks.length - 1]);

    expect(screen.getAllByText("Sobre")).toHaveLength(1);
  });
});
