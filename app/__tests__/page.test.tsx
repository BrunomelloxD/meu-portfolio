import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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
});
