import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@emailjs/browser", () => ({ __esModule: true, default: { send: vi.fn() }, send: vi.fn() }));

import ContactSection from "../contact-section";
import { SECTION_IDS } from "@/lib/constants";

describe("<ContactSection />", () => {
  it("is the 'contato' section labelled by its h2", () => {
    const { container } = render(<ContactSection />);
    expect(container.querySelector(`section#${SECTION_IDS.CONTACT}`)).toHaveAttribute("aria-labelledby", "contato-title");
    expect(screen.getByRole("heading", { level: 2, name: "Contato" })).toBeInTheDocument();
    expect(screen.getByText("Vamos construir algo juntos?")).toBeInTheDocument();
  });

  it("sets the email in display type as a mailto link (CONT-01)", () => {
    render(<ContactSection />);
    const email = screen.getByRole("link", { name: "brunomello.ti@gmail.com" });
    expect(email).toHaveAttribute("href", "mailto:brunomello.ti@gmail.com");
    expect(email).toHaveClass("font-mono", "font-bold");
  });

  it("shows phone as a tel link and the location (CONT-02)", () => {
    render(<ContactSection />);
    expect(screen.getByRole("link", { name: "+55 (19) 99711-9007" })).toHaveAttribute("href", "tel:+5519997119007");
    expect(screen.getByText("Mococa, SP / Maringá, PR, Brasil")).toBeInTheDocument();
  });

  it("includes the contact form", () => {
    render(<ContactSection />);
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toHaveAttribute("type", "submit");
  });
});
