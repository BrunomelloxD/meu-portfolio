export interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  repos: { label: string; url: string }[]
  demo: string
}

export interface Experience {
  role: string
  company: string
  period: string
  stackSummary: string
  highlights: string[]
  technologies: string[]
}

export interface SkillCategory {
  label: string
  skills: string[]
}

export interface Testimonial {
  name: string
  role: string
  avatar: string
  paragraphs: string[]
}

export const projects: Project[] = [
  {
    title: "Animal Helper",
    description:
      "Plataforma fullstack que conecta quem quer adotar às ONGs de resgate da região, com mapa, perfil dos animais e contato pelo WhatsApp. Monorepo com Next.js como BFF e API em Nest.js.",
    image: "/images/projects/animal-helper.png",
    tags: ["Next.js", "Nest.js", "TypeScript", "PostgreSQL", "Prisma", "Docker"],
    repos: [{ label: "Monorepo", url: "https://github.com/BrunomelloxD/ongs-de-resgate-map" }],
    demo: "https://web-production-3794f.up.railway.app/",
  },
  {
    title: "TypeRacer",
    description:
      "Aplicação fullstack de corrida de digitação em tempo real. Frontend interativo e API com WebSockets para multiplayer.",
    image: "/images/projects/typeracer.png",
    tags: ["React", "TypeScript", "Tailwind CSS", "Nest.js", "WebSocket"],
    repos: [
      { label: "Frontend", url: "https://github.com/BrunomelloxD/typeracer-front" },
      { label: "API", url: "https://github.com/BrunomelloxD/typeracer-api" },
    ],
    demo: "https://typeracer-front-production.up.railway.app/",
  },
  {
    title: "Speed Test",
    description:
      "Aplicação fullstack para medir a velocidade da conexão de internet em tempo real. Frontend em React + Vite e API em Nest.js com PostgreSQL.",
    image: "/images/projects/speed-test.png",
    tags: ["React", "Vite", "Tailwind CSS", "Nest.js", "PostgreSQL"],
    repos: [
      { label: "Frontend", url: "https://github.com/BrunomelloxD/front-speed-test" },
      { label: "API", url: "https://github.com/BrunomelloxD/api-speed-test" },
    ],
    demo: "https://front-speed-test-production.up.railway.app/",
  },
]

// Source: Curriculo_Bruno_Mello_PT-BR.pdf (2026-10). Júnior I has no technology line in the CV;
// its list is the one the portfolio already showed for that period.
export const experiences: Experience[] = [
  {
    role: "Engenheiro de Software Sênior",
    company: "Grupo UND",
    period: "05/2026 — Presente",
    stackSummary: "Vue & Laravel",
    highlights: [
      "Desenvolvimento full stack de aplicações web, com responsabilidade sobre back-end e front-end das entregas.",
      "Otimização de dashboards e métricas que sofriam com lentidão e timeouts: implementei uma rotina que consulta o AWS Athena periodicamente e persiste os resultados agregados no PostgreSQL, eliminando COUNT, GROUP BY e SUM pesados a cada acesso. Resultado: até 90% de redução no tempo das consultas.",
      "Reestruturação da geração de grandes relatórios em Excel, que apresentavam timeout e alto consumo de memória: processamento assíncrono via fila, streaming na leitura dos dados e na escrita do arquivo, armazenamento no S3 e envio do link de download ao usuário.",
      "Integração estruturada de IA ao fluxo de trabalho com Claude Code em abordagem SDD, especificando e documentando as soluções antes da implementação.",
    ],
    technologies: ["JavaScript", "TypeScript", "Vue", "Laravel", "SQL", "PostgreSQL", "AWS Athena", "AWS S3", "Docker", "Git", "Scrum/Kanban"],
  },
  {
    role: "Desenvolvedor Júnior III",
    company: "Gazin Tech",
    period: "10/2025 — 05/2026",
    stackSummary: "Angular & NestJS",
    highlights: [
      "Definição autônoma do desenho técnico de partes do sistema, além da implementação.",
      "Planejamento e desenvolvimento de novas funcionalidades do sistema de renegociação de títulos, com decisões de arquitetura do desenho à entrega.",
      "Integração do fluxo de cadastro de clientes a três bureaus externos de crédito: Serasa, SPC e Unico.",
      "Implementação de avisos automáticos em canais do Teams via webhook.",
    ],
    technologies: ["JavaScript", "TypeScript", "Angular", "React Native", "Next.js", "ExtJS", "NestJS", "PHP", "Laravel", "Symfony", "Slim", "SQL", "Docker", "Git", "Scrum/Kanban"],
  },
  {
    role: "Desenvolvedor Júnior I",
    company: "Gazin Tech",
    period: "05/2024 — 10/2025",
    stackSummary: "Angular & PHP",
    highlights: [
      "Manutenção e evolução de sistemas internos, com foco em estabilidade e integração entre serviços.",
      "Implementação e validação de regras de negócio no domínio de crédito e renegociação de títulos.",
      "Resolução de um bug crítico em sistema legado com poucos logs: parcelas estornadas voltavam parcialmente porque outro sistema permitia pagá-las e acionava uma função no banco que as reativava. Identifiquei os clientes afetados, estornei os pagamentos indevidos e implementei uma validação que só permite pagar títulos de renegociação existentes e vigentes.",
    ],
    technologies: ["Angular", "React Native", "Next.js", "ExtJS", "NestJS", "PHP", "Laravel", "Symfony", "Slim", "Docker", "TypeScript", "SQL", "Git"],
  },
  {
    role: "Desenvolvedor Júnior",
    company: "Alares Internet",
    period: "04/2023 — 05/2024",
    stackSummary: "NestJS & Elasticsearch",
    highlights: [
      "Projeto, arquitetura e desenvolvimento da API completa do e-commerce da Alares Internet, com responsabilidade pelo back-end da plataforma.",
      "Criação do zero do sistema de Flyers Digitais da empresa, da concepção à implementação.",
      "Envio de eventos de comportamento do usuário (cliques e interações) para o Elasticsearch, alimentando dashboards de analytics.",
    ],
    technologies: ["Node.js", "NestJS", "PHP", "Laravel", "JavaScript", "TypeScript", "SQL", "Prisma ORM", "Docker", "Git", "Elasticsearch"],
  },
]

