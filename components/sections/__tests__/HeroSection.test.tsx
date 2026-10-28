import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import userEvent from "@testing-library/user-event";
import { HeroSection } from "../HeroSection";
import { SECTION_IDS, SOCIAL_LINKS } from "@/lib/constants";
import { spring } from "@/lib/motion";

// next/dynamic stand-in: records the loader options and renders a probe with the props the field receives.
const dynamicCalls = vi.hoisted(() => [] as { loader: () => Promise<unknown>; options: unknown }[]);
vi.mock("next/dynamic", async () => {
  const React = await import("react");
  return {
    default: (loader: () => Promise<unknown>, options: unknown) => {
      dynamicCalls.push({ loader, options });
      return function FieldProbe(props: Record<string, unknown>) {
        return React.createElement("div", { "data-testid": "particle-field", "data-props": JSON.stringify(props) });
      };
    },
  };
});

/** Makes useTransform report what its mapping gives at p = 0, 0.5 and 1, so data-motion shows real values. */
function evaluateTransforms() {
  vi.mocked(useTransform).mockImplementation(((_: unknown, map: (p: number) => unknown) => ({
    __mv: "transform",
    at: [map(0), map(0.5), map(1)],
  })) as unknown as typeof useTransform);
}

function setDesktop(desktop: boolean) {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: query === "(min-width: 1024px)" ? desktop : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

const motionOf = (el: Element | null) => JSON.parse(el?.getAttribute("data-motion") ?? "null");
const fieldProps = () => JSON.parse(screen.getByTestId("particle-field").getAttribute("data-props")!);
const titleWrapper = () => screen.getByRole("heading", { level: 1 }).parentElement;

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
    // MOV-06 is revoked by AD-003 / SIG-36: the hero now uses Motion for the scroll, the entrance stays CSS.
    it("keeps the entrance in CSS: no Motion initial/animate on the h1 lines (SIG-36)", () => {
      expect(heroSource).not.toMatch(/framer-motion/);
      render(<HeroSection onNavigate={() => {}} />);
      for (const text of ["Engenheiro", "Full Stack"]) expect(screen.getByText(text)).not.toHaveAttribute("data-motion");
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

  describe("particle field (SIG-10)", () => {
    it("loads the field with next/dynamic and ssr: false", async () => {
      expect(dynamicCalls).toHaveLength(1);
      expect(dynamicCalls[0].options).toEqual({ ssr: false });
      const mod = (await dynamicCalls[0].loader()) as { default: unknown };
      const field = await import("@/components/hero/particle-field");
      expect(mod.default).toBe(field.default);
    });
  });

  describe("pin (SIG-30)", () => {
    it("is 170vh tall from lg up, with the content sticky under the 96px nav for 100dvh", () => {
      const { container } = render(<HeroSection onNavigate={() => {}} />);
      const section = container.querySelector("section")!;
      expect(section).toHaveClass("lg:motion-safe:h-[170vh]");
      const sticky = section.firstElementChild!;
      expect(sticky).toHaveClass("lg:motion-safe:sticky", "lg:motion-safe:top-24", "lg:motion-safe:h-[calc(100dvh-96px)]");
      expect(sticky).toContainElement(screen.getByRole("heading", { level: 1 }));
      expect(sticky).toContainElement(screen.getByTestId("particle-field"));
    });
  });

  describe("scroll while pinned (SIG-31..SIG-33)", () => {
    it("tracks the hero from its top to the end of the pin, smoothed by the scroll spring (SIG-31)", () => {
      setDesktop(true);
      render(<HeroSection onNavigate={() => {}} />);
      const options = vi.mocked(useScroll).mock.lastCall![0] as { target: { current: Element }; offset: string[] };
      expect(options.offset).toEqual(["start start", "end end"]);
      expect(options.target.current.tagName).toBe("SECTION");
      const scrollSpring = vi.mocked(useSpring).mock.calls.find(([source]) => (source as unknown as { __mv: string }).__mv === "scrollYProgress");
      expect(scrollSpring).toEqual([{ __mv: "scrollYProgress" }, spring.scroll]);
    });

    it("scales the title 1 → 0.84 and moves it 0 → −6vh (SIG-31)", () => {
      setDesktop(true);
      evaluateTransforms();
      render(<HeroSection onNavigate={() => {}} />);
      const style = motionOf(titleWrapper()).style;
      expect(style.scale.at[0]).toBe(1);
      expect(style.scale.at[1]).toBeCloseTo(0.92);
      expect(style.scale.at[2]).toBeCloseTo(0.84);
      expect(style.y.at).toEqual(["0vh", "-3vh", "-6vh"]);
    });

    it("fades subtitle, CTA and chips 1 → 0 by p 0.4 (SIG-32)", () => {
      setDesktop(true);
      evaluateTransforms();
      const { container } = render(<HeroSection onNavigate={() => {}} />);
      const wrappers = container.querySelectorAll("[data-hero-content]");
      expect(wrappers).toHaveLength(2);
      for (const wrapper of wrappers) expect(motionOf(wrapper).style.opacity.at).toEqual([1, 0, 0]);
      expect(wrappers[0]).toContainElement(screen.getByRole("button", { name: "Ver projetos" }));
      expect(wrappers[1]).toContainElement(screen.getByRole("link", { name: "GitHub" }));
    });

    it("hands the field spread 1 → 2.4 and opacity 1 → 0 as motion values (SIG-33)", () => {
      setDesktop(true);
      evaluateTransforms();
      render(<HeroSection onNavigate={() => {}} />);
      const props = fieldProps();
      expect(props.spread.at[0]).toBe(1);
      expect(props.spread.at[1]).toBeCloseTo(1 + 1.4 * (0.3 / 0.7));
      expect(props.spread.at[2]).toBeCloseTo(2.4);
      expect(props.fieldOpacity.at[0]).toBe(1);
      expect(props.fieldOpacity.at[2]).toBeCloseTo(0);
    });
  });

  describe("below lg (SIG-34)", () => {
    it("does not transform the title or the content, and still disperses the field", () => {
      setDesktop(false);
      evaluateTransforms();
      const { container } = render(<HeroSection onNavigate={() => {}} />);
      expect(titleWrapper()).not.toHaveAttribute("data-motion");
      for (const wrapper of container.querySelectorAll("[data-hero-content]")) expect(wrapper).not.toHaveAttribute("data-motion");
      expect(fieldProps().spread.at[2]).toBeCloseTo(2.4);
      expect((vi.mocked(useScroll).mock.lastCall![0] as { offset: string[] }).offset).toEqual(["start start", "end start"]);
    });
  });

  describe("reduced motion (SIG-35)", () => {
    it("has no scroll transform and no dispersion", () => {
      setDesktop(true);
      vi.mocked(useReducedMotion).mockReturnValue(true);
      const { container } = render(<HeroSection onNavigate={() => {}} />);
      expect(titleWrapper()).not.toHaveAttribute("data-motion");
      for (const wrapper of container.querySelectorAll("[data-hero-content]")) expect(wrapper).not.toHaveAttribute("data-motion");
      expect(fieldProps()).toEqual({});
    });

    it("only pins with motion-safe, so the pin is pure CSS and switches off with the media query", () => {
      const { container } = render(<HeroSection onNavigate={() => {}} />);
      const classes = [container.querySelector("section")!, container.querySelector("section")!.firstElementChild!]
        .flatMap((el) => [...el.classList])
        .filter((c) => /h-\[170vh\]|sticky|top-24|100dvh/.test(c));
      expect(classes.length).toBe(4);
      for (const c of classes) expect(c.startsWith("lg:motion-safe:")).toBe(true);
    });
  });

  describe("server HTML (SIG-36)", () => {
    it("contains the h1 text with no inline opacity:0 or transform", () => {
      setDesktop(true);
      const html = renderToString(<HeroSection onNavigate={() => {}} />);
      const h1 = html.slice(html.indexOf("<h1"), html.indexOf("</h1>"));
      expect(h1).toContain("Engenheiro");
      expect(h1).toContain("Full Stack");
      expect(html).not.toMatch(/opacity:\s*0[;"]/);
      expect(html).not.toMatch(/transform:/);
    });
  });

  describe("focus while pinned (SIG-37)", () => {
    it("scrolls back to the top of the hero when its content gets focus mid-pin", () => {
      setDesktop(true);
      const scrollBy = vi.fn();
      vi.stubGlobal("scrollBy", scrollBy);
      const { container } = render(<HeroSection onNavigate={() => {}} />);
      vi.spyOn(container.querySelector("section")!, "getBoundingClientRect").mockReturnValue({ top: -204 } as DOMRect);
      screen.getByRole("button", { name: "Ver projetos" }).focus();
      expect(scrollBy).toHaveBeenCalledWith({ top: -300 });
      vi.unstubAllGlobals();
    });

    it("does not scroll when the hero is at the top or not pinned", () => {
      const scrollBy = vi.fn();
      vi.stubGlobal("scrollBy", scrollBy);
      setDesktop(true);
      const first = render(<HeroSection onNavigate={() => {}} />);
      vi.spyOn(first.container.querySelector("section")!, "getBoundingClientRect").mockReturnValue({ top: 96 } as DOMRect);
      screen.getByRole("button", { name: "Ver projetos" }).focus();
      first.unmount();
      setDesktop(false);
      const second = render(<HeroSection onNavigate={() => {}} />);
      vi.spyOn(second.container.querySelector("section")!, "getBoundingClientRect").mockReturnValue({ top: -204 } as DOMRect);
      screen.getByRole("button", { name: "Ver projetos" }).focus();
      expect(scrollBy).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });
  });
});
