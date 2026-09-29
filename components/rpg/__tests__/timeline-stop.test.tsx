import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimelineStop } from "../timeline-stop";

describe("<TimelineStop />", () => {
  const baseProps = {
    period: "2022 - Atual",
    role: "Desenvolvedor Fullstack",
    company: "Gazin Tech",
    description: "Integrações com Serasa, SPC e Unico.",
    technologies: ["React", "Node.js"],
    bossPhrase: "Integrou Serasa, SPC e Unico",
  };

  it("renders period, role, company, description, mapping technologies through Badge", () => {
    render(<TimelineStop {...baseProps} />);
    expect(screen.getByText("2022 - Atual")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Desenvolvedor Fullstack" })).toBeInTheDocument();
    expect(screen.getByText("Gazin Tech")).toBeInTheDocument();
    expect(screen.getByText("Integrações com Serasa, SPC e Unico.")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("renders the bossPhrase inside a distinct boss-defeated callout element", () => {
    render(<TimelineStop {...baseProps} />);
    const callout = screen.getByTestId("boss-defeated");
    expect(callout).toHaveTextContent("Integrou Serasa, SPC e Unico");
  });

  it("renders correctly when technologies is an empty array (no broken badge row)", () => {
    render(<TimelineStop {...baseProps} technologies={[]} />);
    expect(screen.getByRole("heading", { name: "Desenvolvedor Fullstack" })).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });
});