export const skillCategories: SkillCategory[] = [
  {
    label: "Frontend",
    skills: ["React", "Angular", "TypeScript", "JavaScript", "Ext JS", "React Native", "HTML/CSS", "Tailwind CSS", "Next.js", "Jest"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Express", "NestJS", "PHP", "Laravel", "Symfony", "Zend Framework", "PHPUnit", "REST API", "SQL"],
  },
  {
    label: "Dados & DevOps",
    skills: ["Git", "Docker", "CI/CD", "Agile/Scrum", "Jira", "Performance", "Acessibilidade", "ElasticSearch"],
  },
]

export const testimonials: Testimonial[] = [
  {
    name: "Lucas Lopes de Souza Guilha",
    role: "Desenvolvedor Full Stack, Gazin Tech",
    avatar: "/images/lucas-lopes.jpg",
    paragraphs: [
      "Tive a oportunidade de trabalhar com o Bruno e posso dizer com tranquilidade que ele é um profissional extremamente proativo, ele não espera os problemas acontecerem: vai atrás, se antecipa e busca soluções práticas com agilidade e inteligência.",
      "Uma das qualidades que mais admiro nele é sua capacidade de aprender rápido. Mesmo diante de desafios complexos ou de tecnologias novas, ele mergulha no problema, estuda o necessário e entrega resultado com eficiência. Além disso, tem uma postura colaborativa e está sempre disposto a ajudar o time.",
      "Trabalhar com ele é saber que você pode contar com alguém comprometido, que não tem medo de arregaçar as mangas e fazer o que for preciso para o sucesso do projeto. Recomendo fortemente",
    ],
  },
  {
    name: "Thiago André",
    role: "Engenheiro Desenvolvedor Full Stack Sênior",
    avatar: "/images/thiago-andre.jpg",
    paragraphs: [
      "Trabalhar com o Bruno é contar com alguém que se destaca não só pela inteligência e rapidez, mas principalmente pela atitude. É extremamente proativo, sempre disposto a ajudar em qualquer demanda e encara desafios com energia e responsabilidade.",
      "Além disso, demonstra forte dedicação, aprende rápido e contribui de forma colaborativa com o time, tornando o ambiente mais produtivo e positivo. Um profissional confiável e com grande potencial de crescimento.",
    ],
  },
  {
    name: "Felipe Sasaki",
    role: "Software Engineer, IEBT Innovation",
    avatar: "/images/felipe-sasaki-profile.jpg",
    paragraphs: [
      "Bruno é um profissional extremamente dedicado e ágil em suas entregas, sempre preocupado com boas práticas de desenvolvimento em seus projetos. Tive o privilégio de trabalhar como par em projetos importantes, e como grande amigo também. O recomendo com desenvolvimento Back-end, e desenvolvimento ágil.",
    ],
  },
]

export const PULL_QUOTE = {
  text: "Ele não espera os problemas acontecerem: vai atrás.",
  author: "Lucas Lopes de Souza Guilha",
  company: "Gazin Tech",
}

export const SKILLS_CAPTION =
  "A stack que uso todos os dias para construir produtos completos, do banco de dados à interface."
