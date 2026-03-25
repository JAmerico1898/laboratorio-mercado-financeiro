# Module 4: Banking as a Service (BaaS) — Design Spec

## Overview

Port Module 4 (Banking as a Service) from the Streamlit application (`python-code/module_04_baas.py`) to Next.js. This module is an educational walkthrough of BaaS concepts based on BCB Consulta Pública 108/2024 and 115/2025. It covers the BaaS ecosystem, business models, services, regulation, risks, opportunities, global landscape, an interactive business model simulator, and a knowledge quiz.

## Architecture

**Navigation:** Single vertical-scroll page with a sticky horizontal section nav bar. `IntersectionObserver` tracks which section is in view and highlights the corresponding nav pill. Clicking a pill smooth-scrolls to that section. On mobile, the nav bar scrolls horizontally with CSS fade indicators on edges.

**No sidebar.** All navigation is via the sticky pill bar below the hero.

**State management:** Simulator controls use local `useState` in `SimuladorSection`. Quiz answers and scoring use local `useState` in `QuizSection`. No global state needed — sections are independent.

**Charts:** All 5 charts (flow diagram, risk radar, global comparison, regulatory timeline, revenue breakdown donut) use `react-plotly.js` with dark theme styling matching the design system. All Plotly chart components must use `dynamic(() => import(...), { ssr: false })` since Plotly.js does not support SSR in Next.js.

**Client directive:** `page.tsx` and all interactive section components require `"use client"` at the top due to `useState`, `useRef`, and `IntersectionObserver` usage.

## Sections

The Hero is not a navigable section — it sits above the sticky nav. The nav contains **10 pills** for the 10 content sections below.

### Hero (OpeningHero) — above nav, not a pill target
- Module badge: "Módulo 4: Banking as a Service"
- Headline with gradient text
- Subtitle paragraph
- "Iniciar Jornada" CTA button (scrolls to first section)
- Follows opening page HTML design (`landing&opening_pages/modulo4_opening_page.html`)

### 1. Introdução
- "What is BaaS?" highlight card with explanation
- 3 metric cards: Instituições Prestadoras, Tomadores de Serviços, Clientes Finais
- "Por que Regular?" section: Contexto + Objetivos cards (2 columns)
- SaaS analogy highlight card (green variant)

### 2. Ecossistema BaaS
- Flow diagram (Plotly): 5 nodes (BCB, Banco, Middleware, Tomador, Cliente) with labeled edges
- 4 participant cards in 2x2 grid: Instituição Prestadora, Tomador, Middleware, BCB — each with icon, name, subtitle, responsibilities list
- Warning box: institutional responsibility notice

### 3. Modelos de Negócio
- Internal tab component with 2 tabs:
  - **Estruturas Operacionais:** 3 cards (Parceria Direta, Via Middleware, Banco Nativo API) with pros/cons
  - **Modelos de Receita:** 4 highlight cards (Intercâmbio, Depósitos, Crédito, Taxas de Plataforma)

### 4. Serviços BaaS
- 9 service cards in 3-column grid, each with: icon, name, status badge (color-coded: Previsto/Em Discussão/Em Avaliação/Futuro), description
- 3 expandable/collapsible panels for discussion topics: Subcredenciamento, ITP, eFX

### 5. Regulação BCB
- Regulatory timeline (Plotly): 5 events from Oct 2024 to 2025 with status colors
- Info box: current status (CP prorrogada)
- 6 regulatory principles cards in 2-column grid

### 6. Riscos
- Risk radar chart (Plotly): 6 risk categories, 2 traces (inherent risk vs. after mitigation)
- Legend card alongside the chart
- Synapse case study danger box with lesson learned

### 7. Oportunidades
- 6 opportunity cards in 3-column grid (Inclusão, Inovação, Novos Mercados, Diversificação, Eficiência, Competitividade)
- Embedded Finance future highlight card

