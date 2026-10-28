import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { AboutSection } from "../AboutSection";
import { EDUCATION, SECTION_IDS } from "@/lib/constants";

/** Reveal blocks only arm (and expose their item variants) below the fold, with IntersectionObserver. */
function armReveals() {
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn(), takeRecords: vi.fn() };
    }),
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 2000, bottom: 2100 } as DOMRect);
}

const motionOf = (el: Element) => JSON.parse(el.getAttribute("data-motion") ?? "{}");
const revealBlockOf = (el: Element) => el.closest('[data-motion*="whileInView"]')!;
/** RevealItems of a block, in DOM order: they carry the item variants (opacity 0 -> 1) but no whileInView. */
const revealItemsIn = (block: Element) =>
  [...block.querySelectorAll("[data-motion]")].filter((el) => {
    const props = motionOf(el);
    return props.variants?.show?.opacity === 1 && props.variants?.hidden?.opacity === 0 && !props.whileInView;
  });

describe("<AboutSection />", () => {
  it("is the 'sobre' section, labelled by its h2", () => {
    const { container } = render(<AboutSection />);
    const section = container.querySelector(`section#${SECTION_IDS.ABOUT}`)!;
    expect(section).toHaveAttribute("aria-labelledby", "sobre-title");
    expect(screen.getByRole("heading", { level: 2, name: "Sobre" })).toHaveAttribute("id", "sobre-title");
  });

  it("states who Bruno is with 'full stack' and '+3 anos' emphasised (ABOUT-01)", () => {
    render(<AboutSection />);
    const statement = screen.getByText(
      (_, el) => el?.tagName === "P" && el.textContent === "Olá! Sou o Bruno, engenheiro de software full stack. +3 anos de experiência.",
    );
    expect(within(statement).getByText("full stack").tagName).toBe("EM");
    expect(within(statement).getByText("+3 anos").tagName).toBe("EM");
  });

  it("shows only the verifiable stats 3+, 20+ and 10+ (ABOUT-04)", () => {
    render(<AboutSection />);
    const values = screen.getAllByRole("definition").map((dd) => dd.textContent);
    expect(values).toEqual(["3+", "20+", "10+"]);
    expect(screen.getByText("Anos de experiência")).toBeInTheDocument();
    expect(screen.queryByText("100%")).not.toBeInTheDocument();
  });

  it("lists the three degrees under 'Formação' (ABOUT-04)", () => {
    render(<AboutSection />);
    expect(screen.getByRole("heading", { level: 3, name: "Formação" })).toBeInTheDocument();
    EDUCATION.forEach((edu) => {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
    });
    expect(screen.getAllByText("Faculdade Focus Brasil")).toHaveLength(2);
    expect(screen.getByText("Fatec São Paulo")).toBeInTheDocument();
  });

  it("includes the skill stack and portrait (ABOUT-02, ABOUT-03)", () => {
    render(<AboutSection />);
    expect(screen.getByRole("img", { name: "Retrato de Bruno Mello" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Backend" })).toBeInTheDocument();
  });

  describe("reveal (MOV-11)", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it("reveals label, statement and stats as three items, in reading order", () => {
      armReveals();
      render(<AboutSection />);
      const label = screen.getByRole("heading", { level: 2, name: "Sobre" });
      const items = revealItemsIn(revealBlockOf(label));
      expect(items).toHaveLength(3);
      expect(items[0]).toContainElement(label);
      expect(items[1]).toHaveTextContent(/^Olá! Sou o Bruno/);
      expect(items[2]).toContainElement(screen.getByText("Anos de experiência"));
      expect(items[2].querySelector("dl")).not.toBeNull();
    });
  });
});
