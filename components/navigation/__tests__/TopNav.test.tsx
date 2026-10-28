import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isValidElement } from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnimatePresence } from "motion/react";
import { TopNav } from "../TopNav";
import { MobileMenu } from "../MobileMenu";
import { SECTION_IDS } from "@/lib/constants";

const desktopNav = () => screen.getByRole("navigation", { name: "Principal" });
const motionOf = (el: Element) => JSON.parse((el as HTMLElement).dataset.motion ?? "{}");
const indicators = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-motion]")).filter(
    (el) => motionOf(el).layoutId === "nav-indicator",
  );

describe("<TopNav />", () => {
  it("lists exactly Sobre, Experiência, Projetos, Habilidades, Contato (NAV-01)", () => {
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);
    // Accessible names: the label text also holds the scramble's sr-only and width-holding copies (SIG-44).
    const links = within(desktopNav()).getAllByRole("link");
    const labels = ["Sobre", "Experiência", "Projetos", "Habilidades", "Contato"];
    expect(links).toHaveLength(labels.length);
    links.forEach((link, i) => expect(link).toHaveAccessibleName(labels[i]));
  });

  it("marks the active section link with aria-current (NAV-02)", () => {
    render(<TopNav activeSection={SECTION_IDS.PROJECTS} onNavigate={() => {}} />);
    expect(within(desktopNav()).getByRole("link", { name: "Projetos" })).toHaveAttribute("aria-current", "true");
    expect(within(desktopNav()).getByRole("link", { name: "Sobre" })).not.toHaveAttribute("aria-current");
  });

  it("renders exactly one nav-indicator, inside the active link (MOV-22)", () => {
    render(<TopNav activeSection={SECTION_IDS.PROJECTS} onNavigate={() => {}} />);

    expect(indicators()).toHaveLength(1);
    const [indicator] = indicators();
    expect(indicator.closest("a")).toBe(within(desktopNav()).getByRole("link", { name: "Projetos" }));
    expect(indicator.closest("a")).toHaveAttribute("aria-current", "true");
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator).toHaveClass("bg-accent");
  });

  it("renders no indicator when no header link is active", () => {
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);
    expect(indicators()).toHaveLength(0);
  });

  it("moves the indicator to the new active link when activeSection changes", () => {
    const { rerender } = render(<TopNav activeSection={SECTION_IDS.ABOUT} onNavigate={() => {}} />);
    expect(indicators()[0].closest("a")).toBe(within(desktopNav()).getByRole("link", { name: "Sobre" }));

    rerender(<TopNav activeSection={SECTION_IDS.SKILLS} onNavigate={() => {}} />);
    expect(indicators()).toHaveLength(1);
    expect(indicators()[0].closest("a")).toBe(within(desktopNav()).getByRole("link", { name: "Habilidades" }));
  });

  it("uses the glide spring as the indicator layout transition (MOV-23)", () => {
    render(<TopNav activeSection={SECTION_IDS.EXPERIENCE} onNavigate={() => {}} />);
    expect(motionOf(indicators()[0]).transition).toEqual({
      layout: { type: "spring", stiffness: 380, damping: 40, mass: 1 },
    });
  });

  it("keeps the active link at the same font weight as the inactive ones (MOV-24)", () => {
    render(<TopNav activeSection={SECTION_IDS.PROJECTS} onNavigate={() => {}} />);
    const active = within(desktopNav()).getByRole("link", { name: "Projetos" });
    const inactive = within(desktopNav()).getByRole("link", { name: "Sobre" });

    expect(active.className).not.toMatch(/font-(semibold|bold|medium)/);
    expect(inactive.className).not.toMatch(/font-(semibold|bold|medium)/);
  });

  it("shows the nav links' focus ring without a transition (MOV-20)", () => {
    render(<TopNav activeSection={SECTION_IDS.PROJECTS} onNavigate={() => {}} />);
    for (const link of within(desktopNav()).getAllByRole("link")) {
      expect(link).toHaveClass("focus-visible:ring-2");
      const classes = link.className.split(/\s+/);
      expect(classes).not.toContain("transition");
      expect(classes).not.toContain("transition-all");
      expect(classes.filter((c) => c.startsWith("transition-[")).join(" ")).not.toMatch(/box-shadow/);
    }
  });

  it("renders the two-line wordmark that navigates home", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);

    const logo = screen.getByRole("button", { name: "Ir para o início" });
    expect(logo).toHaveTextContent("BrunoMello");
    await user.click(logo);
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.HOME);
  });

  it("navigates to the section of the clicked link", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);

    await user.click(within(desktopNav()).getByRole("link", { name: "Projetos" }));
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.PROJECTS);
  });

  it("navigates to contact from the 'Fale comigo' pill", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "Fale comigo" }));
    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.CONTACT);
  });

  it("offers 'Pular para o conteúdo' as the first focusable element (NAV-05)", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    await user.tab();
    const skip = screen.getByRole("link", { name: "Pular para o conteúdo" });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute("href", "#conteudo");
  });

  it("shows a 'Menu' button with aria-expanded for the mobile layout (NAV-03)", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    const menu = screen.getByRole("button", { name: "Menu" });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveClass("md:hidden");

    await user.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  });

  it("closes the menu on Escape and returns focus to the 'Menu' button (NAV-04)", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
  });

  it("returns focus to 'Menu' in the same tick when closing with 'Fechar' (MOV-31)", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    vi.useFakeTimers();
    try {
      within(screen.getByRole("dialog")).getByRole("button", { name: "Fechar" }).click();
      expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns focus to 'Menu' in the same tick when closing with Escape (MOV-31)", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    vi.useFakeTimers();
    try {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });

  it("wraps the mobile menu in AnimatePresence (MOV-31)", async () => {
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const wrapsMenu = vi
      .mocked(AnimatePresence)
      .mock.calls.some(([props]) => isValidElement(props.children) && props.children.type === MobileMenu);
    expect(wrapsMenu).toBe(true);
    expect(within(screen.getByRole("dialog")).getByRole("link", { name: "Sobre" })).toBeInTheDocument();
  });

  it("mounts the reading progress bar inside the header, after the nav bar (MOV-39)", () => {
    const { container } = render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);
    const header = container.querySelector("header")!;
    const bar = Array.from(header.children).find((el) => el.classList.contains("h-[3px]"));

    expect(bar).toBeDefined();
    expect(bar).toHaveAttribute("aria-hidden", "true");
    expect(header).toHaveClass("sticky");
    expect(desktopNav().compareDocumentPosition(bar!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(header.lastElementChild).toBe(bar);
  });

  it("closes the menu after navigating from it", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Experiência" }));

    expect(onNavigate).toHaveBeenCalledWith(SECTION_IDS.EXPERIENCE);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("nav hover scramble (SIG-44)", () => {
  let frames: FrameRequestCallback[] = [];
  const runFrame = (now: number) => {
    const queue = frames;
    frames = [];
    act(() => queue.forEach((cb) => cb(now)));
  };
  const painted = (name: string) =>
    within(desktopNav()).getByRole("link", { name }).querySelector(".row-start-1:not(.invisible) > [aria-hidden]")!;

  beforeEach(() => {
    frames = [];
    vi.stubGlobal("requestAnimationFrame", vi.fn((cb: FrameRequestCallback) => frames.push(cb)));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  const fine = (matches: boolean) =>
    vi.mocked(window.matchMedia).mockImplementation(
      (query: string) =>
        ({
          matches: query === "(hover: hover) and (pointer: fine)" ? matches : false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );

  it("replays the label over 300ms, character i of n settling at i × 300 / n", () => {
    fine(true);
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);
    fireEvent.pointerEnter(within(desktopNav()).getByRole("link", { name: "Contato" }));
    runFrame(0);
    // "Contato": 7 characters, i settles at i × 300 / 7 ms → at t = 0 only the first.
    expect(painted("Contato").textContent!.slice(0, 1)).toBe("C");
    expect(painted("Contato").querySelector(".text-ink-faint")!.textContent).toHaveLength(6);
    runFrame(150); // i ≤ 3 settled (3 × 300 / 7 ≈ 128.6)
    expect(painted("Contato").textContent!.slice(0, 4)).toBe("Cont");
    runFrame(300);
    expect(painted("Contato").textContent).toBe("Contato");
    expect(frames).toHaveLength(0);
  });

  it("does not restart while a replay is running", () => {
    fine(true);
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);
    const link = within(desktopNav()).getByRole("link", { name: "Sobre" });
    fireEvent.pointerEnter(link);
    runFrame(0);
    runFrame(100);
    const before = vi.mocked(requestAnimationFrame).mock.calls.length;
    fireEvent.pointerEnter(link);
    expect(vi.mocked(requestAnimationFrame).mock.calls.length).toBe(before);
    expect(frames).toHaveLength(1);
    runFrame(300);
    expect(painted("Sobre").textContent).toBe("Sobre");
  });

  it("does nothing without a fine pointer", () => {
    fine(false);
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);
    fireEvent.pointerEnter(within(desktopNav()).getByRole("link", { name: "Sobre" }));
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("keeps the label's width with an invisible copy, so the row never reflows", () => {
    render(<TopNav activeSection={SECTION_IDS.HOME} onNavigate={() => {}} />);
    const holder = within(desktopNav()).getByRole("link", { name: "Sobre" }).querySelector(".invisible")!;
    expect(holder).toHaveTextContent("Sobre");
    expect(holder).toHaveAttribute("aria-hidden", "true");
  });
});
