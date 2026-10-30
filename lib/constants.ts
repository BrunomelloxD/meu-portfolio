export const SECTION_IDS = {
  HOME: "home",
  ABOUT: "sobre",
  EXPERIENCE: "experiencia",
  PROJECTS: "projetos",
  SKILLS: "habilidades",
  TESTIMONIALS: "depoimentos",
  COFFEE: "cafe",
  CONTACT: "contato",
} as const

export const NAVIGATION_ITEMS = [
  { id: SECTION_IDS.HOME, label: "Início", icon: "Home" },
  { id: SECTION_IDS.ABOUT, label: "Sobre", icon: "User" },
  { id: SECTION_IDS.EXPERIENCE, label: "Experiência", icon: "Briefcase" },
  { id: SECTION_IDS.PROJECTS, label: "Projetos", icon: "FolderKanban" },
  { id: SECTION_IDS.SKILLS, label: "Habilidades", icon: "Code2" },
  { id: SECTION_IDS.TESTIMONIALS, label: "Depoimentos", icon: "MessageSquareQuote" },
  { id: SECTION_IDS.CONTACT, label: "Contato", icon: "Mail" },
] as const

export const SOCIAL_LINKS = {
  github: "https://github.com/BrunomelloxD",
  linkedin: "https://linkedin.com/in/brunomelloxd/",
  email: "brunomello.ti@gmail.com",
} as const

// The phone key goes into the BR Code as +55 + area code + number; keyLabel is only how it shows on screen.
export const PIX = {
  key: "+5519997119007",
  keyLabel: "+55 (19) 99711-9007",
  name: "Bruno de Oliveira Mello",
  city: "Mococa",
} as const

export const PERSONAL_INFO = {
  name: "Bruno Mello",
  role: "Engenheiro de Software Full Stack",
  location: "Mococa, SP / Maringá, PR, Brasil",
  experience: "+3 anos de experiência",
  experienceType: "Desenvolvimento Full Stack",
} as const

export const STATS = [
  { value: "3+", label: "Anos de experiência" },
  { value: "20+", label: "Projetos entregues" },
  { value: "10+", label: "Tecnologias dominadas" },
] as const

export const EDUCATION = [
  {
    degree: "Pós-graduação em Engenharia de Software",
    institution: "Faculdade Focus Brasil",
  },
  {
    degree: "Pós-graduação em Engenharia da Computação",
    institution: "Faculdade Focus Brasil",
  },
  {
    degree: "Análise e Desenvolvimento de Sistemas",
    institution: "Fatec São Paulo",
  },
] as const

export const SCROLL_THRESHOLD = 100
