import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("@emailjs/browser", () => ({
  __esModule: true,
  default: { send: sendMock },
  send: sendMock,
}));

import ContactSection from "../contact-section";

describe("<ContactSection />", () => {
  beforeEach(() => {
    sendMock.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function fillForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText("Nome"), "Bruno");
    await user.type(screen.getByLabelText("Email"), "bruno@example.com");
    await user.type(screen.getByLabelText("Assunto"), "Hello");
    await user.type(screen.getByLabelText("Mensagem"), "Mensagem de teste");
  }

  it("should render the form with all required fields", () => {
    render(<ContactSection />);
    expect(screen.getByLabelText("Nome")).toBeRequired();
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Assunto")).toBeRequired();
    expect(screen.getByLabelText("Mensagem")).toBeRequired();
  });

  it("should send the email and show a success message on submit", async () => {
    sendMock.mockResolvedValueOnce({ status: 200 });
    const user = userEvent.setup();

    render(<ContactSection />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Enviar Mensagem/ }));

    await waitFor(() => {
      expect(sendMock).toHaveBeenCalledTimes(1);
    });

    const [, , params] = sendMock.mock.calls[0];
    expect(params).toMatchObject({
      name: "Bruno",
      reply_to: "bruno@example.com",
      subject: "Hello",
      message: "Mensagem de teste",
    });

    expect(await screen.findByText(/Mensagem enviada com sucesso/)).toBeInTheDocument();
  });

  it("should clear form fields after successful submit", async () => {
    sendMock.mockResolvedValueOnce({ status: 200 });
    const user = userEvent.setup();

    render(<ContactSection />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Enviar Mensagem/ }));

    await waitFor(() => {
      expect(screen.getByLabelText("Nome")).toHaveValue("");
      expect(screen.getByLabelText("Email")).toHaveValue("");
      expect(screen.getByLabelText("Assunto")).toHaveValue("");
      expect(screen.getByLabelText("Mensagem")).toHaveValue("");
    });
  });

  it("should show an error message when emailjs rejects", async () => {
    sendMock.mockRejectedValueOnce(new Error("boom"));
    const user = userEvent.setup();

    render(<ContactSection />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Enviar Mensagem/ }));

    expect(await screen.findByText(/Erro ao enviar mensagem/)).toBeInTheDocument();
  });

  it("should expose contact info (email and phone) as accessible links", () => {
    render(<ContactSection />);
    expect(screen.getByRole("link", { name: "brunomello.ti@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:brunomello.ti@gmail.com",
    );
    expect(screen.getByRole("link", { name: "+55 (19) 99711-9007" })).toHaveAttribute(
      "href",
      "tel:+5519997119007",
    );
  });
});
