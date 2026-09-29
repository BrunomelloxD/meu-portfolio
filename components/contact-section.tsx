"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import emailjs from '@emailjs/browser';
import { Send, Mail, Phone, MapPin, Flame } from "lucide-react"
import { PanelFrame } from "@/components/rpg/panel-frame"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean
    message?: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await emailjs.send(
        'service_l9gh4io',
        'template_9glmxg6',
        {
          name: formData.name,
          reply_to: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        '_BM_m6y_iJjxDI60q'
      )
      
      setIsSubmitting(false)
      setSubmitStatus({
        success: true,
        message: "Mensagem enviada com sucesso! Entrarei em contato em breve.",
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
      
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
      
    } catch (error) {
      setIsSubmitting(false)
      console.error("Error sending email:", error)
      setSubmitStatus({
        success: false,
        message: "Erro ao enviar mensagem. Tente novamente.",
      })
      
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Flame className="h-6 w-6 text-er-gold" />
          <h3 className="font-display text-2xl text-er-text">Acender a Graça</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Seu nome"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Assunto da mensagem"
              required
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Sua mensagem..."
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          {submitStatus && (
            <div
              className={`p-3 rounded-md ${
                submitStatus.success ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Enviando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviar Mensagem
              </span>
            )}
          </Button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h3 className="font-display text-2xl text-er-text mb-6">Sinais da Graça</h3>

        <div className="space-y-6">
          <PanelFrame className="p-6 flex items-start gap-4">
            <div className="bg-er-gold/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-er-gold" />
            </div>
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-er-gold-bright mb-1">Email</h4>
              <a
                href="mailto:brunomello.ti@gmail.com"
                className="text-er-muted hover:text-er-gold transition-colors"
              >
                brunomello.ti@gmail.com
              </a>
            </div>
          </PanelFrame>

          <PanelFrame className="p-6 flex items-start gap-4">
            <div className="bg-er-gold/10 p-3 rounded-full">
              <Phone className="h-6 w-6 text-er-gold" />
            </div>
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-er-gold-bright mb-1">Telefone</h4>
              <a href="tel:+5519997119007" className="text-er-muted hover:text-er-gold transition-colors">
                +55 (19) 99711-9007
              </a>
            </div>
          </PanelFrame>

          <PanelFrame className="p-6 flex items-start gap-4">
            <div className="bg-er-gold/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-er-gold" />
            </div>
            <div>
              <h4 className="font-display text-sm uppercase tracking-wide text-er-gold-bright mb-1">Localização</h4>
              <p className="text-er-muted">Mococa, SP / Maringá, PR, Brasil</p>
              <p className="text-sm text-er-muted mt-1">Disponível para trabalho remoto/presencial, e reuniões presenciais</p>
            </div>
          </PanelFrame>
        </div>
      </motion.div>
    </div>
  )
}
