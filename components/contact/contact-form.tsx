"use client"

import { useRef, useState, type ChangeEvent, type FormEvent } from "react"
import emailjs from "@emailjs/browser"
import { CtaButton } from "@/components/cta-button"
import { SOCIAL_LINKS } from "@/lib/constants"

type Field = "name" | "email" | "subject" | "message"
type Status = { success: boolean; message: string } | null

const EMPTY = { name: "", email: "", subject: "", message: "" }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldClass =
  "w-full rounded-input border border-line-strong bg-bg px-4 text-base text-ink placeholder:text-placeholder transition-colors duration-200 ease-out-strong focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent aria-[invalid=true]:border-danger"

export function ContactForm() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<Status>(null)
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    subject: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const found: Partial<Record<Field, string>> = {}
    for (const field of ["name", "email", "subject", "message"] as Field[]) {
      if (!form[field].trim()) found[field] = "Campo obrigatório."
    }
    if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) found.email = "Informe um email válido."
    return found
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    const first = (Object.keys(found) as Field[])[0]
    if (first) {
      refs[first].current?.focus()
      return
    }

    setIsSubmitting(true)
    setStatus(null)
    try {
      await emailjs.send(
        "service_l9gh4io",
        "template_9glmxg6",
        { name: form.name, reply_to: form.email, subject: form.subject, message: form.message },
        "_BM_m6y_iJjxDI60q",
      )
      setStatus({ success: true, message: "Mensagem enviada. Respondo em breve." })
      setForm(EMPTY)
    } catch (error) {
      console.error("Error sending email:", error)
      setStatus({
        success: false,
        message: `Não foi possível enviar. Tente de novo ou escreva para ${SOCIAL_LINKS.email}.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const field = (name: Field, label: string, props: { placeholder: string; type?: string; autoComplete?: string }) => {
    const errorId = `${name}-error`
    return (
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor={name} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {name === "message" ? (
          <textarea
            ref={refs.message}
            id={name}
            name={name}
            rows={5}
            required
            value={form[name]}
            onChange={handleChange}
            placeholder={props.placeholder}
            aria-invalid={errors[name] ? true : undefined}
            aria-describedby={errors[name] ? errorId : undefined}
            className={`${fieldClass} min-h-[140px] py-3.5`}
          />
        ) : (
          <input
            ref={refs[name] as React.RefObject<HTMLInputElement>}
            id={name}
            name={name}
            type={props.type ?? "text"}
            required
            value={form[name]}
            onChange={handleChange}
            placeholder={props.placeholder}
            autoComplete={props.autoComplete}
            spellCheck={name === "email" ? false : undefined}
            aria-invalid={errors[name] ? true : undefined}
            aria-describedby={errors[name] ? errorId : undefined}
            className={`${fieldClass} h-[52px]`}
          />
        )}
        {errors[name] && (
          <p id={errorId} className="text-sm text-danger">
            {errors[name]}
          </p>
        )}
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 md:gap-5 md:p-9"
    >
      <div className="flex flex-col gap-4 md:flex-row">
        {field("name", "Nome", { placeholder: "Seu nome", autoComplete: "name" })}
        {field("email", "Email", { placeholder: "seu.email@exemplo.com", type: "email", autoComplete: "email" })}
      </div>
      {field("subject", "Assunto", { placeholder: "Assunto da mensagem" })}
      {field("message", "Mensagem", { placeholder: "Sua mensagem…" })}

      <div role="status" aria-live="polite" className="empty:hidden">
        {status && <p className={status.success ? "text-success" : "text-danger"}>{status.message}</p>}
      </div>

      <CtaButton type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Enviando…" : "Enviar mensagem"}
      </CtaButton>
    </form>
  )
}
