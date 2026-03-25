# Module 5: Tokenização de Ativos — Design Spec

## Context

Module 5 ("Tokenização de Ativos") is the fifth educational module in the Laboratório de Mercado Financeiro platform. It teaches asset tokenization, blockchain fundamentals, smart contracts, and DLT through interactive simulators and case studies targeting MBA/finance students at COPPEAD/FGV/UCAM.

The original Streamlit implementation uses sidebar radio navigation with 9 sub-sections and session state. This spec defines the Next.js port with a stepper-based journey navigation (no sidebar), consolidated into 6 steps, all client-side computation, and consistent visual design with existing Modules 1–3.

## Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Navigation | Opening Hero + 6-step Stepper | Consolidates 9 sidebar sections; matches Module 3 pattern |
| Step consolidation | Merge Início→Hero, Riscos+Casos→Step 5, Contracts+Quiz→Step 6 | Reduces cognitive load; groups related content |
| Animation (8-stage journey) | Embed as iframe in Step 4 | ~700 lines of working React/Babel; rewriting is high risk, low reward |
| Blockchain hashing | Web Crypto API (SHA-256) | Native browser API, no dependencies; async with UI-thread yielding |
| Chain visualization | Custom SVG/CSS blocks | Lightweight, fits design system, fully interactive |
| Charts | Plotly.js for all | Consistent with Modules 1–3; react-plotly.js already installed |
| Hero kinetic | Tokenization Flow animation | Asset→Contract→Tokens flow with particles; represents full module concept |
| Quiz UX | Enhanced per-question feedback | More pedagogically useful than submit-all; shows explanations |
| State management | Per-step useState (Module 3 pattern) | Steps are independent; no cross-step shared state needed |

## Route Structure

```
src/app/modulo/5/
  └── page.tsx                      ← Single page: OpeningHero + StepperNav + step router

src/components/modulo5/
  ├── OpeningHero.tsx                ← Hero with badge, headline, CTA, TokenKinetic
  ├── TokenKinetic.tsx               ← Animated tokenization flow visual (Asset→Contract→Tokens)
  ├── StepperNav.tsx                 ← Adapted from Module 3 stepper (6 steps)
  ├── FundamentosStep.tsx            ← Step 1: concept cards + flow diagram + classifier
  ├── MecanicaStep.tsx               ← Step 2: fractionalization simulator
  ├── BlockchainSandboxStep.tsx      ← Step 3: mining + chain explorer + attack lab
  ├── CicloVidaStep.tsx              ← Step 4: lifecycle sim + animation embed
  ├── RiscosCasosStep.tsx            ← Step 5: stress-test heatmap + case studies
  ├── ContratosQuizStep.tsx          ← Step 6: Solidity code viewer + enhanced quiz
  ├── AnimacaoEmbed.tsx              ← iframe wrapper for 8-stage animation HTML
  └── charts/
      ├── TokenDistributionChart.tsx ← Plotly donut (token allocation)
      ├── LifecycleChart.tsx         ← Plotly line (price + dividends over months)
      ├── CashFlowChart.tsx          ← Plotly bar (bond annual cash flows)
      └── RiskHeatmap.tsx            ← Plotly heatmap (6 risk categories)

src/lib/tokenization/
  ├── blockchain.ts                  ← Block class, SHA-256 hashing, mining, chain validation
  ├── lifecycle-sim.ts               ← Monte Carlo price/dividend + bond simulation
  ├── risk-calc.ts                   ← Stress test impact calculations
  ├── constants.ts                   ← Steps, token classifications, quiz questions, distributions
  └── types.ts                       ← Shared TypeScript interfaces

public/animations/
  └── tokenization-journey.html      ← Existing 8-stage animation (served via iframe)
```

## State Management

Each step component manages its own state internally (`useState`, `useMemo`). The `page.tsx` only manages:
- Active step index (synced to URL `?step=N` via `useSearchParams`)
- Hero visibility
- Stepper rendering

This matches Module 3's pattern. Steps are independent — no cross-step shared state.

## URL State

The active step persists in URL search params (`/modulo/5?step=2`). This enables deep linking and bookmarking for students revisiting specific sections.

## Data Flow

All computation is client-side. No API routes needed.

