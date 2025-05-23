"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FelipeSasakiProfile from "@/public/images/felipe-sasaki-profile.jpg"

const testimonials = [
  {
    id: 1,
    name: "Felipe Sasaki",
    role: "Software Engineer, IEBT Innovation",
    avatar: FelipeSasakiProfile.src,
    content:
      "Bruno é um profissional extremamente dedicado e ágil em suas entregas, sempre preocupado com boas práticas de desenvolvimento em seus projetos. Tive o privilégio de trabalhar como par em projetos importantes, e como grande amigo também. O recomendo com desenvolvimento Back-end, e desenvolvimento ágil.",
  }
]

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = useCallback(() => {
    setCurrent((current + 1) % testimonials.length)
  }, [current])

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [autoplay, next])

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 text-primary opacity-10">
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
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <blockquote className="text-xl md:text-2xl text-center italic mb-8">
                &ldquo;{testimonials[current].content}&rdquo;
              </blockquote>

              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 mb-4">
                  <AvatarImage
                    src={testimonials[current].avatar || "/placeholder.svg"}
                    alt={testimonials[current].name}
                  />
                  <AvatarFallback>{testimonials[current].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-bold text-lg">{testimonials[current].name}</div>
                  <div className="text-muted-foreground">{testimonials[current].role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Button variant="outline" size="icon" onClick={prev} className="rounded-full" aria-label="Depoimento anterior">
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
              className={`w-3 h-3 rounded-full transition-colors ${index === current ? "bg-primary" : "bg-muted"}`}
              aria-label={`Ir para depoimento ${index + 1}`}
            />
          ))}
        </div>

        <Button variant="outline" size="icon" onClick={next} className="rounded-full" aria-label="Próximo depoimento">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}