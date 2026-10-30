import { describe, it, expect, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { CopyButton } from "../copy-button"

const props = { kind: "primary", label: "Copiar chave", copiedLabel: "Copiada!", icon: "copy" } as const

describe("<CopyButton />", () => {
  it("is a plain button named by its visible label, and calls onClick", () => {
    const onClick = vi.fn()
    render(<CopyButton {...props} copied={false} onClick={onClick} />)
    const button = screen.getByRole("button", { name: "Copiar chave" })
    expect(button).toHaveAttribute("type", "button")
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("is named 'Copiada!' and shows the check icon once copied (PIX-03)", () => {
    const { container, rerender } = render(<CopyButton {...props} copied={false} onClick={() => {}} />)
    expect(container.querySelector("[data-icon]")).toHaveAttribute("data-icon", "copy")
    rerender(<CopyButton {...props} copied onClick={() => {}} />)
    expect(screen.getByRole("button", { name: "Copiada!" })).toBeInTheDocument()
    expect(container.querySelector("[data-icon]")).toHaveAttribute("data-icon", "check")
  })

  it("stacks both labels in one grid cell so the width never changes (PIX-07)", () => {
    const { rerender } = render(<CopyButton {...props} copied={false} onClick={() => {}} />)
    const label = screen.getByText("Copiar chave")
    const copied = screen.getByText("Copiada!")
    expect(label.parentElement).toBe(copied.parentElement)
    expect(label.parentElement).toHaveClass("grid")
    for (const el of [label, copied]) expect(el).toHaveClass("col-start-1", "row-start-1")
    expect(copied).toHaveClass("opacity-0")
    expect(copied).toHaveAttribute("aria-hidden", "true")

    rerender(<CopyButton {...props} copied onClick={() => {}} />)
    expect(label).toHaveClass("opacity-0")
    expect(label).toHaveAttribute("aria-hidden", "true")
    expect(copied).not.toHaveClass("opacity-0")
    expect(copied).not.toHaveAttribute("aria-hidden")
  })

  it("hides its icons from assistive tech and draws the clipboard icon when asked", () => {
    const { container } = render(<CopyButton {...props} icon="clipboard" copied={false} onClick={() => {}} />)
    const icon = container.querySelector("[data-icon]")
    expect(icon).toHaveAttribute("data-icon", "clipboard")
    expect(icon).toHaveAttribute("aria-hidden", "true")
  })

  it("has a 52px target and the gold focus ring of the design system", () => {
    render(<CopyButton {...props} copied={false} onClick={() => {}} />)
    expect(screen.getByRole("button")).toHaveClass(
      "min-h-[52px]",
      "focus-visible:ring-2",
      "focus-visible:ring-accent",
    )
  })

  it("marks the secondary copied state with the accent border", () => {
    render(<CopyButton kind="secondary" label="Pix copia e cola" copiedLabel="Copiado!" icon="clipboard" copied onClick={() => {}} />)
    expect(screen.getByRole("button", { name: "Copiado!" })).toHaveClass("border-accent")
  })
})
