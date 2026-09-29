"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { PanelFrame } from "@/components/rpg/panel-frame"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FelipeSasakiProfile from "@/public/images/felipe-sasaki-profile.jpg"
import LucasLopesProfile from "@/public/images/lucas-lopes.jpg"

const testimonials = [
  {
    id: 1,
    name: "Felipe Sasaki",
    role: "Software Engineer, IEBT Innovation",
    avatar: FelipeSasakiProfile.src,
    content:
      "Bruno é um profissional extremamente dedicado e ágil em suas entregas, sempre preocupado com boas práticas de desenvolvimento em seus projetos. Tive o privilégio de trabalhar como par em projetos importantes, e como grande amigo também. O recomendo com desenvolvimento Back-end, e desenvolvimento ágil.",
  },
  {
    id: 2,
    name: "Lucas Lopes de Souza Guilha",
    role: "Desenvolvedor Full Stack, Gazin Tech",
    avatar: LucasLopesProfile.src,
    content:
      `Tive a oportunidade de trabalhar com o Bruno e posso dizer com tranquilidade que ele é um profissional extremamente proativo, ele não espera os problemas acontecerem: vai atrás, se antecipa e busca soluções práticas com agilidade e inteligência.

      Uma das qualidades que mais admiro nele é sua capacidade de aprender rápido. Mesmo diante de desafios complexos ou de tecnologias novas, ele mergulha no problema, estuda o necessário e entrega resultado com eficiência. Além disso, tem uma postura colaborativa e está sempre disposto a ajudar o time.

      Trabalhar com ele é saber que você pode contar com alguém comprometido, que não tem medo de arregaçar as mangas e fazer o que for preciso para o sucesso do projeto. Recomendo fortemente`,
  }
]

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = useCallback(() => {
    setCurrent((current + 1) % testimonials.length)
  }, [current])

  const TEN_SECONDS_IN_MILLISECONDS = 10000
  
  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay) return
    
    const interval = setInterval(next, TEN_SECONDS_IN_MILLISECONDS)
    return () => clearInterval(interval)
  }, [autoplay, next])

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 text-er-gold opacity-10">
        <Quote size={120} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <PanelFrame className="p-8 md:p-12">
            <blockquote className="font-serif italic text-xl md:text-2xl text-center text-er-text mb-8">
              &ldquo;{testimonials[current].content}&rdquo;
            </blockquote>

            <div className="flex flex-col items-center">
              <Avatar className="h-16 w-16 mb-4 border-2 border-er-gold/40">
                <AvatarImage
                  src={testimonials[current].avatar || "/placeholder.svg"}
                  alt={testimonials[current].name}
                />
                <AvatarFallback>{testimonials[current].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="font-display text-lg text-er-gold-bright">{testimonials[current].name}</div>
                <div className="text-er-muted">{testimonials[current].role}</div>
              </div>
            </div>
          </PanelFrame>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Button variant="gold-outline" size="icon" onClick={prev} className="rounded-full" aria-label="Depoimento anterior">
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrent(index)
                setAutoplay(false)
              }}
              className="p-2 group"
              aria-label={`Ir para depoimento ${index + 1}`}
            >
              <span className={`block w-3 h-3 rounded-full transition-all duration-300 ${index === current ? "bg-er-gold scale-125" : "bg-er-muted/40 group-hover:bg-er-muted"}`} />
            </button>
          ))}
        </div>

        <Button variant="gold-outline" size="icon" onClick={next} className="rounded-full" aria-label="Próximo depoimento">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}