### 8. Cenário Global
- Global comparison grouped bar chart (Plotly): 6 regions × 4 metrics
- Brazil highlight card (green variant) with position narrative
- 3 Brazil metric cards: Pix (150M+), Open Finance (45M+), Fintechs (1.500+)

### 9. Simulador BaaS
- Controls panel:
  - Dropdown: Tipo de Tomador (5 options)
  - Dropdown: Estrutura de Parceria (3 options)
  - Multi-select: Serviços Desejados (6 options, 3 default)
  - Slider: Volume de Clientes — slider range 10–1000 (in thousands), default 100. Actual client count = sliderValue × 1000
  - Slider: Ticket Médio Mensal (R$50–R$5000, step R$50)
- Results panel:
  - 4 metric cards: Investimento Inicial, Time to Market, Receita Mensal Estimada, Score de Risco
  - Revenue breakdown donut chart (Plotly): Intercâmbio / Float / Crédito
  - Recommendations section (conditional warnings/tips based on selections)

### 10. Quiz BaaS
- 5 multiple-choice questions (radio buttons)
- Submit button
- Score display: fraction, percentage, color-coded message (green ≥80%, amber ≥60%, red <60%)
- Questions are defined in `src/lib/baas/quiz.ts` for testability

## File Structure

```
src/app/modulo/4/page.tsx                  — Main page component
src/components/modulo4/
  OpeningHero.tsx                           — Hero section
  SectionNav.tsx                            — Sticky horizontal scroll nav
  sections/
    IntroducaoSection.tsx
    EcossistemaSection.tsx
    ModelosNegocioSection.tsx
    ServicosSection.tsx
    RegulacaoSection.tsx
    RiscosSection.tsx
    OportunidadesSection.tsx
    CenarioGlobalSection.tsx
    SimuladorSection.tsx
    QuizSection.tsx
  charts/
    FlowDiagram.tsx                         — Plotly flow diagram
    RiskRadar.tsx                            — Plotly radar chart
    GlobalComparison.tsx                     — Plotly grouped bar chart
    RegulatoryTimeline.tsx                   — Plotly timeline
    RevenueBreakdown.tsx                     — Plotly donut chart
src/lib/baas/
  index.ts                                  — Barrel re-export file
  simulator.ts                              — Pure calculation functions
  quiz.ts                                   — Quiz questions + scoring
  constants.ts                              — Service data, participants, etc.
  types.ts                                  — TypeScript interfaces
src/lib/__tests__/
  baas-simulator.test.ts
  baas-quiz.test.ts
```

## Calculation Logic (simulator.ts)

Pure functions ported from Python:

```typescript
// Base costs by partnership structure
const BASE_COST: Record<string, number> = {
  "Parceria Direta": 500_000,
  "Via Middleware": 150_000,
  "Banco Nativo API": 300_000,
};

// Base time-to-market (months)
const BASE_TTM: Record<string, number> = {
  "Parceria Direta": 12,
  "Via Middleware": 4,
  "Banco Nativo API": 6,
};

// Risk scores
const RISK_SCORE: Record<string, number> = {
  "Parceria Direta": 2,
  "Via Middleware": 4,
  "Banco Nativo API": 2,
};

// Investment = base cost + (number of services × 50,000)
function computeInvestment(structure: string, serviceCount: number): number

// TTM (months) = base TTM + number of services
function computeTTM(structure: string, serviceCount: number): number

// Revenue formulas (volumeClients is already multiplied by 1000):
//   interchange = clients × 0.015 × ticketMedio × 0.5  (only if "Cartão de Débito" in services)
//   float       = clients × ticketMedio × 0.3 × 0.01   (only if "Conta de Pagamento" in services)
//   credit      = clients × 0.1 × 2000 × 0.03          (only if "Crédito/Empréstimo" in services)
//   total       = interchange + float + credit
function computeMonthlyRevenue(services: string[], clientCount: number, ticketMedio: number): {
  interchange: number; float: number; credit: number; total: number;
}

// Risk score = RISK_SCORE[structure] (no computation, direct lookup)
function getRiskScore(structure: string): number

// Recommendation rules:
//   - If structure is "Via Middleware" AND services.length > 4 → warn to consider direct partnership
//   - If "Crédito/Empréstimo" in services → warn about correspondent regulation
//   - If volumeSlider > 500 (i.e., 500k+ clients) → suggest own infrastructure
function generateRecommendations(structure: string, services: string[], volumeSlider: number): string[]
```

