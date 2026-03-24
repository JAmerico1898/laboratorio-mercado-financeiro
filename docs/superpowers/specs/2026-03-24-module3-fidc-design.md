# Module 3: FIDC Builder 175 — Design Spec

## Context

Module 3 ("Fundos de Direitos Creditórios") is the third educational module in the Laboratório de Mercado Financeiro platform. It teaches FIDC structuring through 5 progressive sub-modules covering economic viability, class architecture under CVM 175/2022, subordination mechanics, regulatory compliance, and operational flow visualization.

The original Streamlit implementation uses sidebar radio navigation and session state. This spec defines the Next.js port with a stepper-based journey navigation (no sidebar), all client-side computation, and consistent visual design with existing Modules 1 & 2.

## Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Navigation | Stepper Journey | Matches "Jornada de Estruturação" branding; progressive educational flow |
| Animation (Sub-5) | Embed existing HTML | ~800 lines of working Three.js; rewriting is high risk, low reward |
| Class diagrams (Sub-2) | dagre + custom SVG | dagre for layout, custom SVG rendering (dagre-d3 is unmaintained) |
| Checklist UX (Sub-4) | Progressive Reveal | Sections unlock sequentially; catches invalid combos early |
| Hero visual | FIDC Flow + Waterfall Kinetic | Animated diagram consistent with Module 1 & 2 kinetics |
| Charts | Plotly.js | Consistent with existing modules; react-plotly.js already installed |

## Route Structure

```
src/app/modulo/3/
  └── page.tsx              ← Single page: OpeningHero + StepperNav + sub-module router

src/components/modulo3/
  ├── OpeningHero.tsx        ← Hero with badge, headline, CTA, FidcKinetic
  ├── FidcKinetic.tsx        ← Animated FIDC flow + waterfall bars visual
  ├── StepperNav.tsx         ← Numbered step nav (1-5) with prev/next (sticky)
  ├── ViabilidadeModule.tsx  ← Sub-module 1: breakeven analysis
  ├── ClassesModule.tsx      ← Sub-module 2: CVM 175 class architect
  ├── SubordinacaoModule.tsx ← Sub-module 3: loss waterfall simulator
  ├── ChecklistModule.tsx    ← Sub-module 4: regulatory compliance navigator
  ├── AnimacaoModule.tsx     ← Sub-module 5: Three.js iframe embed
  └── charts/
      ├── WaterfallChart.tsx          ← Plotly waterfall (revenue → costs → result)
      ├── SensitivityChart.tsx        ← Plotly line (margin vs PL)
      ├── CapitalStructureChart.tsx   ← Plotly stacked bar (before/after loss)
      ├── RuptureChart.tsx            ← Plotly stacked area (loss sensitivity)
      ├── ClassHierarchyDiagram.tsx   ← dagre + custom SVG tree (fund → classes → subclasses)
      └── TimelineChart.tsx           ← Plotly scatter/gantt (registration timeline)

src/lib/fidc/
  ├── viabilidade-calc.ts  ← Revenue, costs, margin, breakeven calculations
  ├── subordinacao-calc.ts ← Loss absorption waterfall logic
  ├── checklist-logic.ts   ← Validation rules, timeline estimation, cost tables
  └── types.ts             ← Shared TypeScript interfaces
```

### State Management

Each sub-module component manages its own state internally (`useState`, `useMemo`). This is a deliberate deviation from Modules 1/2 (which centralize state in `page.tsx`) because Module 3's 5 sub-modules are independent — their state doesn't need to be shared across steps. The `page.tsx` only manages: active step index (synced to URL `?step=N`), hero visibility, and stepper rendering.

### URL State

The active step persists in URL search params (`/modulo/3?step=2`). This enables deep linking and bookmarking — important for an educational tool where students may revisit specific sections.

## Data Flow

All computation is client-side. No API routes needed (unlike Module 1 ETTJ).

```
User Input (sliders, checkboxes, selects)
    → React useState
    → useMemo with calc functions (viabilidade-calc.ts, subordinacao-calc.ts, etc.)
    → Plotly/dagre chart props
    → Reactive visualization
```

## Component Designs

### OpeningHero

