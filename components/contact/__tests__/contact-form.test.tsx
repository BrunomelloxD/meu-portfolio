import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { AnimatePresence } from "motion/react";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("@emailjs/browser", () => ({
  __esModule: true,
  default: { send: sendMock },
  send: sendMock,
}));

import { ContactForm } from "../contact-form";

async function fillForm(user: ReturnType<typeof userEvent.setup>, email = "bruno@example.com") {
  await user.type(screen.getByLabelText("Nome"), "Bruno");
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Assunto"), "Hello");
  await user.type(screen.getByLabelText("Mensagem"), "Mensagem de teste");
}

describe("<ContactForm />", () => {
  beforeEach(() => {
    sendMock.mockReset();
    vi.mocked(AnimatePresence).mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the four required fields with autocomplete hints", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Nome")).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Email")).toHaveAttribute("spellcheck", "false");
    for (const label of ["Nome", "Email", "Assunto", "Mensagem"]) {
      expect(screen.getByLabelText(label)).toBeRequired();
    }
  });

  it("sends through EmailJS and confirms with 'Mensagem enviada. Respondo em breve.' (CONT-03)", async () => {
    sendMock.mockResolvedValueOnce({ status: 200 });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    await waitFor(() => expect(sendMock).toHaveBeenCalledTimes(1));
    const [service, template, params, key] = sendMock.mock.calls[0];
    expect([service, template, key]).toEqual(["service_l9gh4io", "template_9glmxg6", "_BM_m6y_iJjxDI60q"]);
    expect(params).toEqual({ name: "Bruno", reply_to: "bruno@example.com", subject: "Hello", message: "Mensagem de teste" });

    expect(await screen.findByRole("status")).toHaveTextContent("Mensagem enviada. Respondo em breve.");
    expect(screen.getByLabelText("Nome")).toHaveValue("");
  });

  it("explains the failure and offers the email when EmailJS rejects (CONT-04)", async () => {
    sendMock.mockRejectedValueOnce(new Error("boom"));
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Não foi possível enviar. Tente de novo ou escreva para brunomello.ti@gmail.com.",
    );
  });

  it("blocks an invalid email inline, focuses it and does not send (CONT-05)", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user, "bruno@");
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    const email = screen.getByLabelText("Email");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Informe um email válido.");
    expect(email).toHaveFocus();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("shows 'Enviando…' and disables the button while sending", async () => {
    let resolve!: () => void;
    sendMock.mockReturnValueOnce(new Promise<void>((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(screen.getByRole("button", { name: "Enviando…" })).toBeDisabled();
    resolve();
    expect(await screen.findByRole("button", { name: "Enviar mensagem" })).toBeEnabled();
  });

  it("crossfades the label to 'Enviando…' inside AnimatePresence mode wait, 0.12s (MOV-33)", async () => {
    let resolve!: () => void;
    sendMock.mockReturnValueOnce(new Promise<void>((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    const label = screen.getByText("Enviando…");
    expect(label.tagName).toBe("SPAN");
    expect(JSON.parse(label.getAttribute("data-motion")!)).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.12, ease: [0.32, 0.72, 0, 1] },
    });

    const wrapping = vi.mocked(AnimatePresence).mock.calls.filter(([props]) => {
      const child = props.children as React.ReactElement<{ children?: React.ReactNode }> | undefined;
      return React.isValidElement(child) && child.key === "sending" && child.props.children === "Enviando…";
    });
    expect(wrapping.length).toBeGreaterThan(0);
    for (const [props] of wrapping) {
      expect(props).toMatchObject({ mode: "wait", initial: false });
    }

    resolve();
    expect(await screen.findByRole("button", { name: "Enviar mensagem" })).toBeEnabled();
  });

  it("fades the success status in from y 4 with the soft ease (MOV-34)", async () => {
    sendMock.mockResolvedValueOnce({ status: 200 });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    const message = await screen.findByText("Mensagem enviada. Respondo em breve.");
    const motion = JSON.parse(message.getAttribute("data-motion")!);
    expect(motion.initial).toEqual({ opacity: 0, y: 4 });
    expect(motion.animate).toEqual({ opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.33, 1, 0.68, 1] } });
    expect(message.parentElement).toBe(screen.getByRole("status"));
  });

  it("fades the error status in from y 4 with the soft ease (MOV-34)", async () => {
    sendMock.mockRejectedValueOnce(new Error("boom"));
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    const message = await screen.findByText(/Não foi possível enviar/);
    const motion = JSON.parse(message.getAttribute("data-motion")!);
    expect(motion.initial).toEqual({ opacity: 0, y: 4 });
    expect(motion.animate).toEqual({ opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.33, 1, 0.68, 1] } });
  });

  it("keeps role=status mounted before, during and after the send (MOV-35)", async () => {
    let resolve!: () => void;
    sendMock.mockReturnValueOnce(new Promise<void>((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<ContactForm />);

    const before = screen.getByRole("status");
    expect(before).toHaveAttribute("aria-live", "polite");
    expect(before).toBeEmptyDOMElement();
    expect(before.className).not.toContain("empty:hidden");

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));
    expect(screen.getByRole("button", { name: "Enviando…" })).toBeDisabled();
    expect(screen.getByRole("status")).toBe(before);

    resolve();
    await screen.findByText("Mensagem enviada. Respondo em breve.");
    expect(screen.getByRole("status")).toBe(before);
  });

  it("fades field errors in from y -4 over 0.32s, keeping aria wiring (MOV-36)", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    for (const [label, name] of [
      ["Nome", "name"],
      ["Email", "email"],
      ["Assunto", "subject"],
      ["Mensagem", "message"],
    ]) {
      const input = screen.getByLabelText(label);
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", `${name}-error`);
      const error = document.getElementById(`${name}-error`)!;
      expect(error).toHaveTextContent("Campo obrigatório.");
      const motion = JSON.parse(error.getAttribute("data-motion")!);
      expect(motion.initial).toEqual({ opacity: 0, y: -4 });
      expect(motion.animate.transition.duration).toBe(0.32);
    }
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("removes the field error once the user types again", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));
    await user.type(screen.getByLabelText("Nome"), "B");

    expect(document.getElementById("name-error")).toBeNull();
    expect(screen.getByLabelText("Nome")).not.toHaveAttribute("aria-describedby");
  });

  it("gives the fields no transition on the focus ring (MOV-20)", () => {
    const { container } = render(<ContactForm />);
    const elements = container.querySelectorAll("[class]");
    expect(elements.length).toBeGreaterThan(0);
    for (const el of Array.from(elements)) {
      const classes = el.getAttribute("class")!.split(/\s+/);
      expect(classes).not.toContain("transition");
      expect(classes).not.toContain("transition-all");
      expect(classes).not.toContain("transition-shadow");
      for (const cls of classes.filter((c) => c.startsWith("transition-["))) {
        expect(cls).not.toMatch(/box-shadow|shadow|ring/);
      }
    }
    for (const label of ["Nome", "Email", "Assunto", "Mensagem"]) {
      const classes = screen.getByLabelText(label).className.split(/\s+/);
      expect(classes).toContain("focus-visible:ring-1");
      expect(classes.filter((c) => c.startsWith("transition"))).toEqual(["transition-colors"]);
    }
  });
});