## Quiz Logic (quiz.ts)

```typescript
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

// Questions copied verbatim from Python source (module_04_baas.py, line 485)
const QUIZ_QUESTIONS: QuizQuestion[] = [
  { question: "1. Qual é a principal responsabilidade da instituição prestadora no BaaS?",
    options: ["Marketing", "Licença regulatória e conformidade perante o BCB", "Desenvolvimento de APIs", "Design de UX"],
    correctIndex: 1 },
  { question: "2. O que a Emenda Durbin nos EUA criou em relação ao BaaS?",
    options: ["Obrigação de oferecer BaaS", "Arbitragem regulatória favorecendo bancos menores", "Proibição de middlewares", "Limite de clientes"],
    correctIndex: 1 },
  { question: "3. Qual o principal risco demonstrado pelo caso Synapse?",
    options: ["Custos baixos", "Falta de inovação", "Dependência e complexidade em múltiplas camadas", "Excesso de regulação"],
    correctIndex: 2 },
  { question: "4. Qual prazo foi estabelecido pela CP 115/2025 para contribuições?",
    options: ["31/01/2025", "28/02/2025", "31/03/2025", "30/04/2025"],
    correctIndex: 1 },
  { question: "5. O que é 'Embedded Finance'?",
    options: ["Financiamento de startups", "Serviços financeiros integrados em plataformas não-financeiras", "Banco digital tradicional", "Regulação de fintechs"],
    correctIndex: 1 },
];

// Handles missing answers gracefully — unanswered questions count as wrong
function scoreQuiz(answers: Record<number, number>): { score: number; total: number; percentage: number; }
```

## Design System Compliance

- Dark theme: `#111417` background, `#e1e2e7` text
- Primary: `#00f2ff` (cyan), Secondary: `#4edea3` (green)
- Glass-panel cards with `backdrop-filter: blur(20px)`
- Manrope font throughout
- Material Symbols Outlined icons
- Existing CSS classes: `.glass-panel`, `.gradient-text`, `.cyber-river`
- Plotly charts: transparent backgrounds, matching text/grid colors

## Responsive Design

- Section nav: horizontally scrollable pills with fade edges on mobile
- Card grids: 3-col → 2-col → 1-col on smaller breakpoints
- Simulator: controls stack above results on mobile
- Charts: full-width, auto-height

## Decisions

- **Animation section dropped:** `BaaSAnimation.jsx` not in repo. Can be added later.
- **No sidebar:** All navigation via sticky horizontal nav bar.
- **Full simulator:** All 5 controls + computed metrics + pie chart + recommendations.
- **All charts as Plotly.js:** Maintains interactivity parity with Streamlit version.
- **Scroll-based navigation:** `IntersectionObserver` for active section tracking.

## Testing Strategy

- `baas-simulator.test.ts`:
  - `computeInvestment`: each partnership structure, varying service counts (0, 1, 6)
  - `computeTTM`: each partnership structure, varying service counts
  - `computeMonthlyRevenue`: each service individually, all services, no services (should return all zeros), edge case with zero volume or zero ticket
  - `getRiskScore`: each partnership structure
  - `generateRecommendations`: middleware + >4 services, credit selected, volume >500, combinations
- `baas-quiz.test.ts`:
  - All correct answers → 100%
  - All wrong answers → 0%
  - Partial answers (e.g., 3/5)
  - Missing answers (fewer than 5 keys in answers map) → unanswered count as wrong
- Manual verification: visual inspection of each section, chart rendering, responsive breakpoints, Plotly chart dark theme styling