Matches the HTML reference at `landing&opening_pages/modulo3_opening_page.html`:
- Badge: pulsing cyan dot + "Módulo 3: Securitização"
- Headline: "Fundos de Direitos Creditórios" with "(FIDC)" in cyan
- Description paragraph about FIDC as financing alternative
- CTA button: "Iniciar Jornada" → scrolls to stepper and activates step 1
- Right side: FidcKinetic animated visual (hidden on mobile)

### FidcKinetic

Animated diagram showing:
- 3 entities: Cedente (blue), FIDC (orange), Sacados (green) as styled boxes
- Animated flow arrows between entities (CSS keyframes)
- Below: waterfall-style bars representing capital structure layers
- Subtle pulse animation loop

### StepperNav

Horizontal numbered stepper:
- 5 steps: Viabilidade, Classes, Subordinação, Checklist, Animação
- Active step: cyan filled circle + label
- Completed steps: cyan outline + checkmark
- Future steps: gray outline + number
- Connecting lines between steps (cyan for completed, gray for future)
- Prev/Next buttons at bottom of content area
- All steps are clickable for free navigation (no linear lock)
- Responsive: on mobile, collapses to show current step number + name with dropdown

### Sub-Module 1: Viabilidade Econômica

**Purpose:** Show why small FIDCs are economically unviable through breakeven analysis.

**Layout:** Two-column (controls left, visualization right; stacks on mobile)

**Controls (left column):**
- Slider: PL Target (R$ 5M-100M, step R$ 5M)
- Slider: Average Yield (8%-25% a.a., step 0.5%)
- Expandable section: cost configuration
  - Audit cost (R$ default 45k)
  - Rating cost (R$ default 35k)
  - CVM/Anbima fees (R$ default 15k)
  - Legal setup (R$ default 80k, amortized 3 years)
  - Other fixed (R$ default 25k)
- Slider: Management fee (0.5%-3% a.a.)
- Slider: Administration fee (0.05%-0.5% a.a.)

**Visualization (right column):**
- WaterfallChart: revenue → fixed costs → variable costs → net result
- Three metric cards: Gross Revenue, Total Costs, Net Result (with color-coded delta)
- Viability indicator: colored box (red=inviable, yellow=risky, green=viable)
- SensitivityChart: line showing margin vs PL with breakeven point marked
- Cost decomposition table (fixed vs variable %)

**Educational content:** Expandable sections explaining fixed cost burden and alternatives for small structures.

**Calc logic (viabilidade-calc.ts):**
- `receita_bruta = PL × yield / 100`
- Fixed costs: sum of audit + rating + cvm + (legal/3) + others
- Variable costs: PL × (management + administration) / 100
- Net result: revenue - total costs
- Margin: `receita_bruta > 0 ? (net / receita_bruta) × 100 : 0` (guard division by zero)
- Sensitivity: loop PL from 5M-100M, calc margin for each

**Slider ranges (from Python source):**
- Management fee: 0.5%-3.0% a.a., step 0.1%
- Administration fee: 0.1%-1.0% a.a., step 0.05%

### Sub-Module 2: Arquiteto de Classes

**Purpose:** Interactive builder for FIDC hierarchical structures under CVM 175/2022.

**Layout:** Two-column (config left, diagram right; stacks on mobile)

**Controls (left column):**
- Text input: Fund name
- Text input: Fund CNPJ
- 6 asset class checkboxes with icons:
  - Corporativo, Cartão de Crédito, Agrícola, Imobiliário, Veicular, Consignado
- Checkbox: Include Mezanino subclass
- Per active class: subordination slider (10-50%, step 5%)

**Visualization (right column):**
- ClassHierarchyDiagram (dagre layout + custom SVG): tree showing Fund → selected Classes → Subclasses
  - Root node: Fund name + CNPJ
  - Class nodes: color-coded by asset type
  - Subclass nodes: Senior (green), Mezanino (yellow, if enabled), Subordinada (red)
  - Edge labels: priority order
- Comparative section: "Without Segregation" vs "With Segregation" side-by-side cards
- Use case selector: 3 preset configurations (Varejista, Banco Regional, Fintech) — selecting a preset auto-fills the class checkboxes, subordination sliders, and fund name with suggested values; user can then customize

**Educational content:** Expandable sections on patrimonial segregation, class vs subclass differences, CVM 175 market impact.

