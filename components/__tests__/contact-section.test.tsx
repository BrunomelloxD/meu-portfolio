import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@emailjs/browser", () => ({ __esModule: true, default: { send: vi.fn() }, send: vi.fn() }));

import ContactSection from "../contact-section";
import { SECTION_IDS } from "@/lib/constants";

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

  describe("reveal (MOV-11)", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it("reveals the label, then the two opening lines, in reading order", () => {
      armReveals();
      render(<ContactSection />);
      const label = screen.getByRole("heading", { level: 2, name: "Contato" });
      const items = revealItemsIn(revealBlockOf(label));
      expect(items).toHaveLength(3);
      expect(items[0]).toContainElement(label);
      expect(items[1]).toHaveTextContent("Vamos construir algo juntos?");
      expect(items[2]).toHaveTextContent("Disponível para trabalho remoto ou presencial, e para reuniões presenciais.");
    });
  });
});

describe("chapter clip (SIG-78, SIG-79)", () => {
  it("rises from inset(12% … round 40px) to inset(0 … round 40px) as it enters", async () => {
    const { useScroll } = await import("motion/react");
    const { container } = render(<ContactSection />);
    const section = container.querySelector(`#${SECTION_IDS.CONTACT}`)!;
    const options = vi.mocked(useScroll).mock.calls.map(([o]) => o).find((o) => o && "target" in o) as {
      target: { current: Element };
      offset: string[];
    };
    expect(options.offset).toEqual(["start end", "start 0.6"]);
    expect(options.target.current).toBe(section);
    const clip = motionOf(section).style.clipPath;
    expect(clip.input).toEqual([0, 1]);
    expect(clip.output).toEqual(["inset(12% 0% 0% 0% round 40px)", "inset(0% 0% 0% 0% round 40px)"]);
  });

  it("has no inline clip-path under reduced motion", async () => {
    const { useReducedMotion } = await import("motion/react");
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<ContactSection />);
    const section = container.querySelector(`#${SECTION_IDS.CONTACT}`) as HTMLElement;
    expect(section.style.clipPath).toBe("");
    expect(motionOf(section)).not.toHaveProperty("style");
  });
});
