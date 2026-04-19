export const SECTION_IDS = {
  HOME: "home",
  ABOUT: "sobre",
  EXPERIENCE: "experiencia",
  PROJECTS: "projetos",
  SKILLS: "habilidades",
  TESTIMONIALS: "depoimentos",
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

export const PERSONAL_INFO = {
  name: "Bruno Mello",
  role: "Engenheiro de Software Full Stack",
  location: "Mococa, SP / Maringá, PR, Brasil",
  experience: "+3 anos de experiência",
  experienceType: "Desenvolvimento Full Stack",
} as const

export const EDUCATION = [
  {
    degree: "Pós Graduação em Engenharia de Software",
    institution: "Faculdade Focus Brasil",
  },
  {
    degree: "Pós Graduação em Engenharia da Computação",
    institution: "Faculdade Focus Brasil",
  },
  {
    degree: "Analise e Desenvolvimento de Sistemas",
    institution: "Fatec São Paulo",
  },
] as const

export const SCROLL_THRESHOLD = 100
