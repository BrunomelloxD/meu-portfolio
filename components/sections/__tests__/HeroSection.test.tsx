import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeroSection } from "../HeroSection";
import { SECTION_IDS, SOCIAL_LINKS } from "@/lib/constants";

const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");
const heroSource = readFileSync(resolve(process.cwd(), "components/sections/HeroSection.tsx"), "utf8");

/** Body of the first `selector { ... }` block found after `from` (handles nested braces). */
function block(source: string, selector: string, from = 0): string {
  const start = source.indexOf(selector, from);
  if (start === -1) throw new Error(`${selector} not found`);
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}" && --depth === 0) return source.slice(open + 1, i);
  }
  throw new Error(`${selector} is not closed`);
}

describe("<HeroSection />", () => {
  it("renders the role as the h1, with the name for screen readers (HERO-01)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Engenheiro");
    expect(h1).toHaveTextContent("Full Stack");
    expect(h1).toHaveTextContent("Bruno Mello");
  });

  it("aligns line one left and line two right from lg up, both left on phones (HERO-01, HERO-06)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    const line2 = screen.getByText("Full Stack");
    expect(line2.closest("[data-line]")).toHaveClass("lg:self-end");
    expect(screen.getByText("Engenheiro").closest("[data-line]")).not.toHaveClass("lg:self-end");
  });

  it("shows the supporting sentence (HERO-03)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    expect(
      screen.getByText((_, el) =>
        el?.tagName === "P" &&
        el.textContent === "Crio experiências digitais robustas com código limpo, arquitetura sólida e atenção aos detalhes.",
      ),
    ).toBeInTheDocument();
  });

  it("scrolls to projects from 'Ver projetos' (HERO-04)", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<HeroSection onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "Ver projetos" }));
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.PROJECTS);
  });

  it("links GitHub, LinkedIn and Email from SOCIAL_LINKS (HERO-05)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", SOCIAL_LINKS.github);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", SOCIAL_LINKS.linkedin);
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", `mailto:${SOCIAL_LINKS.email}`);
  });

  it("wraps each display line in its own mask for the reveal (MOT-01)", () => {
    render(<HeroSection onNavigate={() => {}} />);
    for (const text of ["Engenheiro", "Full Stack"]) {
      expect(screen.getByText(text).closest("[data-line]")).toHaveClass("overflow-hidden");
      expect(screen.getByText(text)).toHaveClass("animate-mask-up");
    }
    expect(screen.getByText("Engenheiro")).toHaveStyle({ animationDelay: "0ms" });
    expect(screen.getByText("Full Stack")).toHaveStyle({ animationDelay: "110ms" });
  });

  it("no longer renders the Erdtree background image", () => {
    const { container } = render(<HeroSection onNavigate={() => {}} />);
    expect(container.querySelector('img[src="/images/hero-erdtree.jpg"]')).toBeNull();
  });

  describe("entrance (MOV-06..MOV-09)", () => {
    it("does not use Motion: the entrance is CSS only (MOV-06)", () => {
      expect(heroSource).not.toMatch(/motion\/react|framer-motion/);
    });

    it("rises the h1 lines with transform only, 0ms then 110ms (MOV-07)", () => {
      render(<HeroSection onNavigate={() => {}} />);
      const lines = ["Engenheiro", "Full Stack"].map((text) => screen.getByText(text));
      expect(lines.map((line) => line.style.animationDelay)).toEqual(["0ms", "110ms"]);
      for (const line of lines) {
        expect(line).toHaveClass("animate-mask-up");
        expect(line.style.opacity).toBe("");
      }
      const keyframes = block(css, "@keyframes mask-up");
      expect(keyframes).toMatch(/transform:\s*translateY\(100%\)/);
      expect(keyframes).toMatch(/transform:\s*translateY\(0\)/);
      expect(keyframes).not.toMatch(/opacity/);
    });

    it("orders subtitle, CTA and chips with --i 0, 1 and 2 (MOV-08)", () => {
      render(<HeroSection onNavigate={() => {}} />);
      const subtitle = screen.getByText((_, el) => el?.tagName === "P" && !!el.textContent?.startsWith("Crio experiências"));
      const cta = screen.getByRole("button", { name: "Ver projetos" }).closest(".animate-fade-up") as HTMLElement;
      const chips = screen.getByRole("link", { name: "GitHub" }).closest(".animate-fade-up") as HTMLElement;

      const items = [subtitle, cta, chips];
      for (const item of items) expect(item).toHaveClass("animate-fade-up");
      expect(new Set(items).size).toBe(3);
      expect(items.map((item) => item.style.getPropertyValue("--i"))).toEqual(["0", "1", "2"]);
      for (const name of ["LinkedIn", "Email"]) expect(chips).toContainElement(screen.getByRole("link", { name }));
    });

    it("delays fade-up by 350ms plus 80ms per --i, so 350/430/510ms (MOV-08)", () => {
      const rule = block(css, ".animate-fade-up {");
      expect(rule).toMatch(/animation-delay:\s*calc\(350ms \+ var\(--i, 0\) \* 80ms\)/);
      // The shorthand must not carry its own delay, or it would compete with animation-delay.
      expect(rule).not.toMatch(/animation:[^;]*\d+ms/);
    });

    it("turns both entrance animations off under prefers-reduced-motion (MOV-09)", () => {
      const reduced = block(css, "@media (prefers-reduced-motion: reduce)", css.indexOf("@keyframes mask-up"));
      const rule = reduced.match(/([^{}]+)\{([^}]*)\}/);
      expect(rule).not.toBeNull();
      const selectors = rule![1].split(",").map((sel) => sel.trim());
      expect(selectors).toEqual(expect.arrayContaining([".animate-mask-up", ".animate-fade-up"]));
      expect(rule![2]).toMatch(/animation:\s*none/);
    });
  });
});
