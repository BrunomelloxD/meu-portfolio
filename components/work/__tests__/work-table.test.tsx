import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkTable } from "../work-table";
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

describe("<WorkTable />", () => {
  it("is the 'experiencia' section titled 'Experiência'", () => {
    const { container } = render(<WorkTable />);
    expect(container.querySelector(`section#${SECTION_IDS.EXPERIENCE}`)).toHaveAttribute("aria-labelledby", "experiencia-title");
    expect(screen.getByRole("heading", { level: 2, name: "Experiência" })).toBeInTheDocument();
  });

  it("renders one collapsed row per experience, newest first (WORK-01)", () => {
    render(<WorkTable />);
    const rows = screen.getAllByRole("button");
    expect(rows.map((r) => r.getAttribute("aria-expanded"))).toEqual(["false", "false", "false", "false"]);
    expect(rows.map((r) => r.textContent)).toEqual([
      expect.stringContaining("Grupo UND"),
      expect.stringContaining("Desenvolvedor Júnior III"),
      expect.stringContaining("Desenvolvedor Júnior I"),
      expect.stringContaining("Alares Internet"),
    ]);
  });

  it("closes with 'Experiência total' and '+3 anos' (WORK-05)", () => {
    render(<WorkTable />);
    expect(screen.getByText("Experiência total")).toBeInTheDocument();
    expect(screen.getByText("+3 anos")).toBeInTheDocument();
  });

  describe("reveal (MOV-11)", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it("reveals the 'Experiência' heading as an item and leaves the rows out of the hidden block", () => {
      armReveals();
      render(<WorkTable />);
      const heading = screen.getByRole("heading", { level: 2, name: "Experiência" });
      const block = revealBlockOf(heading);
      const items = revealItemsIn(block);
      expect(items).toHaveLength(1);
      expect(items[0]).toContainElement(heading);
      expect(motionOf(block).animate).toBe("hidden");
      const list = screen.getAllByRole("listitem")[0].closest("ul")!;
      expect(block).not.toContainElement(list);
      expect(list.closest('[data-motion*="whileInView"]')).toBeNull();
    });
  });
});