### blockchain.ts

```typescript
interface Block {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
}

// SHA-256 via Web Crypto API (async)
async function calculateHash(block: Omit<Block, 'hash'>): Promise<string>

// Mining: iterates nonce until hash starts with `difficulty` zeros
// Batches 1000 nonce attempts per frame via requestAnimationFrame to avoid UI freeze
// Returns the mined block
async function mineBlock(block: Block, difficulty: number, onProgress?: (nonce: number) => void): Promise<Block>

function createGenesisBlock(): Block
async function addBlock(chain: Block[], data: string, difficulty: number): Promise<Block[]>
```

**Key difference from Python:** SHA-256 is async in the browser. Mining yields to the UI thread every 1000 iterations. Difficulty capped at 4 to prevent long waits.

### lifecycle-sim.ts

```typescript
// Real estate: monthly prices (random walk) + dividend yield
function simulateRealEstate(years: number, baseValue?: number, volatility?: number, yieldRate?: number): {
  months: number[];
  prices: number[];
  dividends: number[];
  totalDividends: number;
  capitalGain: number;
  roi: number;
}

// Bond: annual coupon payments with default probability
function simulateBond(years: number, parValue?: number, couponRate?: number, defaultProb?: number): {
  years: number[];
  cashFlows: number[];
  status: 'Adimplente' | 'Default (Calote)';
}
```

