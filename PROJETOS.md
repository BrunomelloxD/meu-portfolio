# Como Adicionar Projetos ao Portfólio

## 📸 Capturas de Tela

1. Faça screenshots dos seus projetos em produção
2. Salve as imagens na pasta `public/images/projects/`
3. Nomeie os arquivos de forma descritiva (ex: `ecommerce-alares.png`, `dashboard-financeiro.png`)
4. Tamanho recomendado: 1200x800px (proporção 3:2)

## 📝 Estrutura de Dados dos Projetos

Edite o arquivo `components/project-grid.tsx` e adicione seus projetos no array `projects`:

```typescript
{
  id: 1, // Número único sequencial
  title: "Nome do Projeto", // Nome curto e direto
  description: "Breve descrição do que o projeto faz e qual problema resolve. Máximo 2 frases.", // Seja conciso
  image: "/images/projects/nome-do-projeto.png", // Caminho da screenshot
  tags: ["Next.js", "TypeScript", "PostgreSQL"], // Tecnologias principais (máx. 5-6)
  category: "fullstack", // Opções: "fullstack", "frontend", "backend", "mobile"
  github: "https://github.com/BrunomelloxD/projeto", // Link do repo (opcional se privado)
  demo: "https://projeto-em-producao.com", // Link do projeto funcionando
}
```

## 🎯 Categorias Disponíveis

- **fullstack**: Projetos com frontend + backend
- **frontend**: Apenas frontend (SPA, websites, etc)
- **backend**: APIs, microserviços, etc
- **mobile**: Apps mobile (React Native, Flutter, etc)

## 💡 Dicas para Bons Projetos de Portfólio

1. **Escolha projetos que mostram suas skills principais**
   - Se é dev full stack, mostre projetos completos
   - Prefira projetos que você pode mostrar funcionando

2. **Qualidade > Quantidade**
   - 3-6 projetos bem feitos é melhor que 10 projetos simples
   - Cada projeto deve demonstrar algo diferente

3. **Descrições efetivas**
   - Foque no problema que resolve, não só nas tecnologias
   - Seja específico: "Dashboard para análise de vendas" é melhor que "Sistema web"

4. **Screenshots profissionais**
   - Use ferramentas como [Shots.so](https://shots.so) para criar mockups bonitos
   - Mostre a tela principal ou funcionalidade mais interessante
   - Considere usar gifs animados para mostrar interações

## 📋 Exemplo Completo

```typescript
const projects = [
  {
    id: 1,
    title: "E-commerce Alares Internet",
    description: "Plataforma completa de e-commerce para venda de planos de internet, com integração de pagamento, painel administrativo e sistema de tracking de pedidos.",
    image: "/images/projects/alares-ecommerce.png",
    tags: ["Next.js", "Nest.js", "PostgreSQL", "Stripe", "Prisma"],
    category: "fullstack",
    github: "https://github.com/BrunomelloxD/alares-ecommerce", // Omita se for privado
    demo: "https://www.alaresinternet.com.br",
  },
  {
    id: 2,
    title: "Dashboard Gazin Tech",
    description: "Sistema interno de gestão com visualização de métricas em tempo real, relatórios automatizados e gerenciamento de equipes.",
    image: "/images/projects/gazin-dashboard.png",
    tags: ["Angular", "Nest.js", "Docker", "PostgreSQL", "Chart.js"],
    category: "fullstack",
    // github: repositório privado, não incluir
    demo: "https://dashboard.gazin.com.br", // Substitua pelo link real ou omita se for interno
  },
  {
    id: 3,
    title: "Meu Portfólio Profissional",
    description: "Portfólio moderno e responsivo desenvolvido com Next.js 15, TypeScript e Tailwind CSS. Inclui modo escuro/claro e animações suaves.",
    image: "/images/projects/portfolio.png",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "frontend",
    github: "https://github.com/BrunomelloxD/meu-portfolio",
    demo: "https://brunomello.dev",
  },
]
```

## 🚀 Depois de Adicionar

1. Teste localmente: `npm run dev`
2. Verifique se as imagens carregam corretamente
3. Teste os filtros de categoria
4. Verifique se os links abrem corretamente
5. Faça um commit: `git commit -m "feat: adicionar projetos ao portfólio"`
6. Deploy!

## 📦 Ferramentas Úteis

- **Screenshots**: [Shots.so](https://shots.so), [Screely](https://screely.com)
- **Otimização de imagens**: [TinyPNG](https://tinypng.com), [Squoosh](https://squoosh.app)
- **GIFs**: [Screentogif](https://www.screentogif.com), [Recordit](https://recordit.co)
