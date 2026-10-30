import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { CoffeeSection } from "../coffee-section"

const setClipboard = (value: unknown) => Object.defineProperty(navigator, "clipboard", { configurable: true, value })

describe("<CoffeeSection />", () => {
  beforeEach(() => setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) }))
  afterEach(() => setClipboard(undefined))

  it("is section #cafe, under the 'Café' label, named by its 'Me pague um café' h3 (PIX-33)", () => {
    const { container } = render(<CoffeeSection />)
    const section = container.querySelector("section")!
    expect(section).toHaveAttribute("id", "cafe")
    expect(section).toHaveAttribute("aria-labelledby", "cafe-title")
    expect(screen.getByRole("heading", { level: 2, name: "Café" })).toBeInTheDocument()
    const title = screen.getByRole("heading", { level: 3, name: "Me pague um café" })
    expect(title).toHaveAttribute("id", "cafe-title")
    expect(screen.getByRole("region", { name: "Me pague um café" })).toBe(section)
  })

  it("says the chosen line of copy", () => {
    render(<CoffeeSection />)
    expect(
      screen.getByText("Se algum projeto ou post daqui te poupou umas horas, um café paga a próxima madrugada de código."),
    ).toBeInTheDocument()
  })

  it("redraws the steam after a copy (PIX-38)", async () => {
    const { container } = render(<CoffeeSection />)
    const steam = () => container.querySelector("[data-steam]")!.getAttribute("data-motion")!
    expect(JSON.parse(steam())).toHaveProperty("whileInView")
    fireEvent.click(screen.getByRole("button", { name: "Copiar chave" }))
    await act(async () => {})
    expect(JSON.parse(steam()).animate).toEqual({ pathLength: [0, 1] })
  })
})