### Sub-Module 3: Subordinação e Risco

**Purpose:** Simulate loss absorption waterfall to show how subordination protects senior quotes.

**Layout:** Two-column (controls left, visualization right; stacks on mobile)

**Controls (left column):**
- Input: Total PL (R$ 10M-500M)
- Slider: Subordination index (10-50%, step 5%)
- Checkbox: Include Mezanino
- Slider: Simulated loss (R$ 0 to 60% of PL)
- Metric: Loss as % of PL with delta vs subordination

**Visualization (right column):**
- CapitalStructureChart: stacked bars showing "Before" and "After" loss
  - Junior (red), Mezanino (yellow, if enabled), Senior (green)
  - Text labels with amounts and percentages
- Status indicator: Success/Warning/Error based on which layers are affected
- Summary table: Class | Initial | Loss | Final | Loss%
- Drawdown analysis: contractual vs effective subordination comparison
- RuptureChart: stacked area showing all three layers' values as loss increases (0-60%)
  - Vertical marker at current loss
  - Rupture points annotated

**Calc logic (subordinacao-calc.ts):**
- Capital allocation without Mezanino: Senior = PL × (1 - sub%), Junior = PL × sub%
- Capital allocation with Mezanino: Senior = PL × (1 - sub%), Mezanino = PL × (sub% / 2), Junior = PL × (sub% / 2) — 50/50 split of subordination between Mezanino and Junior
- Loss waterfall: Junior absorbs first → Mezanino → Senior
- Effective subordination: (remaining junior + mezanino) / (remaining total)
- Drawdown detection: effective < contractual
- Sensitivity: loop loss 0-60%, calc each layer's value

**Educational content:** Expandable sections on subordination principles, recomposition mechanisms, and risk-return tradeoffs.

### Sub-Module 4: Checklist Regulatório

**Purpose:** Guide through FIDC registration eligibility and requirements.

**Layout:** Single column, progressive reveal

**Stage 1 — Profile Definition:**
- Radio cards: Investor type (Profissional vs Varejo) with info boxes
- Radio cards: Asset type (DCP vs DCNP) with info boxes

**Stage 2 — Validation Gate:**
- If Varejo + DCNP: error box explaining forbidden combination, stops flow
- Otherwise: unlock Stage 3

**Stage 3 — Compliance Checklist (Varejo only, 6 items):**
1. Rating: agency selector + grade selector + validation
2. Senior-only offering: subordination slider
3. Maturity average: fund type radio + duration slider
4. Portfolio diversification: concentration slider + validation (≤20%)
5. Periodic information: checkbox
6. Authorized distributor: checkbox + distributor name input
- Progress metric: N/6 completed, compliance %
- For Profissional: simplified display (fewer requirements)

**Stage 4 — Registration & Timeline:**
- Radio: ANBIMA Covenant (Yes/No)
- Conditional display:
  - Varejo + ANBIMA → Automatic Registration (~90 days)
  - Varejo without ANBIMA → Ordinary Registration (~150 days)
  - Profissional → Simplified Registration (~60 days)
- TimelineChart: milestone dates on horizontal scatter/gantt
- Cost estimate tables (structuring one-time + recurring annual)

**Calc logic (checklist-logic.ts):**
- Validation: forbidden combo check, per-item validation rules
- Timeline: base date + milestone offsets based on registration type
- Costs: fixed tables with conditional retail-specific items

**Educational content:** Expandable sections on investor protection philosophy, registration types, post-CVM 175 trends.

### Sub-Module 5: Animação

**Purpose:** 3D visualization of FIDC operational flow.

**Implementation:**
- Source file: `python-code/FIDC/modulo5_animação.html` (note: cedilla in filename)
- Copy and rename to `public/animations/fidc-flow.html` (ASCII-safe name)
- Wrapper component with:
  - Loading state while iframe loads
  - `<iframe src="/animations/fidc-flow.html" sandbox="allow-scripts" loading="lazy" />`
  - Responsive height: `min-height: 600px` on desktop, `min-height: 450px` on mobile
  - Brief description text above the iframe
  - "Open in new tab" link for better viewing

## New Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| @dagrejs/dagre | Graph layout algorithm (actively maintained fork) | ~30KB |

