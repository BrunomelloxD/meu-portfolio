import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
});
