import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePresence } from "motion/react";
import { MobileMenu } from "../MobileMenu";
import { SECTION_IDS } from "@/lib/constants";

const motionOf = (el: Element) => JSON.parse((el as HTMLElement).dataset.motion ?? "{}");
const out = [0.32, 0.72, 0, 1];

const links = [
  { id: SECTION_IDS.ABOUT, label: "Sobre" },
  { id: SECTION_IDS.CONTACT, label: "Contato" },
];

describe("<MobileMenu />", () => {
  it("renders a modal dialog with the section links and moves focus to 'Fechar'", () => {
    render(<MobileMenu links={links} activeSection={SECTION_IDS.ABOUT} onNavigate={() => {}} onClose={() => {}} />);

    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveFocus();
  });

  it("calls onClose on Escape (NAV-04)", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<MobileMenu links={links} activeSection="" onNavigate={() => {}} onClose={onClose} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("navigates to contact from the 'Fale comigo' CTA", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<MobileMenu links={links} activeSection="" onNavigate={onNavigate} onClose={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Fale comigo" }));
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.CONTACT);
  });

  it("fades the overlay in over 0.32s and out over 0.18s (MOV-30, MOV-31)", () => {
    render(<MobileMenu links={links} activeSection="" onNavigate={() => {}} onClose={() => {}} />);
    const motion = motionOf(screen.getByRole("dialog"));

    expect(motion.initial).toEqual({ opacity: 0 });
    expect(motion.animate).toEqual({ opacity: 1, transition: { duration: 0.32, ease: out } });
    expect(motion.exit).toEqual({ opacity: 0, transition: { duration: 0.18, ease: out } });
  });

  it("staggers the links in from y 12, 40ms apart starting at 80ms, over 0.7s (MOV-30)", () => {
    render(<MobileMenu links={links} activeSection="" onNavigate={() => {}} onClose={() => {}} />);
    const list = screen.getByRole("list");
    const listMotion = motionOf(list);

    expect(listMotion.initial).toBe("hidden");
    expect(listMotion.animate).toBe("show");
    expect(listMotion.variants.show.transition.delayChildren).toEqual({ __stagger: [0.04, { startDelay: 0.08 }] });

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(links.length);
    for (const item of items) {
      const { variants } = motionOf(item);
      expect(variants.hidden).toEqual({ opacity: 0, y: 12 });
      expect(variants.show).toEqual({ opacity: 1, y: 0, transition: { duration: 0.7, ease: out } });
    }
  });

  it("is not inert while present", () => {
    render(<MobileMenu links={links} activeSection="" onNavigate={() => {}} onClose={() => {}} />);
    expect(screen.getByRole("dialog")).not.toHaveAttribute("inert");
  });

  it("becomes inert while exiting (MOV-32)", () => {
    vi.mocked(usePresence).mockReturnValue([false, vi.fn()]);
    render(<MobileMenu links={links} activeSection="" onNavigate={() => {}} onClose={() => {}} />);
    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("inert");
  });
});
