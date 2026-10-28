import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from "vitest";
import { renderToString } from "react-dom/server";
import { render, screen, act } from "@testing-library/react";
import { Reveal, RevealItem } from "../reveal";

// These tests need what the real Motion writes to the DOM, not the global mock.
vi.unmock("motion/react");

// Motion caches its IntersectionObserver per options, so one stub serves the whole file.
type Observed = { callback: IntersectionObserverCallback; targets: Element[] };
const observers: Observed[] = [];

function stubIntersectionObserver() {
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (callback: IntersectionObserverCallback) {
      const observed: Observed = { callback, targets: [] };
      observers.push(observed);
      return { observe: (el: Element) => observed.targets.push(el), unobserve: vi.fn(), disconnect: vi.fn(), takeRecords: vi.fn() };
    }),
  );
}

function enterViewport() {
  act(() => {
    for (const { callback, targets } of observers) {
      const entries = targets.filter((target) => target.isConnected).map((target) => ({ target, isIntersecting: true, intersectionRatio: 1 }));
      callback(entries as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    }
  });
}

function placeTop(top: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top, bottom: top + 100 } as DOMRect);
}

const settle = (ms: number) => act(() => new Promise((resolve) => setTimeout(resolve, ms)));

const tree = (
  <Reveal className="block">
    <RevealItem>Rótulo</RevealItem>
    <RevealItem>Texto</RevealItem>
  </Reveal>
);

describe("<Reveal /> with the real Motion", () => {
  beforeAll(stubIntersectionObserver);
  afterAll(() => vi.unstubAllGlobals());
  afterEach(() => vi.restoreAllMocks());

  it("server HTML has no opacity:0 and no inline transform (MOV-13)", () => {
    for (const html of [renderToString(tree), renderToString(<Reveal>Bloco</Reveal>)]) {
      expect(html).toContain(html.includes("Bloco") ? "Bloco" : "Rótulo");
      expect(html).not.toMatch(/opacity:\s*0/);
      expect(html).not.toMatch(/transform/);
    }
  });

  it("keeps a block that is already on screen at mount visible, never at opacity 0 (MOV-15)", async () => {
    placeTop(100);
    const styles: string[] = [];
    const mutations = new MutationObserver((records) => {
      for (const record of records) styles.push((record.target as HTMLElement).getAttribute("style") ?? "");
    });
    const { container } = render(tree);
    mutations.observe(container, { attributes: true, subtree: true, attributeFilter: ["style"] });

    await settle(50);
    enterViewport();
    await settle(300);
    mutations.disconnect();

    expect(styles.join(" ")).not.toMatch(/opacity:\s*0[;\s]/);
    for (const text of ["Rótulo", "Texto"]) expect(screen.getByText(text).style.opacity).not.toBe("0");
  });

  it("hides a block below the fold, then reveals every item once it enters the viewport (MOV-10)", async () => {
    placeTop(5000);
    render(tree);
    await settle(50);
    expect(screen.getByText("Rótulo").style.opacity).toBe("0");

    enterViewport();
    await settle(1200);
    for (const text of ["Rótulo", "Texto"]) {
      expect(screen.getByText(text).style.opacity).toBe("1");
      expect(screen.getByText(text).style.transform).toBe("none");
    }
  });
});