Uses seeded PRNG for reproducible results (port of Python's `np.random.seed(42)`).

### risk-calc.ts

```typescript
function calculateRiskImpacts(marketShock: number, techFail: boolean, regChange: boolean): {
  categories: string[];  // ['Mercado', 'Operacional', 'Cibernético', 'Regulatório', 'Liquidez', 'Custódia']
  impacts: number[];     // 0-100 scale
}
```

Pure function. Direct port of the Python stress logic.

### constants.ts

```typescript
const STEPS: Array<{ index: number; label: string; icon: string }>  // 6 entries

const TOKEN_CLASSIFICATIONS: Record<string, {
  tipo: string; regulacao: string; fracionalizacao: string; padrao: string;
}>  // 5 asset types

const QUIZ_QUESTIONS: Array<{
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}>  // 3 questions

const TOKEN_DISTRIBUTION: Array<{ stakeholder: string; percentage: number }>  // 4 entries
```

## Component Details

### Opening Hero (OpeningHero.tsx)

- **Badge:** "Módulo 5 Ativo" with `terminal` Material Symbol icon
- **Headline:** "Tokenização de **Ativos**" — "Ativos" in cyan→green gradient
- **Subtitle:** "Exploração da tecnologia blockchain para representação digital de ativos reais e aumento da liquidez de mercado."
- **CTA:** "Iniciar Jornada" button with `rocket_launch` icon → sets step to 0, scrolls to stepper
- **Kinetic (TokenKinetic.tsx):** Animated flow: real-world asset (building icon) → smart contract (document icon) → multiple token coins spreading out. Particles flow along the path. Styled in cyan/green gradient on dark surface.

### Step 1 — Fundamentos (FundamentosStep.tsx)

Three vertical sections within the step:

1. **Concept Cards:** 4 expandable glass-panel cards in a 2×2 grid:
   - "O que é um Token?" (expanded by default)
   - "Fungível vs. Não Fungível (NFT)"
   - "Ledger vs. Blockchain"
   - "Custódia (On-chain vs. Off-chain)"
   - Click to expand/collapse. Educational text inside each.

2. **Tokenization Flow Diagram:** Horizontal CSS/SVG flow:
   `Ativo Real (Imóvel, Recebível)` → `SPV / Veículo Legal` → `Smart Contract (Minting)` → `Distribuição (Carteira)`
   With labeled arrows: Formalização, Oraculização, Venda Primária.

3. **Token Classifier:** Dropdown selector (5 asset types: Títulos Públicos, Cotas de FIDC, Imóvel Real, Obra de Arte, Crédito de Carbono) → 4 metric cards showing Tipo, Regulação, Fracionalização, Padrão Técnico. Updates reactively on selection.

### Step 2 — Mecânica da Tokenização (MecanicaStep.tsx)

Two-column responsive layout:

**Left (inputs):**
- Asset name text input (default: "Edifício Faria Lima 2025")
- Valuation number input (R$, default: 10,000,000)
- Token count slider (100–1,000,000, default: 1,000)
- Token standard dropdown (ERC-20 Fungível / ERC-721 Único)
- Custody quality slider (3 levels: Baixa, Média, Alta)

**Right (outputs):**
- Price per token metric card
- Market cap metric card
- Plotly donut chart (TokenDistributionChart): 60% Investidores Varejo, 20% Emissor, 5% Taxa Plataforma, 15% Reserva Liquidez
- Risk flags section: warning/error/success cards based on token price and custody quality

All reactive — no submit button.

### Step 3 — Sandbox Blockchain (BlockchainSandboxStep.tsx)

**Top controls:**
- Transaction data text input (default: "Transação Inicial")
- Difficulty slider (1–4, default: 2)
- "Minerar Bloco" button (shows spinner + nonce counter during mining)
- "Reiniciar Blockchain" button

**Main area — Chain Explorer:**
- Custom SVG/CSS visualization: blocks rendered as dark glass-panel cards showing Index, Timestamp, Data (truncated), Hash (truncated), Previous Hash (truncated), Nonce
- Blocks connected left-to-right by gradient lines (cyan→green)
- Genesis block highlighted with distinct border color
- Horizontally scrollable when chain grows
- Click on a block to see full details in a popover/modal

**Bottom — Laboratório de Ataques:**
- Educational info panel explaining immutability: "If you alter Block #0's data, its hash changes, which invalidates Block #1's previous hash reference, cascading through the entire chain."

**State:** `blockchain: Block[]` in useState, initialized with genesis block.

### Step 4 — Ciclo de Vida (CicloVidaStep.tsx)

**Scenario toggle:** "Imóvel (Aluguel)" / "Título de Dívida (Debênture)"

**Imóvel path:**
- Period slider (1–10 years, default: 5)
- LifecycleChart (Plotly line): Token price + dividends over months
- Metrics panel: Total dividends, capital gain, ROI
- Smart contract payout explanation text

**Debênture path:**
- Period slider (1–10 years, default: 5)
- Default probability slider (0–20%, default: 2%)
- CashFlowChart (Plotly bar): Annual cash flows
- Status badge (Adimplente → green, Default → red)
- Event narrative on default

**Animation section (below simulator):**
- Section header: "Jornada da Tokenização — Animação Interativa"
- AnimacaoEmbed.tsx: iframe loading `tokenization-journey.html`, responsive height (min 700px)

### Step 5 — Riscos & Casos (RiscosCasosStep.tsx)

**Top half — Stress Test:**
- Controls: Market shock slider (0–100, default: 20), hack checkbox, regulatory change checkbox
- RiskHeatmap (Plotly heatmap): 6 categories (Mercado, Operacional, Cibernético, Regulatório, Liquidez, Custódia) with color scale green→red
- Caption: "Verde = Seguro | Vermelho = Crítico"

**Bottom half — Case Studies:**
- 3 tab-like toggles: "FIDC Tokenizado" / "Títulos do Tesouro (BUIDL)" / "Créditos de Carbono"
- Each tab: heading, narrative markdown, key metrics/callout boxes, lesson-learned callout
- Content ported directly from Python source

### Step 6 — Smart Contracts & Quiz (ContratosQuizStep.tsx)

**Top — Smart Contract Viewer:**
- Contract type selector: "Token Simples (ERC-20)" / "Restrição de Compliance (Whitelist)"
- ERC-20 variant: supply number input + symbol text input → dynamically generated Solidity code
- Whitelist variant: static Solidity code
- Syntax-highlighted code block (use a `<pre>` with CSS styling matching the dark theme)
- Caption with explanation below each variant

**Bottom — Enhanced Quiz:**
- Score counter at top: "X/3 corretas"
- 3 questions rendered sequentially (all visible, scroll down)
- Each question: radio options, "Verificar" button
- On verify: correct option highlighted green, wrong highlighted red, explanation card appears below
- After all 3 answered: summary card with score and performance message (3/3 → celebration, 2/3 → encouragement, ≤1 → suggestion to review)

## Visual Design

Follows the established design system:
- Dark theme (#111417 background, #e1e2e7 text)
- Primary #00f2ff (cyan), Secondary #4edea3 (green)
- Glass-panel cards (backdrop-filter: blur(20px))
- Manrope font throughout
- Material Symbols Outlined icons
- Tailwind CSS with the project's custom color tokens

## TypeScript Interfaces (types.ts)

```typescript
// Step configuration
export interface StepConfig {
  index: number;
  label: string;
  icon: string;  // Material Symbols name
}

// Blockchain
export interface Block {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
}

export interface MiningState {
  isMining: boolean;
  currentNonce: number;
  elapsedMs: number;
}

// Token classifier
export interface TokenClassification {
  tipo: string;
  regulacao: string;
  fracionalizacao: string;
  padrao: string;
}

// Fractionalization simulator
export interface MecanicaParams {
  assetName: string;
  valuation: number;
  fractionCount: number;
  standard: 'ERC-20' | 'ERC-721';
  custodyQuality: 'Baixa/Inexistente' | 'Média (Auditoria Anual)' | 'Alta (Banco Top-tier)';
}

export interface MecanicaResult {
  tokenPrice: number;
  marketCap: number;
  distribution: Array<{ stakeholder: string; quantidade: number }>;
  riskFlags: Array<{ level: 'warning' | 'error' | 'success'; message: string }>;
}

// Lifecycle simulation
export interface RealEstateResult {
  months: number[];
  prices: number[];
  dividends: number[];
  totalDividends: number;
  capitalGain: number;
  roi: number;
}

export interface BondResult {
  years: number[];
  cashFlows: number[];
  status: 'Adimplente' | 'Default (Calote)';
  defaultYear?: number;  // undefined if no default
}

// Risk matrix
export interface RiskImpactResult {
  categories: string[];
  impacts: number[];  // 0-100
}

// Quiz
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizState {
  answers: Record<number, number>;        // questionId → selectedIndex
  revealed: Record<number, boolean>;       // questionId → verified
  score: number;
}
```

## Seeded PRNG

JavaScript's `Math.random()` cannot be seeded. The lifecycle simulation uses a lightweight **mulberry32** PRNG implementation embedded in `lifecycle-sim.ts`:

```typescript
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

Default seed: 42 (matching the Python source). A "Re-simular" button re-rolls with `Date.now()` as seed for fresh randomness. No external dependency needed.

## New Dependencies

None. All functionality uses:
- `react-plotly.js` (already installed)
- Web Crypto API (native browser)
- Mulberry32 PRNG (inline, ~5 lines)

## Accessibility Requirements

- **StepperNav:** `role="tablist"` on container, `role="tab"` + `aria-selected` on each step button, `aria-controls` linking to panel (same pattern as Module 3's `StepperNav.tsx`)
- **Blockchain chain visualization:** Each block card includes `aria-label` with full block summary. Fallback data table rendered with `sr-only` class for screen readers
- **Quiz:** `role="radiogroup"` on each question, `aria-describedby` linking to explanation after reveal, `aria-live="polite"` on score counter
- **Risk heatmap:** `aria-label` on Plotly chart describing current risk levels; text summary below chart for screen readers
- **Animation iframe:** `title="Jornada da Tokenização — Animação Interativa"` attribute; fallback `<p>` inside `<noscript>` explaining the animation content
- **Color-blind safety:** Risk flags use icon + text labels (not color alone). Heatmap uses RdYlGn_r scale which is perceptually distinct; text overlays on cells reinforce values
- **Keyboard:** All interactive elements focusable and operable via keyboard. Mining button shows focus ring during operation

## Educational Content Strategy

Each step follows a consistent pattern for educational depth:
- **Lead with context:** A brief paragraph explaining what the section teaches and why it matters
- **Interactive first:** Simulators and inputs are the primary learning tool — students learn by doing
- **"Saiba mais" expandables:** Deep-dive explanations available via expandable cards (concept cards in Step 1, attack lab in Step 3, contract explanations in Step 6). These don't clutter the default view but reward curious students
- **Risk/consequence feedback:** Simulators show real-time consequences of parameter changes (risk flags in Step 2, default events in Step 4, stress heatmap in Step 5). This teaches cause-and-effect thinking

## Mining Timeout & Cancellation

- **Timeout:** Mining auto-cancels after 10 seconds (covers slow devices at difficulty 4). UI shows "Mineração cancelada — tente reduzir a dificuldade" toast
- **Cancellation:** "Reiniciar Blockchain" during active mining aborts via `AbortController`. The mining button is disabled while a mine operation is in progress
- **Progress:** During mining, the button text changes to "Minerando... (Nonce: {n})" with a spinner animation

## Bond Year-1 Default Edge Case

If default occurs on year 1, the chart shows a single bar at 0. The UI additionally shows:
- The `st.error`-equivalent red callout: "Default no primeiro ano — investidor perde 100% do capital"
- The status badge shows "Default (Calote) — Ano 1"
- An educational note: "Em casos reais, garantias e cláusulas de cross-default podem mitigar parcialmente esta perda"

## Animation Iframe Sandbox

`AnimacaoEmbed.tsx` renders the iframe with `sandbox="allow-scripts allow-same-origin"` since the animation HTML loads React, ReactDOM, and Babel from unpkg.com CDN. The `allow-same-origin` is needed for the external script loads to work.

## Quiz Answer Lock

After clicking "Verificar" for a question, the radio buttons for that question become disabled (locked). The user cannot change their answer after seeing the explanation. This matches a test-taking experience and prevents gaming the score.

## Responsive Design

- **StepperNav:** Desktop shows all 6 steps inline. Mobile (< 768px) collapses to current step number + label with left/right arrows (same as Module 3)
- **Step 2 (Mecânica):** Two-column layout stacks vertically on mobile (inputs on top, outputs below)
- **Step 3 (Blockchain):** Chain explorer scrolls horizontally on mobile with visible scroll indicator. Controls stack vertically
- **Step 4 (Ciclo de Vida):** Chart takes full width. Metrics panel moves below chart on mobile
- **Step 5 (Riscos):** Heatmap takes full width. Case study tabs stack as an accordion on mobile
- **Step 6 (Contracts):** Code block scrolls horizontally. Quiz questions take full width

## Implementation Order

Build and verify sequentially, each step validated before the next:

1. **Scaffolding:** `page.tsx`, `StepperNav.tsx`, `OpeningHero.tsx`, `TokenKinetic.tsx`, `constants.ts`, `types.ts` — verify: hero renders, stepper navigates, URL state works
2. **Step 1 — Fundamentos:** `FundamentosStep.tsx` — verify: cards expand/collapse, flow diagram renders, classifier updates reactively
3. **Step 2 — Mecânica:** `MecanicaStep.tsx`, `TokenDistributionChart.tsx` — verify: inputs drive outputs, chart updates, risk flags appear correctly
4. **Step 3 — Blockchain:** `blockchain.ts`, `BlockchainSandboxStep.tsx` — verify: mining produces valid hashes, chain visualizes correctly, timeout works
5. **Step 4 — Ciclo de Vida:** `lifecycle-sim.ts`, `CicloVidaStep.tsx`, `LifecycleChart.tsx`, `CashFlowChart.tsx`, `AnimacaoEmbed.tsx` — verify: both scenarios simulate correctly, animation iframe loads
6. **Step 5 — Riscos & Casos:** `risk-calc.ts`, `RiscosCasosStep.tsx`, `RiskHeatmap.tsx` — verify: stress test updates heatmap, case studies render
7. **Step 6 — Contracts & Quiz:** `ContratosQuizStep.tsx` — verify: code updates dynamically, quiz flow works with per-question feedback and locking
8. **Unit tests:** `blockchain.test.ts`, `lifecycle-sim.test.ts`, `risk-calc.test.ts`

## Testing Strategy

- **Unit tests** for `blockchain.ts` (hash calculation, mining with known outputs, chain validation, timeout)
- **Unit tests** for `lifecycle-sim.ts` (seeded simulation reproducibility, bond default at various probabilities, year-1 default edge case)
- **Unit tests** for `risk-calc.ts` (base impacts, all stress combinations)
- **Component smoke tests** for each step (renders without crashing)
- **Manual verification:** dev server visual check of each step's interactivity, responsive behavior at mobile breakpoints
