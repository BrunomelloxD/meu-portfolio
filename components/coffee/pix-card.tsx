"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { CopyButton } from "@/components/coffee/copy-button"
import { useCopyText } from "@/hooks/useCopyText"
import { PIX } from "@/lib/constants"
import { PIX_BR_CODE } from "@/lib/pix"
import { cn } from "@/lib/utils"

type Notice = "key" | "code" | "key-failed" | "code-failed" | null

const FAILED = {
  "key-failed": "Não deu para copiar. A chave está selecionada: copie pelo menu do navegador.",
  "code-failed": "Não deu para copiar o código. A chave está selecionada: copie pelo menu do navegador.",
}

const STEPS = ["Abra o app do seu banco", "Entre na área Pix", "Leia o QR Code ou cole a chave"]

const label = "font-mono text-[13px] text-ink-soft"

/**
 * The Pix card: recipient, key and both copy buttons first, the QR last (PIX-26). From 1024px the QR moves to the
 * left column and is always shown (PIX-25); below that it opens from a toggle (PIX-27..PIX-29).
 */
export function PixCard({ onCopied }: { onCopied: () => void }) {
  const key = useCopyText(2000, { fallback: true })
  const code = useCopyText(2000, { fallback: true })
  const [notice, setNotice] = useState<Notice>(null)
  const [open, setOpen] = useState(false)
  const keyRef = useRef<HTMLElement>(null)

  // With nothing copied, the key on screen is what is left: select it so the browser menu can copy it (PIX-09, PIX-18).
  const selectKey = () => {
    const range = document.createRange()
    range.selectNodeContents(keyRef.current!)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  const copy = async (which: "key" | "code") => {
    const ok = await (which === "key" ? key.copy(PIX.key) : code.copy(PIX_BR_CODE))
    if (ok) {
      setNotice(which)
      onCopied()
    } else {
      selectKey()
      setNotice(`${which}-failed`)
    }
  }

  const message =
    notice === "key" ? (key.copied ? "Chave Pix copiada" : "")
    : notice === "code" ? (code.copied ? "Código Pix copia e cola copiado" : "")
    : notice ? FAILED[notice]
    : ""

  return (
    <div className="flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-5 lg:flex-row lg:items-start lg:gap-10 lg:rounded-3xl lg:p-10">
      <div className="flex min-w-0 flex-col gap-[22px] lg:flex-1">
        <div className="flex flex-col gap-1.5">
          <p className={label}>Recebedor</p>
          <p className="text-lg font-semibold text-ink lg:text-xl">{PIX.name}</p>
          <p className="text-sm text-ink-soft">Confira este nome no app do banco antes de confirmar.</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className={label}>Chave Pix · celular</p>
          <div className="rounded-xl border border-line bg-bg px-4 py-3.5">
            <code ref={keyRef} data-selectable="" className="font-mono text-base text-ink lg:text-[17px]">
              {PIX.keyLabel}
            </code>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <CopyButton
            kind="primary"
            label="Copiar chave"
            copiedLabel="Copiada!"
            icon="copy"
            copied={key.copied}
            onClick={() => copy("key")}
            className="w-full lg:w-auto"
          />
          <CopyButton
            kind="secondary"
            label="Pix copia e cola"
            copiedLabel="Copiado!"
            icon="clipboard"
            copied={code.copied}
            onClick={() => copy("code")}
            className="w-full lg:w-auto"
          />
        </div>

        {/* One live region, its height kept so a message never pushes the steps (PIX-04, PIX-17). */}
        <p role="status" className="min-h-5 font-mono text-[13px] text-accent">
          {message}
        </p>

        <div className="flex flex-col gap-3 border-t border-line pt-5">
          <p className={label}>Como pagar</p>
          <ol className="flex flex-col gap-2 [counter-reset:step]">
            {STEPS.map((step) => (
              <li
                key={step}
                className="flex gap-2.5 text-[15px] leading-[22px] text-ink [counter-increment:step] before:font-mono before:text-[13px] before:text-accent before:[content:counter(step,decimal-leading-zero)]"
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div data-qr-column="" className="order-last flex flex-col gap-3 lg:order-first lg:w-[248px] lg:shrink-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="pix-qr-panel"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[52px] items-center justify-between gap-2.5 rounded-[14px] border border-line px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg lg:hidden"
        >
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-ink">Vai pagar de outro aparelho?</span>
            <span className="font-mono text-[13px] text-ink-soft">{open ? "Ocultar QR Code" : "Mostrar QR Code"}</span>
          </span>
          <ChevronDown aria-hidden="true" className={cn("h-4 w-4 shrink-0 text-ink transition-transform", open && "rotate-180")} />
        </button>

        <div id="pix-qr-panel" className={cn(open ? "flex" : "hidden", "flex-col items-center gap-3 lg:flex")}>
          {/* Light tile in both themes: the SVG brings its own 4-module quiet zone (PIX-21). */}
          <div className="rounded-2xl bg-white p-6">
            <Image
              src="/pix-qr.svg"
              alt={`QR Code Pix para pagar um café a ${PIX.name}`}
              width={200}
              height={200}
              unoptimized
            />
          </div>
          <p className="text-center text-[13px] text-ink-soft">
            <span className="lg:hidden">Escaneie com a câmera do outro aparelho</span>
            <span className="hidden lg:inline">Aponte a câmera do app do banco</span>
          </p>
        </div>
      </div>
    </div>
  )
}
