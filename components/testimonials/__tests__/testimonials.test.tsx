import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Testimonials } from "../testimonials";
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

describe("<Testimonials />", () => {
  it("is the 'depoimentos' section labelled by its h2", () => {
    const { container } = render(<Testimonials />);
    expect(container.querySelector(`section#${SECTION_IDS.TESTIMONIALS}`)).toHaveAttribute("aria-labelledby", "depoimentos-title");
    expect(screen.getByRole("heading", { level: 2, name: "Depoimentos" })).toBeInTheDocument();
  });

  it("shows all three testimonials at once, with no interaction and no autoplay (TEST-01)", () => {
    vi.useFakeTimers();
    render(<Testimonials />);
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.getByText("Lucas Lopes de Souza Guilha")).toBeInTheDocument();
    expect(screen.getByText("Thiago André")).toBeInTheDocument();
    expect(screen.getByText("Engenheiro Desenvolvedor Full Stack Sênior")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Thiago André" })).toHaveAttribute("src", "/images/thiago-andre.jpg");
    expect(screen.getByText("Felipe Sasaki")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("highlights Lucas's line as the pull quote (TEST-02)", () => {
    render(<Testimonials />);
    const quote = screen.getByText("“Ele não espera os problemas acontecerem: vai atrás.”");
    expect(quote.closest("blockquote")).not.toBeNull();
    expect(screen.getByText("— Lucas Lopes de Souza Guilha, Gazin Tech")).toBeInTheDocument();
  });

  describe("reveal (MOV-11)", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it("reveals the label, then the pull quote", () => {
      armReveals();
      render(<Testimonials />);
      const label = screen.getByRole("heading", { level: 2, name: "Depoimentos" });
      const items = revealItemsIn(revealBlockOf(label));
      expect(items).toHaveLength(2);
      expect(items[0]).toContainElement(label);
      expect(items[1]).toContainElement(screen.getByText("“Ele não espera os problemas acontecerem: vai atrás.”"));
      expect(items[1].querySelector("figcaption")).not.toBeNull();
    });
  });
});
