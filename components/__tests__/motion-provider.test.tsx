import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MotionConfig } from "motion/react"
import { MotionProvider } from "../motion-provider"

describe("<MotionProvider />", () => {
  it("wraps the page in MotionConfig with reducedMotion=user (MOV-03)", () => {
    render(
      <MotionProvider>
        <p>Conteúdo</p>
      </MotionProvider>,
    )
    expect(screen.getByText("Conteúdo")).toBeInTheDocument()
    expect(vi.mocked(MotionConfig).mock.calls[0][0]).toMatchObject({ reducedMotion: "user" })
  })
})
