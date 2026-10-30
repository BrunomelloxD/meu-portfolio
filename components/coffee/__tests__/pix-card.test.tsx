import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, fireEvent, render, screen, within } from "@testing-library/react"
import { PixCard } from "../pix-card"
import { PIX_BR_CODE } from "@/lib/pix"

const writeText = vi.fn()
const setClipboard = (value: unknown) => Object.defineProperty(navigator, "clipboard", { configurable: true, value })
const execCommand = vi.fn()
const status = () => screen.getByRole("status")
const click = async (name: string) => {
  fireEvent.click(screen.getByRole("button", { name }))
  await act(async () => {})
}

beforeEach(() => {
  vi.useFakeTimers()
  writeText.mockReset().mockResolvedValue(undefined)
  setClipboard({ writeText })
  execCommand.mockReset().mockReturnValue(false)
  Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand })
  window.getSelection()?.removeAllRanges()
})
afterEach(() => {
  vi.useRealTimers()
  setClipboard(undefined)
})

describe("<PixCard /> key", () => {
  it("shows the key as selectable code text (PIX-01)", () => {
    render(<PixCard onCopied={() => {}} />)
    const code = screen.getByText("+55 (19) 99711-9007")
    expect(code.tagName).toBe("CODE")
    expect(code).toHaveAttribute("data-selectable")
  })

  it("copies the key, says so for 2000 ms, then goes back (PIX-02, PIX-03, PIX-04, PIX-05)", async () => {
    const onCopied = vi.fn()
    render(<PixCard onCopied={onCopied} />)
    expect(status()).toHaveTextContent("")
    await click("Copiar chave")
    expect(writeText).toHaveBeenCalledWith("+5519997119007")
    expect(screen.getByRole("button", { name: "Copiada!" })).toBeInTheDocument()
    expect(status()).toHaveTextContent("Chave Pix copiada")
    expect(onCopied).toHaveBeenCalledTimes(1)

    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByRole("button", { name: "Copiar chave" })).toBeInTheDocument()
    expect(status()).toHaveTextContent("")
  })

  it("selects the key and explains how to copy it when every copy method fails (PIX-09)", async () => {
    writeText.mockRejectedValue(new Error("denied"))
    const onCopied = vi.fn()
    render(<PixCard onCopied={onCopied} />)
    await click("Copiar chave")
    expect(execCommand).toHaveBeenCalledWith("copy")
    expect(window.getSelection()?.toString()).toBe("+55 (19) 99711-9007")
    expect(status()).toHaveTextContent(
      "Não deu para copiar. A chave está selecionada: copie pelo menu do navegador.",
    )
    expect(onCopied).not.toHaveBeenCalled()
  })
})

describe("<PixCard /> copy-and-paste code", () => {
  it("copies the BR Code and says 'Código Pix copia e cola copiado' (PIX-16, PIX-17)", async () => {
    const onCopied = vi.fn()
    render(<PixCard onCopied={onCopied} />)
    await click("Pix copia e cola")
    expect(writeText).toHaveBeenCalledWith(PIX_BR_CODE)
    expect(screen.getByRole("button", { name: "Copiado!" })).toBeInTheDocument()
    expect(status()).toHaveTextContent("Código Pix copia e cola copiado")
    expect(onCopied).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByRole("button", { name: "Pix copia e cola" })).toBeInTheDocument()
    expect(status()).toHaveTextContent("")
  })

  it("selects the key and explains it when the code cannot be copied (PIX-18)", async () => {
    setClipboard(undefined)
    render(<PixCard onCopied={() => {}} />)
    await click("Pix copia e cola")
    expect(window.getSelection()?.toString()).toBe("+55 (19) 99711-9007")
    expect(status()).toHaveTextContent(
      "Não deu para copiar o código. A chave está selecionada: copie pelo menu do navegador.",
    )
  })

  it("announces the latest copy when both buttons are used", async () => {
    render(<PixCard onCopied={() => {}} />)
    await click("Copiar chave")
    await click("Pix copia e cola")
    expect(status()).toHaveTextContent("Código Pix copia e cola copiado")
  })
})