The class hierarchy diagram uses dagre for node positioning only, with custom SVG rendering via React (no d3-selection or dagre-d3 needed). This keeps the new dependency footprint minimal.

All other deps (react-plotly.js, tailwindcss, etc.) are already installed.

## Key TypeScript Interfaces (types.ts)

```typescript
// Stepper
interface StepConfig {
  index: number;
  label: string;
  icon: string;
}

// Sub-Module 1: Viabilidade
interface ViabilidadeParams {
  pl: number;              // R$ millions
  yieldRate: number;       // % a.a.
  auditCost: number;       // R$/year
  ratingCost: number;      // R$/year
  cvmFees: number;         // R$/year
  legalSetup: number;      // R$ (amortized over 3 years)
  otherFixed: number;      // R$/year
  managementFee: number;   // % a.a.
  adminFee: number;        // % a.a.
}

interface ViabilidadeResult {
  receitaBruta: number;
  fixedCosts: number;
  variableCosts: number;
  totalCosts: number;
  netResult: number;
  margin: number;          // %
  isViable: boolean;
  viabilityLevel: 'inviable' | 'risky' | 'viable';
}

// Sub-Module 2: Classes
interface AssetClass {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  subordinationIndex: number;  // 10-50%
}

interface ClassConfig {
  fundName: string;
  fundCnpj: string;
  classes: AssetClass[];
  includeMezanino: boolean;
}

// Sub-Module 3: Subordinação
interface SubordinacaoParams {
  pl: number;
  subordinationIndex: number;
  includeMezanino: boolean;
  simulatedLoss: number;
}

interface WaterfallResult {
  senior: { initial: number; loss: number; final: number };
  mezanino?: { initial: number; loss: number; final: number };
  junior: { initial: number; loss: number; final: number };
  effectiveSubordination: number;
  isDrawdown: boolean;
  status: 'success' | 'warning' | 'error';
}

// Sub-Module 4: Checklist
interface ChecklistState {
  investorType: 'profissional' | 'varejo' | null;
  assetType: 'dcp' | 'dcnp' | null;
  isForbiddenCombo: boolean;
  complianceItems: Record<string, boolean>;
  anbimaConvenant: boolean | null;
  registrationType: 'automatic' | 'ordinary' | 'simplified' | null;
}

interface RegistrationTimeline {
  type: string;
  totalDays: number;
  milestones: { label: string; daysFromStart: number; date: string }[];
}
```

## Accessibility Requirements

- **StepperNav:** `role="tablist"` with `role="tab"` on each step, `aria-selected` on active, `aria-controls` linking to content panel
- **Progressive Reveal (Checklist):** `aria-live="polite"` on the validation gate and stage containers so screen readers announce new sections
- **ClassHierarchyDiagram:** `aria-label` on SVG with descriptive text; provide a text-based table fallback below the diagram listing all classes and subclasses
- **Color-coded indicators:** All viability indicators (red/yellow/green) include text labels — never rely on color alone
- **Charts:** Plotly charts include descriptive `title` and `aria-label` attributes

## Educational Content Strategy

Each sub-module has 2-3 expandable "Saiba mais" (Learn more) sections with:
- Portuguese educational text ported from the Python source
- Key concepts explained with analogies
- Practical examples and real-world context
- Regulatory references (CVM 175/2022, ANBIMA)

These sections use the existing glass-panel expandable pattern from the design system.

## Testing Strategy

Each sub-module has an independent calc library that can be unit tested:
- `viabilidade-calc.ts` — breakeven, margin, sensitivity scenarios
- `subordinacao-calc.ts` — loss waterfall, drawdown detection, rupture points
- `checklist-logic.ts` — validation rules, timeline calculations, cost tables

Chart components are tested via visual inspection (Plotly renders are hard to unit test meaningfully).

## Implementation Order

Build sequentially, each verified before the next:

1. **Opening page + StepperNav** — hero, kinetic visual, stepper navigation shell
2. **Viabilidade** — first interactive sub-module (waterfall + sensitivity charts)
3. **Classes** — dagre diagram + class configuration
4. **Subordinação** — loss simulator (stacked bars + rupture analysis)
5. **Checklist** — progressive reveal regulatory navigator
6. **Animação** — iframe embed of Three.js file
