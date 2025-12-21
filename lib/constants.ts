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
  { id: SECTION_IDS.HOME, label: "Início" },
  { id: SECTION_IDS.ABOUT, label: "Sobre" },
  { id: SECTION_IDS.EXPERIENCE, label: "Experiência" },
  { id: SECTION_IDS.PROJECTS, label: "Projetos" },
  { id: SECTION_IDS.SKILLS, label: "Habilidades" },
  { id: SECTION_IDS.TESTIMONIALS, label: "Depoimentos" },
  { id: SECTION_IDS.CONTACT, label: "Contato" },
] as const

export const SOCIAL_LINKS = {
  github: "https://github.com/BrunomelloxD",
  linkedin: "https://linkedin.com/in/brunomelloxd/",
  email: "brunomello.ti@gmail.com",
} as const

export const PERSONAL_INFO = {
  name: "Bruno Mello",
  role: "Desenvolvedor Full Stack",
  location: "Maringá, PR, Brasil",
  experience: "+2 anos de experiência",
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
