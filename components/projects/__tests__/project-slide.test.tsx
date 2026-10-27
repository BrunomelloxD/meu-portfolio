import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectSlide } from "../project-slide";
import { projects } from "@/lib/content";

const [, typeracer] = projects;

describe("<ProjectSlide />", () => {
  it("shows title, description, tags, screenshot and the demo link (PROJ-01)", () => {
    render(<ProjectSlide project={typeracer} />);

    expect(screen.getByRole("heading", { level: 3, name: "TypeRacer" })).toBeInTheDocument();
    expect(screen.getByText(typeracer.description)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(typeracer.tags);
    expect(screen.getByRole("img", { name: "Tela do projeto TypeRacer" })).toHaveAttribute("src", "/images/projects/typeracer.png");
    expect(screen.getByRole("link", { name: "Ver projeto" })).toHaveAttribute("href", typeracer.demo);
  });

  it("links each repository as 'Código: Frontend' / 'Código: API' (PROJ-02)", () => {
    render(<ProjectSlide project={typeracer} />);
    expect(screen.getByRole("link", { name: "Código: Frontend" })).toHaveAttribute("href", typeracer.repos[0].url);
    expect(screen.getByRole("link", { name: "Código: API" })).toHaveAttribute("href", typeracer.repos[1].url);
  });

  it("omits code links when the project has no repositories (PROJ-02)", () => {
    render(<ProjectSlide project={{ ...typeracer, repos: [] }} />);
    expect(screen.queryByRole("link", { name: /^Código/ })).not.toBeInTheDocument();
  });

  it("gives code links a 44px touch target", () => {
    render(<ProjectSlide project={typeracer} />);
    expect(screen.getByRole("link", { name: "Código: API" })).toHaveClass("min-h-[44px]");
  });

  it("replaces a broken screenshot with the project title on surface-2 (edge case)", () => {
    render(<ProjectSlide project={typeracer} />);
    fireEvent.error(screen.getByRole("img", { name: "Tela do projeto TypeRacer" }));

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const fallback = screen.getByTestId("image-fallback");
    expect(fallback).toHaveTextContent("TypeRacer");
    expect(fallback).toHaveClass("bg-surface-2");
  });
});
