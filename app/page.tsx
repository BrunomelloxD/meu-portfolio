"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, ChevronRight, Moon, Sun, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Image from 'next/image'
import ExperienceTimeline from "@/components/experience-timeline"
// import ProjectGrid from "@/components/project-grid"
import SkillsCloud from "@/components/skills-cloud"
import TestimonialCarousel from "@/components/testimonial-carousel"
import ContactSection from "@/components/contact-section"
import ProfileImage from "@/public/images/profile-img.jpg"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Aguarda a hidratação estar completa
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "sobre", "experiencia", "projetos", "habilidades", "depoimentos", "contato"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "h-10 px-4 py-2",
          sm: "h-9 rounded-md px-3",
          lg: "h-11 rounded-md px-8",
          icon: "h-10 w-10",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  )

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Renderiza um placeholder até a hidratação estar completa
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Navigation Toggle */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-primary text-primary-foreground md:hidden"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-primary-foreground md:hidden"
        aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
      >
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Side Navigation */}
      <nav
        className={`fixed top-0 left-0 h-full bg-card border-r border-border text-card-foreground z-40 transition-all duration-300 ease-in-out shadow-xl group
        ${isMenuOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-20 md:hover:w-64"}`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo/Avatar Section */}
          <div className="flex items-center py-8 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
              <Image src={ProfileImage.src} alt="Bruno Mello" className="w-full h-full rounded-full object-cover" width={48} height={48} />
            </div>
            <h1
              className={`ml-3 font-bold text-xl text-foreground transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isMenuOpen
                  ? "opacity-100 w-auto"
                  : "opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto md:group-hover:ml-3"
              }`}
            >
              Bruno Mello
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="mt-8 flex-1 space-y-2">
            {[
              { id: "home", label: "Início" },
              { id: "sobre", label: "Sobre" },
              { id: "experiencia", label: "Experiência" },
              // { id: "projetos", label: "Projetos" },
              { id: "habilidades", label: "Habilidades" },
              { id: "depoimentos", label: "Depoimentos" },
              { id: "contato", label: "Contato" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 text-left group/item
                  ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <ChevronRight
                  size={20}
                  className={`transition-transform duration-200 flex-shrink-0 ${
                    activeSection === item.id ? "rotate-90" : ""
                  }`}
                />
                <span
                  className={`ml-2 transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    isMenuOpen ? "opacity-100 w-auto" : "opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Theme Toggle and Social Links */}
          <div className="mt-auto pt-4 border-t border-border">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center p-3 rounded-lg text-foreground hover:bg-muted transition-all duration-300 group/theme"
              aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
            >
              {theme === "dark" ? (
                <Sun size={20} className="flex-shrink-0" />
              ) : (
                <Moon size={20} className="flex-shrink-0" />
              )}
              <span
                className={`ml-2 transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  isMenuOpen ? "opacity-100 w-auto" : "opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto"
                }`}
              >
                {theme === "dark" ? "Tema Claro" : "Tema Escuro"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-20 transition-all duration-300">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-secondary/20 to-transparent opacity-50"></div>
          </div>

          <div className="container mx-auto px-4 py-12 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                Bruno <span className="text-primary">Mello</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground mb-6">
                Desenvolvedor Full Stack
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl">
                Criando experiências digitais excepcionais com código limpo e design intuitivo. Especializado em React,
                Nest.js e arquitetura de sistemas modernos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="https://www.github.com/BrunomelloxD" target="_blank" className={cn(buttonVariants({ variant: "default", size: "lg" }))}>
                  Ver Projetos
                </Link>
                <Button size="lg" variant="outline" onClick={() => scrollToSection("contato")}>
                  Fale Comigo
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 border border-primary"
              onClick={() => scrollToSection("sobre")}
              aria-label="Rolar para baixo"
            >
              <ChevronRight className="rotate-90" />
            </Button>
          </div>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div className="relative">
                <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-primary">
                  <Image
                    src={ProfileImage.src}
                    alt="Bruno Mello"
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-lg shadow-lg border border-border">
                  <p className="font-medium">+2 anos de experiência</p>
                  <p className="text-sm text-muted-foreground">Desenvolvimento Full Stack</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <span className="w-12 h-1 bg-primary mr-4"></span>
                  Sobre Mim
                </h2>
                <p className="text-lg mb-4">
                  Olá! Sou Bruno, um desenvolvedor full stack apaixonado por criar soluções
                  digitais que combinam funcionalidade e estética.
                </p>
                <p className="text-lg mb-4">
                  Com mais de 2 anos de experiência no mercado, já trabalhei em diversos projetos, desde startups até
                  grandes empresas, sempre buscando inovação e excelência técnica.
                </p>
                <p className="text-lg mb-6">
                  Minha abordagem combina pensamento estratégico, design centrado no usuário e desenvolvimento técnico
                  sólido para criar produtos que realmente fazem a diferença.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <h3 className="font-bold text-xl mb-2">Educação</h3>

                    <p className="text-muted-foreground">Pós Graduação em Engenharia de Software</p>
                    <p className="text-sm">Faculdade Focus Brasil</p>

                    <br />

                    <p className="text-muted-foreground">Pós Graduação em Engenharia da Computação</p>
                    <p className="text-sm">Faculdade Focus Brasil</p>

                    <br />

                    <p className="text-muted-foreground">Analise e Desenvolvimento de Sistemas</p>
                    <p className="text-sm">Faculdade de Tecnologia de Mococa - Fatec Mococa</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Localização</h3>
                    <p className="text-muted-foreground">Mococa, SP, Brasil - Maringá, PA, Brasil</p>
                    <p className="text-sm">Disponível para trabalho remoto e presencial</p>
                  </div>
                </div>

                <Button onClick={() => scrollToSection("experiencia")}>Minha Experiência</Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experiencia" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Minha Jornada Profissional</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Um histórico das empresas e projetos que contribuíram para minha experiência e crescimento profissional.
              </p>
            </div>

            <ExperienceTimeline />
          </div>
        </section>

        {/* Projects Section */}
        {/* <section id="projetos" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Projetos em Destaque</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Uma seleção dos meus melhores trabalhos, demonstrando minhas habilidades e experiência em diferentes
                áreas.
              </p>
            </div>

            <ProjectGrid />
          </div>
        </section> */}

        {/* Skills Section */}
        <section id="habilidades" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Minhas Habilidades</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tecnologias e ferramentas que domino e utilizo para criar soluções digitais de alta qualidade.
              </p>
            </div>

            <SkillsCloud />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="depoimentos" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">O Que Dizem Sobre Mim</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Feedback de clientes e colegas com quem tive o prazer de trabalhar ao longo da minha carreira.
              </p>
            </div>

            <TestimonialCarousel />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contato" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Vamos Conversar</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Interessado em trabalhar juntos? Entre em contato para discutirmos seu projeto ou oportunidade.
              </p>
            </div>

            <ContactSection />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-muted-foreground">©2025 Bruno Mello. Todos os direitos reservados.</p>
              </div>

              <div className="flex space-x-4">
                <a href="https://github.com/BrunomelloxD" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Github size={18} />
                  </Button>
                </a>
                <a href="https://linkedin.com/in/brunomelloxd/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Linkedin size={18} />
                  </Button>
                </a>
                <a href="mailto:brunomello.ti@gmail.com" aria-label="Email">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Mail size={18} />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
