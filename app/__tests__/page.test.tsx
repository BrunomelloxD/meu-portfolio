import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

vi.mock("@emailjs/browser", () => ({ __esModule: true, default: { send: vi.fn() }, send: vi.fn() }));

import Home from "../page";

describe("Home page", () => {
  it("renders the sections in the redesigned order", () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll("main section[id]")).map((s) => s.id);
    expect(ids).toEqual(["home", "projetos", "sobre", "experiencia", "depoimentos", "contato"]);
  });

  it("renders immediately, without the client-only loading spinner", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeNull();
  });

  it("gives the skip link a target and a projects heading", () => {
    const { container } = render(<Home />);
    expect(container.querySelector("main#conteudo")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Projetos" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Projetos" })).toBeInTheDocument();
  });

  it("keeps the 'habilidades' anchor for the navigation", () => {
    const { container } = render(<Home />);
    expect(container.querySelector("#habilidades")).not.toBeNull();
  });

  it("drops the RPG copy (success criterion)", () => {
    const { container } = render(<Home />);
    for (const word of ["Relíquias", "Sítio da Graça", "Chefe derrotado", "Crônicas"]) {
      expect(container.textContent).not.toContain(word);
    }
  });

  it("decodes the title of Projetos, Sobre, Experiência, Depoimentos and Contato, never the h1 (SIG-48)", () => {
    const { container } = render(<Home />);
    for (const [id, name] of [
      ["projetos", "Projetos"],
      ["sobre", "Sobre"],
      ["experiencia", "Experiência"],
      ["depoimentos", "Depoimentos"],
      ["contato", "Contato"],
    ]) {
      const section = container.querySelector(`main section#${id}`)!;
      const heading = within(section as HTMLElement).getByRole("heading", { level: 2, name });
      expect(heading.querySelector("[data-scramble] .sr-only")).toHaveTextContent(name);
    }
    expect(screen.getByRole("heading", { level: 1 }).querySelector("[data-scramble]")).toBeNull();
  });

  it("has no statement band, and keeps the Serasa/SPC/Unico integration in the work history (SIG-128)", () => {
    const { container } = render(<Home />);
    expect(screen.queryByText(/Integrações críticas em produção/)).toBeNull();
    expect(screen.queryByRole("button", { name: /Pausar faixa|Retomar faixa/ })).toBeNull();
    expect(container.querySelector("[data-track]")).toBeNull();
    // The integration is one click away: the Gazin Tech (Júnior III) row lists it when expanded.
    const work = container.querySelector("section#experiencia") as HTMLElement;
    const row = within(work).getAllByRole("button", { expanded: false }).find((b) => /Júnior III/.test(b.textContent!))!;
    fireEvent.click(row);
    expect(within(work).getByText("Integração do fluxo de cadastro de clientes a três bureaus externos de crédito: Serasa, SPC e Unico.")).toBeInTheDocument();
  });
});
