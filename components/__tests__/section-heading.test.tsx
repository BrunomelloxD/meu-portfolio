import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "../section-heading";

describe("<SectionHeading />", () => {
  it("should render the command and title", () => {
    render(<SectionHeading command="ls skills/" title="Skills & Tecnologias" />);

    expect(screen.getByText("ls skills/")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skills & Tecnologias" })).toBeInTheDocument();
  });

  it("should render an ornament divider between the title and the description", () => {
    render(<SectionHeading command="ls skills/" title="Skills" />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("should render the description when provided", () => {
    render(<SectionHeading command="ls skills/" title="Skills" description="Ferramentas do dia a dia." />);
    expect(screen.getByText("Ferramentas do dia a dia.")).toBeInTheDocument();
  });

  it("should not render a description when omitted", () => {
    const { container } = render(<SectionHeading command="ls skills/" title="Skills" />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});
