# Meu Portfólio — Bruno Mello

Portfólio profissional desenvolvido com Next.js 16, TypeScript e Tailwind CSS.
Disponível em produção: **[brunomellodev.com.br](https://www.brunomellodev.com.br)**

[![CI/CD](https://github.com/BrunomelloxD/meu-portfolio/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/BrunomelloxD/meu-portfolio/actions/workflows/ci-cd.yml)

---

## Sumário

- [Stack](#stack)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como rodar localmente](#como-rodar-localmente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [Pipeline CI/CD](#pipeline-cicd)
- [Deploy no Railway](#deploy-no-railway)
- [Variáveis de ambiente](#variáveis-de-ambiente)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Linguagem | TypeScript 5 |
| UI | Tailwind CSS 3 + shadcn/ui (Radix Primitives) |
| Animações | Framer Motion |
| Email | EmailJS |
| Testes | Vitest + Testing Library + jsdom |
| Cobertura | @vitest/coverage-v8 |
| Lint | ESLint 9 (flat config) |
| Deploy | Railway (Nixpacks) |
| CI/CD | GitHub Actions |
| Runtime | Node.js >= 20.9.0 |

---

## Estrutura do projeto

```
.
├── app/                    # App Router (Next.js)
│   ├── api/log-access/     # Route handler para logging de acesso
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── navigation/         # Side nav, theme toggle, mobile toggle
│   ├── sections/           # Hero, About, Footer
│   ├── ui/                 # Primitivos shadcn/ui
│   └── *.tsx               # Project grid, skills, testimonials, contact, etc.
├── hooks/                  # useActiveSection, useScrollTo
├── lib/
│   ├── services/           # access-log.service
│   ├── constants.ts        # Dados estáticos do portfólio
│   └── utils.ts            # cn() helper
├── test/mocks.tsx          # Mocks globais (framer-motion, next/image)
├── vitest.config.ts        # Configuração do Vitest e thresholds de coverage
├── vitest.setup.ts         # Setup global dos testes
├── railway.toml            # Configuração do build no Railway
└── .github/workflows/      # Pipeline CI/CD
```

Cada módulo testado tem uma pasta `__tests__/` co-localizada.

---

## Como rodar localmente

**Pré-requisitos:** Node.js >= 20.9.0 e npm.

```bash
git clone https://github.com/BrunomelloxD/meu-portfolio.git
cd meu-portfolio
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção |
| `npm start` | Inicia o servidor de produção (após `build`) |
| `npm run lint` | Executa o ESLint |
| `npm test` | Roda toda a suíte de testes uma vez |
| `npm run test:watch` | Roda os testes em modo watch |
| `npm run test:coverage` | Roda os testes e gera relatório de cobertura |
| `npm run test:ui` | Abre a UI interativa do Vitest |

---

## Testes

A suíte é executada com **Vitest + Testing Library** em ambiente **jsdom**.

### Cobertura atual

| Métrica | Valor | Threshold mínimo |
|---|---|---|
| Statements | ~97% | 90% |
| Branches | ~86% | 80% |
| Functions | ~96% | 90% |
| Lines | ~98% | 90% |

Os thresholds são aplicados no `vitest.config.ts`. Se o coverage cair abaixo, a pipeline falha.

### O que está coberto

- **`lib/`** — utilitários puros (`cn()`)
- **`lib/services/`** — chamadas externas com mock de `fetch`
- **`hooks/`** — comportamento e cleanup de listeners
- **`app/api/`** — route handlers do Next.js (extração de IP, fallbacks, error handling)
- **`components/`** — interações, acessibilidade e fluxos de UI

### O que está fora do escopo

- Componentes `components/ui/**` (primitivos do shadcn — testados upstream)
- `lib/constants.ts` (apenas dados estáticos)
- Testes E2E e visual regression (próximo passo: Playwright)

### Mocks globais

Carregados em [vitest.setup.ts](vitest.setup.ts):

- `framer-motion` — componentes que ignoram props de animação (sem re-mount entre interações)
- `next/image` — `<img>` simples
- `window.matchMedia` e `HTMLElement.scrollIntoView`

---

## Pipeline CI/CD

Definida em [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml). Disparada em todo `push` e `pull_request` na branch `master`.

```
            ┌──→  lint  ──┐
push/PR ────┤             ├──→  build  ──→  deploy (somente master push)
            └──→  test  ──┘
```

### Jobs

| Job | Quando roda | O que faz |
|---|---|---|
| `lint` | push + PR | `npm ci` + `npm run lint` |
| `test` | push + PR | `npm ci` + `npm run test:coverage` + upload do report como artifact (7 dias) |
| `build` | só se `lint` e `test` passarem | `npm ci` + `npm run build` |
| `deploy` | só na branch `master` após `build` OK | `railway up --service $RAILWAY_SERVICE` |

### Características

- **Concurrency control:** runs anteriores na mesma ref são canceladas automaticamente
- **Cache de npm:** `actions/setup-node@v5` reaproveita o `~/.npm` entre runs
- **Coverage como artifact:** o relatório HTML pode ser baixado da aba **Actions**
- **Environment do GitHub:** o job de deploy está vinculado ao environment `production`, permitindo configurar aprovações manuais e rastreabilidade no histórico de deploys
- **Sem deploy em PR:** apenas `push` na `master` dispara o deploy

### Configuração necessária no GitHub

Em **Settings → Secrets and variables → Actions**:

**Secret:**
- `RAILWAY_TOKEN` — Project Token gerado no dashboard do Railway (Settings → Tokens dentro do projeto, **não** o Account Token)

**Variable:**
- `RAILWAY_SERVICE` — Nome do serviço no Railway (ex: `meu-portfolio`)

---

## Deploy no Railway

Configuração em [railway.toml](railway.toml):

```toml
[build]
builder = "NIXPACKS"

[build.nixpacksPlan.variables]
NIXPACKS_NODE_VERSION = "20"
NIXPACKS_NO_CACHE = "1"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

### Pontos importantes

- **`NIXPACKS_NODE_VERSION = "20"`** — Next.js 16 exige Node >= 20. Sem isso, o Nixpacks usa Node 18 e o build quebra com `EBADENGINE`
- **`NIXPACKS_NO_CACHE = "1"`** — Desabilita os cache mounts do BuildKit em `node_modules/.cache`. Sem isso, o `npm ci` falha com `EBUSY: rmdir` porque o ponto de montagem não pode ser removido
- **Sem `buildCommand` customizado** — o Nixpacks auto-detecta Next.js e roda o build correto. Customizar gera conflito com o pipeline interno do builder
- **`.dockerignore`** — garante que `node_modules`, `.next` e arquivos de teste locais não sejam copiados para o build context

---

## Variáveis de ambiente

```env
# URL base da API externa de logging (opcional)
NEXT_PUBLIC_API_BASE_URL=
```

Configuradas no **Railway Dashboard → Service → Variables**.

---

## Licença

Projeto pessoal de portfólio. Sinta-se livre para se inspirar, mas não copie literalmente o conteúdo.
