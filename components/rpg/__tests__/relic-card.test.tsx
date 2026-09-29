import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Swords, Github, ArrowRight } from "lucide-react";
import { RelicCard } from "../relic-card";

describe("<RelicCard />", () => {
  const baseProps = {
    icon: Swords,
    title: "TypeRacer",
    description: "Aplicação fullstack de corrida de digitação em tempo real.",
    tags: ["React", "TypeScript"],
    links: [
      { label: "Frontend", href: "https://example.com/front", icon: Github },
      { label: "Ver projeto", href: "https://example.com/demo", icon: ArrowRight },
    ],
  };

  it("renders the icon, Cinzel title, tag row, description, and link row from full props", () => {
    render(<RelicCard {...baseProps} />);
    expect(screen.getByRole("heading", { name: "TypeRacer" })).toBeInTheDocument();
    expect(screen.getByText("Aplicação fullstack de corrida de digitação em tempo real.")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Frontend/ })).toHaveAttribute("href", "https://example.com/front");
    expect(screen.getByRole("link", { name: /Ver projeto/ })).toHaveAttribute("href", "https://example.com/demo");
  });

  it("renders no rarity badge (intentionally omitted, per design.md Tech Decisions)", () => {
    render(<RelicCard {...baseProps} />);
    expect(screen.queryByText(/LENDÁRIA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/RARA/i)).not.toBeInTheDocument();
  });

  it("renders correctly with an empty tags array (no broken tag row)", () => {
    render(<RelicCard {...baseProps} tags={[]} />);
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "TypeRacer" })).toBeInTheDocument();
  });

  it("renders correctly with an empty links array (no broken link row)", () => {
    render(<RelicCard {...baseProps} links={[]} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByRole("heading", { name: "TypeRacer" })).toBeInTheDocument();
  });
});
