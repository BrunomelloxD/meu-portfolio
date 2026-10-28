import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Footer } from "../Footer";
import { SOCIAL_LINKS, SECTION_IDS } from "@/lib/constants";

describe("<Footer />", () => {
  it("renders the current year in the copyright text", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Bruno Mello. Todos os direitos reservados.`)).toBeInTheDocument();
  });

  it("exposes all social links with proper rel/target", () => {
    render(<Footer />);

    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", SOCIAL_LINKS.github);
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", SOCIAL_LINKS.linkedin);
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", `mailto:${SOCIAL_LINKS.email}`);
  });

  it("closes with the name at display size and a 'Voltar ao topo' link to the start", () => {
    render(<Footer />);
    // The name sits in a ScrambleText (sr-only + painted copy), inside the display paragraph.
    const name = screen.getByText((_, el) => el?.tagName === "P" && el.querySelector("[data-scramble]") !== null);
    expect(name).toHaveClass("font-mono", "font-bold");
    expect(name.querySelector(".sr-only")).toHaveTextContent("Bruno Mello");
    expect(screen.getByRole("link", { name: "Voltar ao topo" })).toHaveAttribute("href", `#${SECTION_IDS.HOME}`);
  });

  it("no longer renders the RPG micro-label", () => {
    render(<Footer />);
    expect(screen.queryByText("Sítio da Graça")).not.toBeInTheDocument();
  });

  describe("curtain (SIG-110..SIG-113)", () => {
    const page = readFileSync(resolve(process.cwd(), "app/page.tsx"), "utf8");

    it("waits under <main> from lg: sticky at the bottom, below an opaque main with a higher z-index (SIG-110)", () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector("footer")!;
      expect(footer).toHaveClass("lg:motion-safe:sticky", "lg:motion-safe:bottom-0", "relative", "z-0");
      const main = page.match(/<main id="conteudo" className="([^"]+)"/)![1].split(" ");
      expect(main).toEqual(expect.arrayContaining(["relative", "z-10", "bg-bg"]));
      // The footer comes right after <main>, so it is what <main> uncovers.
      expect(page.indexOf("<Footer />")).toBeGreaterThan(page.indexOf("</main>"));
    });

    it("decodes the name with ScrambleText (SIG-111)", () => {
      const { container } = render(<Footer />);
      expect(container.querySelector("footer p [data-scramble] .sr-only")).toHaveTextContent("Bruno Mello");
    });

    it("stays in normal flow below lg and under reduced motion: every sticky class is lg + motion-safe (SIG-112)", () => {
      const { container } = render(<Footer />);
      const classes = [...container.querySelector("footer")!.classList].filter((c) => /sticky|bottom-0/.test(c));
      expect(classes).toHaveLength(2);
      for (const c of classes) expect(c.startsWith("lg:motion-safe:")).toBe(true);
    });

    it("keeps every link focusable (SIG-113)", () => {
      render(<Footer />);
      const links = screen.getAllByRole("link");
      // By accessible name: the email chip also holds its aria-hidden "Copiado" overlay (CONT-07).
      for (const name of [/^GitHub/, /^LinkedIn/, /^Email/, /^Voltar ao topo/]) expect(links).toContain(screen.getByRole("link", { name }));
      for (const link of links) {
        expect(link).not.toHaveAttribute("tabindex", "-1");
        expect(link.closest("[aria-hidden='true'], [inert]")).toBeNull();
      }
    });
  });

  describe("focus in the curtain (SIG-114)", () => {
    it("scrolls to the end when focus enters the footer, and stays put when already there", () => {
      const scrollTo = vi.fn();
      vi.stubGlobal("scrollTo", scrollTo);
      Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 9000 });
      Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 });
      Object.defineProperty(window, "scrollY", { configurable: true, value: 7000 });
      render(<Footer />);
      screen.getByRole("link", { name: "Voltar ao topo" }).focus();
      expect(scrollTo).toHaveBeenCalledWith({ top: 8100 });
      scrollTo.mockClear();
      Object.defineProperty(window, "scrollY", { configurable: true, value: 8100 });
      screen.getByRole("link", { name: "GitHub" }).focus();
      expect(scrollTo).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });
  });

  it("copies the address when its Email chip is clicked, and keeps the mailto (Footer, CONT-06)", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<Footer />);
    expect(fireEvent.click(screen.getByRole("link", { name: "Email" }))).toBe(true);
    expect(writeText).toHaveBeenCalledWith(SOCIAL_LINKS.email);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
  });
});