describe("<PixCard /> QR and layout", () => {
  it("shows the QR as a 200px image of /pix-qr.svg with the payment alt text (PIX-24)", () => {
    render(<PixCard onCopied={() => {}} />)
    const img = screen.getByRole("img", { name: "QR Code Pix para pagar um café a Bruno de Oliveira Mello" })
    expect(img).toHaveAttribute("src", "/pix-qr.svg")
    expect(img).toHaveAttribute("width", "200")
    expect(img).toHaveAttribute("height", "200")
  })

  it("starts with the QR hidden behind a collapsed toggle on small screens (PIX-27)", () => {
    render(<PixCard onCopied={() => {}} />)
    const toggle = screen.getByRole("button", { name: /Vai pagar de outro aparelho\?/ })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(toggle).toHaveAttribute("aria-controls", "pix-qr-panel")
    expect(toggle).toHaveTextContent("Mostrar QR Code")
    expect(document.getElementById("pix-qr-panel")).toHaveClass("hidden")
  })

  it("opens and closes the QR panel with the toggle (PIX-28, PIX-29)", () => {
    render(<PixCard onCopied={() => {}} />)
    const toggle = screen.getByRole("button", { name: /Vai pagar de outro aparelho\?/ })
    const panel = document.getElementById("pix-qr-panel")!
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(toggle).toHaveTextContent("Ocultar QR Code")
    expect(panel).not.toHaveClass("hidden")
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(panel).toHaveClass("hidden")
  })

  it("always shows the QR, without the toggle, from 1024px (PIX-25)", () => {
    const { container } = render(<PixCard onCopied={() => {}} />)
    expect(document.getElementById("pix-qr-panel")).toHaveClass("lg:flex")
    expect(screen.getByRole("button", { name: /Vai pagar de outro aparelho\?/ })).toHaveClass("lg:hidden")
    expect(container.querySelector("[data-qr-column]")).toHaveClass("lg:order-first")
  })

  it("puts recipient, key, both buttons, status, steps and toggle in that order, buttons full width (PIX-26, PIX-30)", () => {
    const { container } = render(<PixCard onCopied={() => {}} />)
    const order = [
      screen.getByText("Recebedor"),
      screen.getByText("+55 (19) 99711-9007"),
      screen.getByRole("button", { name: "Copiar chave" }),
      screen.getByRole("button", { name: "Pix copia e cola" }),
      status(),
      screen.getByRole("list"),
      screen.getByRole("button", { name: /Vai pagar de outro aparelho\?/ }),
    ]
    for (let i = 1; i < order.length; i++) {
      expect(order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
    for (const name of ["Copiar chave", "Pix copia e cola"]) {
      expect(screen.getByRole("button", { name })).toHaveClass("w-full", "lg:w-auto")
    }
    expect(container.querySelector("[data-qr-column]")).toHaveClass("order-last")
  })
})

describe("<PixCard /> trust and steps", () => {
  it("shows the recipient and the hint to check it (PIX-31)", () => {
    render(<PixCard onCopied={() => {}} />)
    expect(screen.getByText("Recebedor")).toBeInTheDocument()
    expect(screen.getByText("Bruno de Oliveira Mello")).toBeInTheDocument()
    expect(screen.getByText("Confira este nome no app do banco antes de confirmar.")).toBeInTheDocument()
  })

  it("lists the 3 steps under 'Como pagar' (PIX-32)", () => {
    render(<PixCard onCopied={() => {}} />)
    expect(screen.getByText("Como pagar")).toBeInTheDocument()
    const list = screen.getByRole("list")
    expect(list.tagName).toBe("OL")
    expect(within(list).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Abra o app do seu banco",
      "Entre na área Pix",
      "Leia o QR Code ou cole a chave",
    ])
  })
})
