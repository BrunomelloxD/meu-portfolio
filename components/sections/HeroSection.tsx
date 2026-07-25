import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PERSONAL_INFO, SECTION_IDS } from "@/lib/constants"

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void
}

function TerminalWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-secondary/50">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="p-4 leading-relaxed">{children}</div>
    </div>
  )
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section
      id={SECTION_IDS.HOME}
      className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-purple-950 via-background to-background"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-700/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-32 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block font-mono text-xs text-primary border border-primary/30 bg-primary/10 rounded-full px-3 py-1 mb-6">
            $ whoami
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{PERSONAL_INFO.name}</h1>
          <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground mb-6">{PERSONAL_INFO.role}</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Crio experiências digitais robustas com código limpo, arquitetura sólida e atenção aos detalhes.
            Especialista em React, NestJS, PHP e integração de sistemas complexos.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button size="lg" className="rounded-full" onClick={() => onNavigate(SECTION_IDS.PROJECTS)}>
              Ver Projetos
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" onClick={() => onNavigate(SECTION_IDS.CONTACT)}>
              Fale Comigo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-12">{PERSONAL_INFO.experience} em desenvolvimento Full Stack</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
        >
          <TerminalWindow title="portfolio.ts">
            <pre className="whitespace-pre-wrap">
              <span className="text-purple-400">export class</span> <span className="text-primary">Engineer</span> {"{"}
              {"\n  "}
              <span className="text-foreground">stack</span> = [<span className="text-green-400">&apos;React&apos;</span>,{" "}
              <span className="text-green-400">&apos;NestJS&apos;</span>, <span className="text-green-400">&apos;PHP&apos;</span>];
              {"\n\n  "}
              <span className="text-purple-400">build</span>(): Product {"{"}
              {"\n    "}
              <span className="text-purple-400">return</span> craft(this.stack, {"{ "}
              care: <span className="text-primary">true</span> {"}"});{"\n  "}
              {"}"}
              {"\n"}
              {"}"}
            </pre>
          </TerminalWindow>

          <TerminalWindow title="zsh">
            <pre className="whitespace-pre-wrap text-muted-foreground">
              <span className="text-foreground">$ whoami</span>
              {"\n"}&gt; bruno mello — full stack engineer{"\n\n"}
              <span className="text-foreground">$ status disponibilidade</span>
              {"\n"}
              <span className="text-green-400">✓</span> disponível para novos projetos{"\n"}
              <span className="text-green-400">✓</span> remoto ou presencial{"\n\n"}
              <span className="text-foreground">$ _</span>
            </pre>
          </TerminalWindow>
        </motion.div>
      </div>
    </section>
  )
}
