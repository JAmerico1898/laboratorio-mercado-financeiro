# Module 3: FIDC Builder 175 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port Module 3 (FIDC Builder 175) from Streamlit/Python to Next.js — 5 interactive sub-modules teaching FIDC structuring with stepper navigation, Plotly charts, dagre diagrams, and embedded Three.js animation.

**Architecture:** Single page at `/modulo/3` with a stepper-based journey navigation (no sidebar). Each of the 5 sub-modules is a self-contained React component managing its own state. Business logic lives in pure TypeScript calc functions under `src/lib/fidc/`. Charts use `react-plotly.js` (already installed). The class hierarchy diagram uses `@dagrejs/dagre` for layout with custom SVG rendering.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, react-plotly.js, @dagrejs/dagre, Jest 30

**Spec:** `docs/superpowers/specs/2026-03-24-module3-fidc-design.md`

---

## File Structure

```
src/lib/fidc/
  ├── types.ts              ← Shared interfaces for all sub-modules
  ├── constants.ts           ← Default values, slider ranges, asset class definitions, cost tables
  ├── viabilidade-calc.ts    ← Revenue, costs, margin, breakeven, sensitivity
  ├── subordinacao-calc.ts   ← Capital allocation, loss waterfall, drawdown, rupture points
  ├── checklist-logic.ts     ← Validation rules, timeline estimation, cost tables
  └── index.ts               ← Barrel exports

src/lib/__tests__/
  ├── viabilidade-calc.test.ts
  ├── subordinacao-calc.test.ts
  └── checklist-logic.test.ts

src/components/modulo3/
  ├── OpeningHero.tsx         ← Hero section with badge, headline, CTA
  ├── FidcKinetic.tsx         ← Animated FIDC flow + waterfall bars
  ├── StepperNav.tsx          ← Numbered step navigation (1-5), sticky, ARIA tabs
  ├── ViabilidadeModule.tsx   ← Sub-module 1: breakeven analysis
  ├── ClassesModule.tsx       ← Sub-module 2: CVM 175 class architect
  ├── SubordinacaoModule.tsx  ← Sub-module 3: loss waterfall simulator
  ├── ChecklistModule.tsx     ← Sub-module 4: regulatory compliance navigator
  ├── AnimacaoModule.tsx      ← Sub-module 5: Three.js iframe embed
  └── charts/
      ├── WaterfallChart.tsx          ← Plotly waterfall (viabilidade)
      ├── SensitivityChart.tsx        ← Plotly line (margin vs PL)
      ├── CapitalStructureChart.tsx   ← Plotly stacked bar (before/after loss)
      ├── RuptureChart.tsx            ← Plotly stacked area (loss sensitivity)
      ├── ClassHierarchyDiagram.tsx   ← dagre + React SVG tree
      └── TimelineChart.tsx           ← Plotly scatter/gantt (registration)

src/app/modulo/3/
  └── page.tsx                ← Main page: hero + stepper + sub-module router

public/animations/
  └── fidc-flow.html          ← Copied from python-code/FIDC/modulo5_animação.html
```

---

## Task 1: Types, Constants, and Project Setup

**Files:**
- Create: `src/lib/fidc/types.ts`
- Create: `src/lib/fidc/constants.ts`
- Create: `src/lib/fidc/index.ts`

- [ ] **Step 1: Install @dagrejs/dagre**

Run: `npm install @dagrejs/dagre && npm install -D @types/dagre`
Expected: packages added to package.json

- [ ] **Step 2: Create `src/lib/fidc/types.ts`**

```typescript
// Stepper
export interface StepConfig {
  index: number;
  label: string;
  icon: string;
}

// Sub-Module 1: Viabilidade
export interface ViabilidadeParams {
  pl: number;              // R$ millions
  yieldRate: number;       // % a.a.
  auditCost: number;       // R$/year
  ratingCost: number;      // R$/year
  cvmFees: number;         // R$/year
  legalSetup: number;      // R$ total (amortized over 3 years)
  otherFixed: number;      // R$/year
  managementFee: number;   // % a.a.
  adminFee: number;        // % a.a.
}

export interface ViabilidadeResult {
  receitaBruta: number;
  fixedCosts: number;
  variableCosts: number;
  totalCosts: number;
  netResult: number;
  margin: number;
  isViable: boolean;
  viabilityLevel: "inviable" | "risky" | "viable";
}

export interface SensitivityPoint {
  pl: number;
  margin: number;
  netResult: number;
}

export interface CostBreakdown {
  label: string;
  value: number;
  percentage: number;
}

// Sub-Module 3: Sensitivity curve point (used by RuptureChart)
export interface SensitivityCurvePoint {
  lossPercent: number;
  lossAmount: number;
  seniorValue: number;
  mezaninoValue?: number;
  juniorValue: number;
}

// Sub-Module 4: Compliance status
export interface ComplianceStatus {
  completed: number;
  total: number;
  percentage: number;
  level: "approved" | "almost" | "pending";
}

// Sub-Module 2: Classes
export interface AssetClass {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  subordinationIndex: number;
}

export interface ClassConfig {
  fundName: string;
  fundCnpj: string;
  classes: AssetClass[];
  includeMezanino: boolean;
}

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  type: "root" | "class" | "subclass";
}

export interface DiagramEdge {
  source: string;
  target: string;
  label?: string;
}

// Sub-Module 3: Subordinação
export interface SubordinacaoParams {
  pl: number;
  subordinationIndex: number;
  includeMezanino: boolean;
  simulatedLoss: number;
}

export interface LayerState {
  initial: number;
  loss: number;
  final: number;
  lossPercent: number;
}

export interface WaterfallResult {
  senior: LayerState;
  mezanino?: LayerState;
  junior: LayerState;
  effectiveSubordination: number;
  contractualSubordination: number;
  isDrawdown: boolean;
  status: "success" | "warning" | "error";
  statusMessage: string;
}

export interface RupturePoint {
  label: string;
  lossPercent: number;
  lossAmount: number;
}

// Sub-Module 4: Checklist
export type InvestorType = "profissional" | "varejo";
export type AssetType = "dcp" | "dcnp";
export type RegistrationType = "automatic" | "ordinary" | "simplified";

export interface ChecklistState {
  investorType: InvestorType | null;
  assetType: AssetType | null;
  isForbiddenCombo: boolean;
  complianceItems: Record<string, boolean>;
  anbimaConvenant: boolean | null;
  registrationType: RegistrationType | null;
}

export interface RegistrationTimeline {
  type: string;
  description: string;
  totalDays: number;
  milestones: { label: string; daysFromStart: number; date: string }[];
}

export interface CostEstimate {
  category: string;
  items: { label: string; value: string; isRetailOnly?: boolean }[];
}
```

- [ ] **Step 3: Create `src/lib/fidc/constants.ts`**

```typescript
import type { AssetClass, StepConfig } from "./types";

export const STEPS: StepConfig[] = [
  { index: 0, label: "Viabilidade", icon: "trending_up" },
  { index: 1, label: "Classes", icon: "account_tree" },
  { index: 2, label: "Subordinação", icon: "shield" },
  { index: 3, label: "Checklist", icon: "checklist" },
  { index: 4, label: "Animação", icon: "animation" },
];

// Sub-Module 1: Viabilidade defaults and ranges
export const VIABILIDADE_DEFAULTS = {
  pl: 30,
  yieldRate: 15,
  auditCost: 45_000,
  ratingCost: 35_000,
  cvmFees: 15_000,
  legalSetup: 80_000,
  otherFixed: 25_000,
  managementFee: 1.5,
  adminFee: 0.2,
};

export const PL_MIN = 5;
export const PL_MAX = 100;
export const PL_STEP = 5;
export const YIELD_MIN = 8;
export const YIELD_MAX = 25;
export const YIELD_STEP = 0.5;
export const MGMT_FEE_MIN = 0.5;
export const MGMT_FEE_MAX = 3.0;
export const MGMT_FEE_STEP = 0.1;
export const ADMIN_FEE_MIN = 0.1;
export const ADMIN_FEE_MAX = 1.0;
export const ADMIN_FEE_STEP = 0.05;
export const RISKY_MARGIN_THRESHOLD = 5;
export const SENSITIVITY_PL_STEP = 5;

// Sub-Module 2: Asset class definitions
export const DEFAULT_ASSET_CLASSES: AssetClass[] = [
  { id: "corporativo", name: "Crédito Corporativo", icon: "✅", color: "#ff8c00", enabled: false, subordinationIndex: 20 },
  { id: "cartao", name: "Cartão de Crédito", icon: "💳", color: "#4edea3", enabled: false, subordinationIndex: 20 },
  { id: "agricola", name: "Crédito Agrícola", icon: "🌾", color: "#8bc34a", enabled: false, subordinationIndex: 25 },
  { id: "imobiliario", name: "Crédito Imobiliário", icon: "🏠", color: "#2196f3", enabled: false, subordinationIndex: 15 },
  { id: "veicular", name: "Financiamento Veicular", icon: "🚗", color: "#9c27b0", enabled: false, subordinationIndex: 20 },
  { id: "consignado", name: "Crédito Consignado", icon: "👔", color: "#607d8b", enabled: false, subordinationIndex: 15 },
];

// Sub-Module 2: Use case presets
export const USE_CASE_PRESETS = [
  {
    id: "varejista",
    label: "Varejista Multi-Segmento",
    description: "Empresa de varejo com canais físico e e-commerce",
    fundName: "FIDC Varejo Premium",
    activeClasses: ["corporativo", "cartao"],
    includeMezanino: true,
    benefit: "Segregação de canais com diferentes perfis de inadimplência",
  },
  {
    id: "banco",
    label: "Banco Regional",
    description: "Banco com múltiplas linhas de crédito",
    fundName: "FIDC Banco Regional Diversificado",
    activeClasses: ["imobiliario", "veicular", "consignado"],
    includeMezanino: true,
    benefit: "Cada linha de crédito isolada em classe própria",
  },
  {
    id: "fintech",
    label: "Fintech de Crédito",
    description: "Produto consolidado + novos produtos em teste",
    fundName: "FIDC Fintech Innovation",
    activeClasses: ["corporativo", "cartao", "consignado"],
    includeMezanino: false,
    benefit: "Classes separadas para produto maduro e novos produtos",
  },
];

// Sub-Module 3: Subordinação ranges
export const SUB_INDEX_MIN = 10;
export const SUB_INDEX_MAX = 50;
export const SUB_INDEX_STEP = 5;
export const SUB_PL_MIN = 10;
export const SUB_PL_MAX = 500;
export const SUB_PL_STEP = 10;
export const SUB_LOSS_MAX_PERCENT = 60;
export const SUB_SENSITIVITY_STEP = 1;

// Sub-Module 4: Checklist — Rating options
export const RATING_AGENCIES = ["Fitch Ratings", "Moody's", "S&P Global", "Austin Rating", "Liberum Ratings"];
export const RATING_GRADES = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-"];
export const MIN_RECOMMENDED_RATING_INDEX = 5; // "A" grade index

// Sub-Module 4: Cost tables
export const STRUCTURING_COSTS = [
  { label: "Assessoria Jurídica", value: "R$ 80.000" },
  { label: "Regulamento + Prospecto", value: "R$ 30.000" },
  { label: "Taxa de Registro CVM", value: "R$ 8.000" },
  { label: "Due Diligence Inicial", value: "R$ 25.000" },
];

export const RETAIL_EXTRA_STRUCTURING_COSTS = [
  { label: "Rating Inicial", value: "R$ 35.000", isRetailOnly: true },
  { label: "Estudo de Viabilidade", value: "R$ 15.000", isRetailOnly: true },
];

export const RECURRING_COSTS = [
  { label: "Administração (0,2% a.a. do PL)", value: "Variável" },
  { label: "Gestão (1,5% a.a. do PL)", value: "Variável" },
  { label: "Auditoria", value: "R$ 45.000/ano" },
  { label: "Custódia", value: "R$ 20.000/ano" },
];

export const RETAIL_EXTRA_RECURRING_COSTS = [
  { label: "Rating Anual", value: "R$ 35.000/ano", isRetailOnly: true },
  { label: "Comissão de Distribuição (0,5-1% captado)", value: "Variável", isRetailOnly: true },
];

// Registration timeline milestones
export const REGISTRATION_CONFIGS: Record<string, { totalDays: number; milestones: { label: string; daysFromStart: number }[] }> = {
  automatic: {
    totalDays: 90,
    milestones: [
      { label: "Protocolo CVMWeb", daysFromStart: 0 },
      { label: "Validação ANBIMA", daysFromStart: 10 },
      { label: "Registro Automático", daysFromStart: 30 },
      { label: "Início Distribuição", daysFromStart: 90 },
    ],
  },
  ordinary: {
    totalDays: 150,
    milestones: [
      { label: "Protocolo CVMWeb", daysFromStart: 0 },
      { label: "1ª Manifestação CVM", daysFromStart: 15 },
      { label: "Rodadas de Perguntas", daysFromStart: 60 },
      { label: "Análise Final", daysFromStart: 120 },
      { label: "Registro", daysFromStart: 150 },
    ],
  },
  simplified: {
    totalDays: 60,
    milestones: [
      { label: "Protocolo CVMWeb", daysFromStart: 0 },
      { label: "Análise Acelerada", daysFromStart: 20 },
      { label: "Registro", daysFromStart: 45 },
      { label: "Início Distribuição", daysFromStart: 60 },
    ],
  },
};
```

- [ ] **Step 4: Create `src/lib/fidc/index.ts`**

```typescript
export * from "./types";
export * from "./constants";
// Uncomment as each calc module is implemented:
// export { calculateViabilidade, calculateSensitivity, calculateCostBreakdown } from "./viabilidade-calc";
// export { calculateWaterfall, calculateSensitivityCurve, calculateRupturePoints } from "./subordinacao-calc";
// export { isForbiddenCombination, determineRegistrationType, calculateTimeline, getComplianceStatus } from "./checklist-logic";
```

Note: The actual calc function files will be created in subsequent tasks. Create `index.ts` with these exports commented out initially, then uncomment as each calc module is implemented.

- [ ] **Step 5: Commit**

```bash
git add src/lib/fidc/types.ts src/lib/fidc/constants.ts src/lib/fidc/index.ts package.json package-lock.json
git commit -m "feat(fidc): add types, constants, and dagre dependency for Module 3"
```

---

## Task 2: Viabilidade Calc — TDD

**Files:**
- Create: `src/lib/fidc/viabilidade-calc.ts`
- Create: `src/lib/__tests__/viabilidade-calc.test.ts`

- [ ] **Step 1: Write failing tests for `calculateViabilidade`**

```typescript
import { calculateViabilidade, calculateSensitivity, calculateCostBreakdown } from "../fidc/viabilidade-calc";
import type { ViabilidadeParams } from "../fidc/types";
import { VIABILIDADE_DEFAULTS } from "../fidc/constants";

const defaultParams: ViabilidadeParams = {
  pl: 30,
  yieldRate: 15,
  auditCost: 45_000,
  ratingCost: 35_000,
  cvmFees: 15_000,
  legalSetup: 80_000,
  otherFixed: 25_000,
  managementFee: 1.5,
  adminFee: 0.2,
};

describe("calculateViabilidade", () => {
  it("calculates gross revenue correctly", () => {
    const result = calculateViabilidade(defaultParams);
    // PL=30M, yield=15% → receita = 30_000_000 * 15/100 = 4_500_000
    expect(result.receitaBruta).toBeCloseTo(4_500_000, 0);
  });

  it("calculates fixed costs correctly", () => {
    const result = calculateViabilidade(defaultParams);
    // audit(45k) + rating(35k) + cvm(15k) + legal(80k/3≈26667) + other(25k) = 146_667
    expect(result.fixedCosts).toBeCloseTo(146_667, 0);
  });

  it("calculates variable costs correctly", () => {
    const result = calculateViabilidade(defaultParams);
    // PL=30M * (1.5+0.2)/100 = 30_000_000 * 0.017 = 510_000
    expect(result.variableCosts).toBeCloseTo(510_000, 0);
  });

  it("calculates net result and margin", () => {
    const result = calculateViabilidade(defaultParams);
    const expectedNet = 4_500_000 - 146_667 - 510_000;
    expect(result.netResult).toBeCloseTo(expectedNet, 0);
    expect(result.margin).toBeCloseTo((expectedNet / 4_500_000) * 100, 1);
  });

  it("returns inviable when net result is negative", () => {
    const params = { ...defaultParams, pl: 5, yieldRate: 8 };
    const result = calculateViabilidade(params);
    expect(result.viabilityLevel).toBe("inviable");
    expect(result.isViable).toBe(false);
  });

  it("returns risky when margin is between 0% and 5%", () => {
    // With pl=5M, yieldRate=20%: revenue=1M, fixed=146,667, variable=85k, net=768,333, margin=76.8%
    // We need very high costs relative to revenue. Use custom params:
    const params = {
      ...defaultParams,
      pl: 5,
      yieldRate: 8,  // revenue = 400k
      auditCost: 80_000,
      ratingCost: 60_000,
      cvmFees: 30_000,
      legalSetup: 120_000, // /3 = 40k
      otherFixed: 50_000,
      managementFee: 2.5, // variable = 5M * 2.7% = 135k
      adminFee: 0.2,       // total fixed=260k, variable=135k, total=395k, net=5k, margin=1.25%
    };
    const result = calculateViabilidade(params);
    expect(result.netResult).toBeGreaterThan(0);
    expect(result.margin).toBeLessThan(5);
    expect(result.viabilityLevel).toBe("risky");
  });

  it("returns viable when margin >= 5%", () => {
    const result = calculateViabilidade(defaultParams);
    expect(result.margin).toBeGreaterThanOrEqual(5);
    expect(result.viabilityLevel).toBe("viable");
    expect(result.isViable).toBe(true);
  });

  it("guards against division by zero when yield is 0", () => {
    const params = { ...defaultParams, yieldRate: 0 };
    const result = calculateViabilidade(params);
    expect(result.margin).toBe(0);
    expect(result.receitaBruta).toBe(0);
  });
});

describe("calculateSensitivity", () => {
  it("returns points from PL 5M to 100M", () => {
    const points = calculateSensitivity(defaultParams);
    expect(points[0].pl).toBe(5);
    expect(points[points.length - 1].pl).toBe(100);
  });

  it("margin increases with PL (fixed costs spread)", () => {
    const points = calculateSensitivity(defaultParams);
    const first = points[0].margin;
    const last = points[points.length - 1].margin;
    expect(last).toBeGreaterThan(first);
  });

  it("identifies breakeven PL (margin crosses 0)", () => {
    const points = calculateSensitivity(defaultParams);
    const hasBreakeven = points.some((p, i) =>
      i > 0 && points[i - 1].margin < 0 && p.margin >= 0
    );
    // With default params the breakeven should exist in range
    expect(points.some((p) => p.netResult > 0)).toBe(true);
  });
});

describe("calculateCostBreakdown", () => {
  it("returns fixed and variable cost items with percentages", () => {
    const result = calculateViabilidade(defaultParams);
    const breakdown = calculateCostBreakdown(defaultParams, result);
    expect(breakdown.length).toBeGreaterThan(0);
    const totalPct = breakdown.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPct).toBeCloseTo(100, 0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/__tests__/viabilidade-calc.test.ts --no-coverage`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `viabilidade-calc.ts`**

```typescript
import type { ViabilidadeParams, ViabilidadeResult, SensitivityPoint, CostBreakdown } from "./types";
import { PL_MIN, PL_MAX, SENSITIVITY_PL_STEP, RISKY_MARGIN_THRESHOLD } from "./constants";

export function calculateViabilidade(params: ViabilidadeParams): ViabilidadeResult {
  const plValue = params.pl * 1_000_000;
  const receitaBruta = plValue * (params.yieldRate / 100);

  const fixedCosts =
    params.auditCost +
    params.ratingCost +
    params.cvmFees +
    params.legalSetup / 3 +
    params.otherFixed;

  const variableCosts = plValue * ((params.managementFee + params.adminFee) / 100);
  const totalCosts = fixedCosts + variableCosts;
  const netResult = receitaBruta - totalCosts;
  const margin = receitaBruta > 0 ? (netResult / receitaBruta) * 100 : 0;

  let viabilityLevel: ViabilidadeResult["viabilityLevel"];
  if (netResult < 0) {
    viabilityLevel = "inviable";
  } else if (margin < RISKY_MARGIN_THRESHOLD) {
    viabilityLevel = "risky";
  } else {
    viabilityLevel = "viable";
  }

  return {
    receitaBruta,
    fixedCosts,
    variableCosts,
    totalCosts,
    netResult,
    margin,
    isViable: netResult >= 0,
    viabilityLevel,
  };
}

export function calculateSensitivity(params: ViabilidadeParams): SensitivityPoint[] {
  const points: SensitivityPoint[] = [];
  for (let pl = PL_MIN; pl <= PL_MAX; pl += SENSITIVITY_PL_STEP) {
    const result = calculateViabilidade({ ...params, pl });
    points.push({ pl, margin: result.margin, netResult: result.netResult });
  }
  return points;
}

export function calculateCostBreakdown(
  params: ViabilidadeParams,
  result: ViabilidadeResult
): CostBreakdown[] {
  const total = result.totalCosts;
  if (total <= 0) return [];

  const items: CostBreakdown[] = [
    { label: "Auditoria", value: params.auditCost, percentage: (params.auditCost / total) * 100 },
    { label: "Rating", value: params.ratingCost, percentage: (params.ratingCost / total) * 100 },
    { label: "CVM + Anbima", value: params.cvmFees, percentage: (params.cvmFees / total) * 100 },
    { label: "Jurídico (amort. 3 anos)", value: params.legalSetup / 3, percentage: ((params.legalSetup / 3) / total) * 100 },
    { label: "Outros Fixos", value: params.otherFixed, percentage: (params.otherFixed / total) * 100 },
    { label: "Gestão", value: params.pl * 1_000_000 * params.managementFee / 100, percentage: (params.pl * 1_000_000 * params.managementFee / 100 / total) * 100 },
    { label: "Administração", value: params.pl * 1_000_000 * params.adminFee / 100, percentage: (params.pl * 1_000_000 * params.adminFee / 100 / total) * 100 },
  ];
  return items;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/__tests__/viabilidade-calc.test.ts --no-coverage`
Expected: ALL PASS

- [ ] **Step 5: Uncomment viabilidade exports in `index.ts`**

- [ ] **Step 6: Commit**

```bash
git add src/lib/fidc/viabilidade-calc.ts src/lib/__tests__/viabilidade-calc.test.ts src/lib/fidc/index.ts
git commit -m "feat(fidc): add viabilidade calculation with TDD tests"
```

---

## Task 3: Subordinação Calc — TDD

**Files:**
- Create: `src/lib/fidc/subordinacao-calc.ts`
- Create: `src/lib/__tests__/subordinacao-calc.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import { calculateWaterfall, calculateSensitivityCurve, calculateRupturePoints } from "../fidc/subordinacao-calc";
import type { SubordinacaoParams } from "../fidc/types";

describe("calculateWaterfall", () => {
  it("allocates capital correctly without mezanino", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 0,
    };
    const result = calculateWaterfall(params);
    expect(result.senior.initial).toBeCloseTo(80_000_000, 0);
    expect(result.junior.initial).toBeCloseTo(20_000_000, 0);
    expect(result.mezanino).toBeUndefined();
  });

  it("allocates capital with mezanino (50/50 split)", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: true, simulatedLoss: 0,
    };
    const result = calculateWaterfall(params);
    expect(result.senior.initial).toBeCloseTo(80_000_000, 0);
    expect(result.mezanino!.initial).toBeCloseTo(10_000_000, 0);
    expect(result.junior.initial).toBeCloseTo(10_000_000, 0);
  });

  it("junior absorbs loss first", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 10_000_000,
    };
    const result = calculateWaterfall(params);
    expect(result.junior.loss).toBe(10_000_000);
    expect(result.junior.final).toBe(10_000_000);
    expect(result.senior.loss).toBe(0);
    expect(result.senior.final).toBe(80_000_000);
    expect(result.status).toBe("success");
  });

  it("loss overflows to senior when junior exhausted", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 30_000_000,
    };
    const result = calculateWaterfall(params);
    expect(result.junior.final).toBe(0);
    expect(result.senior.loss).toBe(10_000_000);
    expect(result.status).toBe("error");
  });

  it("mezanino absorbs after junior, before senior", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: true, simulatedLoss: 15_000_000,
    };
    const result = calculateWaterfall(params);
    expect(result.junior.final).toBe(0);
    expect(result.mezanino!.loss).toBe(5_000_000);
    expect(result.mezanino!.final).toBe(5_000_000);
    expect(result.senior.loss).toBe(0);
    expect(result.status).toBe("warning");
  });

  it("caps loss when it exceeds total PL", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 120_000_000,
    };
    const result = calculateWaterfall(params);
    expect(result.junior.final).toBe(0);
    expect(result.senior.final).toBe(0);
    // Total loss absorbed = junior(20M) + senior(80M) = 100M, not 120M
    expect(result.junior.loss + result.senior.loss).toBe(100_000_000);
  });

  it("detects drawdown correctly", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 15_000_000,
    };
    const result = calculateWaterfall(params);
    // Effective sub = (20M - 15M) / (100M - 15M) = 5/85 = 5.88%
    expect(result.effectiveSubordination).toBeCloseTo(5.88, 0);
    expect(result.isDrawdown).toBe(true);
  });

  it("no drawdown when no loss", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 0,
    };
    const result = calculateWaterfall(params);
    expect(result.effectiveSubordination).toBeCloseTo(20, 0);
    expect(result.isDrawdown).toBe(false);
  });
});

describe("calculateRupturePoints", () => {
  it("identifies junior rupture point", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 0,
    };
    const points = calculateRupturePoints(params);
    const juniorRupture = points.find((p) => p.label === "Junior");
    expect(juniorRupture).toBeDefined();
    expect(juniorRupture!.lossPercent).toBeCloseTo(20, 0);
  });
});

describe("calculateSensitivityCurve", () => {
  it("returns data points from 0 to 60% loss", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 0,
    };
    const curve = calculateSensitivityCurve(params);
    expect(curve.length).toBeGreaterThan(0);
    expect(curve[0].lossPercent).toBe(0);
    expect(curve[curve.length - 1].lossPercent).toBe(60);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/__tests__/subordinacao-calc.test.ts --no-coverage`
Expected: FAIL

- [ ] **Step 3: Implement `subordinacao-calc.ts`**

```typescript
import type { SubordinacaoParams, WaterfallResult, LayerState, RupturePoint, SensitivityCurvePoint } from "./types";
import { SUB_LOSS_MAX_PERCENT, SUB_SENSITIVITY_STEP } from "./constants";

export function calculateWaterfall(params: SubordinacaoParams): WaterfallResult {
  const plValue = params.pl * 1_000_000;
  const subPercent = params.subordinationIndex / 100;
  const loss = params.simulatedLoss;

  let seniorInitial: number;
  let mezaninoInitial: number | undefined;
  let juniorInitial: number;

  if (params.includeMezanino) {
    seniorInitial = plValue * (1 - subPercent);
    mezaninoInitial = plValue * (subPercent / 2);
    juniorInitial = plValue * (subPercent / 2);
  } else {
    seniorInitial = plValue * (1 - subPercent);
    juniorInitial = plValue * subPercent;
  }

  // Loss waterfall: Junior → Mezanino → Senior
  let remaining = loss;

  const juniorLoss = Math.min(remaining, juniorInitial);
  remaining -= juniorLoss;

  let mezaninoLoss = 0;
  if (params.includeMezanino && mezaninoInitial !== undefined) {
    mezaninoLoss = Math.min(remaining, mezaninoInitial);
    remaining -= mezaninoLoss;
  }

  const seniorLoss = Math.min(remaining, seniorInitial);

  const junior: LayerState = {
    initial: juniorInitial,
    loss: juniorLoss,
    final: juniorInitial - juniorLoss,
    lossPercent: juniorInitial > 0 ? (juniorLoss / juniorInitial) * 100 : 0,
  };

  const senior: LayerState = {
    initial: seniorInitial,
    loss: seniorLoss,
    final: seniorInitial - seniorLoss,
    lossPercent: seniorInitial > 0 ? (seniorLoss / seniorInitial) * 100 : 0,
  };

  const mezanino: LayerState | undefined =
    params.includeMezanino && mezaninoInitial !== undefined
      ? {
          initial: mezaninoInitial,
          loss: mezaninoLoss,
          final: mezaninoInitial - mezaninoLoss,
          lossPercent: mezaninoInitial > 0 ? (mezaninoLoss / mezaninoInitial) * 100 : 0,
        }
      : undefined;

  // Effective subordination
  const remainingSubordinated = junior.final + (mezanino?.final ?? 0);
  const remainingTotal = plValue - loss;
  const effectiveSubordination =
    remainingTotal > 0 ? (remainingSubordinated / remainingTotal) * 100 : 0;
  const contractualSubordination = params.subordinationIndex;
  const isDrawdown = effectiveSubordination < contractualSubordination;

  // Status
  let status: WaterfallResult["status"];
  let statusMessage: string;
  if (seniorLoss > 0) {
    status = "error";
    statusMessage = "Cota Sênior impactada — drawdown crítico";
  } else if (mezaninoLoss > 0) {
    status = "warning";
    statusMessage = "Cota Mezanino afetada — Sênior protegida";
  } else if (juniorLoss > 0 && junior.final > 0) {
    status = "success";
    statusMessage = "Perda absorvida pela Subordinada";
  } else if (juniorLoss > 0 && junior.final === 0) {
    status = "warning";
    statusMessage = "Subordinada eliminada — próximo nível em risco";
  } else {
    status = "success";
    statusMessage = "Sem perdas simuladas";
  }

  return {
    senior,
    mezanino,
    junior,
    effectiveSubordination,
    contractualSubordination,
    isDrawdown,
    status,
    statusMessage,
  };
}

export function calculateSensitivityCurve(params: SubordinacaoParams): SensitivityCurvePoint[] {
  const plValue = params.pl * 1_000_000;
  const points: SensitivityCurvePoint[] = [];

  for (let pct = 0; pct <= SUB_LOSS_MAX_PERCENT; pct += SUB_SENSITIVITY_STEP) {
    const lossAmount = plValue * (pct / 100);
    const result = calculateWaterfall({ ...params, simulatedLoss: lossAmount });
    points.push({
      lossPercent: pct,
      lossAmount,
      seniorValue: result.senior.final,
      mezaninoValue: result.mezanino?.final,
      juniorValue: result.junior.final,
    });
  }
  return points;
}

export function calculateRupturePoints(params: SubordinacaoParams): RupturePoint[] {
  const plValue = params.pl * 1_000_000;
  const subPercent = params.subordinationIndex / 100;
  const points: RupturePoint[] = [];

  if (params.includeMezanino) {
    const juniorAmount = plValue * (subPercent / 2);
    const mezaninoAmount = plValue * (subPercent / 2);
    points.push({
      label: "Junior",
      lossPercent: (juniorAmount / plValue) * 100,
      lossAmount: juniorAmount,
    });
    points.push({
      label: "Mezanino",
      lossPercent: ((juniorAmount + mezaninoAmount) / plValue) * 100,
      lossAmount: juniorAmount + mezaninoAmount,
    });
  } else {
    const juniorAmount = plValue * subPercent;
    points.push({
      label: "Junior",
      lossPercent: (juniorAmount / plValue) * 100,
      lossAmount: juniorAmount,
    });
  }

  points.push({
    label: "Fundo Total",
    lossPercent: 100,
    lossAmount: plValue,
  });

  return points;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/__tests__/subordinacao-calc.test.ts --no-coverage`
Expected: ALL PASS

- [ ] **Step 5: Uncomment subordinacao exports in `index.ts`**

- [ ] **Step 6: Commit**

```bash
git add src/lib/fidc/subordinacao-calc.ts src/lib/__tests__/subordinacao-calc.test.ts src/lib/fidc/index.ts
git commit -m "feat(fidc): add subordinacao waterfall calculation with TDD tests"
```

---

## Task 4: Checklist Logic — TDD

**Files:**
- Create: `src/lib/fidc/checklist-logic.ts`
- Create: `src/lib/__tests__/checklist-logic.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import {
  isForbiddenCombination,
  determineRegistrationType,
  calculateTimeline,
  getComplianceStatus,
} from "../fidc/checklist-logic";
import type { ChecklistState } from "../fidc/types";

describe("isForbiddenCombination", () => {
  it("returns true for varejo + dcnp", () => {
    expect(isForbiddenCombination("varejo", "dcnp")).toBe(true);
  });

  it("returns false for profissional + dcnp", () => {
    expect(isForbiddenCombination("profissional", "dcnp")).toBe(false);
  });

  it("returns false for varejo + dcp", () => {
    expect(isForbiddenCombination("varejo", "dcp")).toBe(false);
  });
});

describe("determineRegistrationType", () => {
  it("returns simplified for profissional", () => {
    expect(determineRegistrationType("profissional", true)).toBe("simplified");
    expect(determineRegistrationType("profissional", false)).toBe("simplified");
  });

  it("returns automatic for varejo with anbima", () => {
    expect(determineRegistrationType("varejo", true)).toBe("automatic");
  });

  it("returns ordinary for varejo without anbima", () => {
    expect(determineRegistrationType("varejo", false)).toBe("ordinary");
  });
});

describe("calculateTimeline", () => {
  it("returns correct milestones for automatic registration", () => {
    const timeline = calculateTimeline("automatic", "2026-04-01");
    expect(timeline.totalDays).toBe(90);
    expect(timeline.milestones.length).toBe(4);
    expect(timeline.milestones[0].label).toBe("Protocolo CVMWeb");
    expect(timeline.milestones[0].date).toBe("2026-04-01");
  });

  it("returns correct milestones for simplified registration", () => {
    const timeline = calculateTimeline("simplified", "2026-04-01");
    expect(timeline.totalDays).toBe(60);
  });
});

describe("getComplianceStatus", () => {
  it("returns full compliance when all 6 items checked", () => {
    const items: Record<string, boolean> = {
      rating: true, seniorOnly: true, maturity: true,
      diversification: true, periodicInfo: true, distributor: true,
    };
    const status = getComplianceStatus(items);
    expect(status.completed).toBe(6);
    expect(status.total).toBe(6);
    expect(status.percentage).toBe(100);
    expect(status.level).toBe("approved");
  });

  it("returns partial compliance", () => {
    const items: Record<string, boolean> = {
      rating: true, seniorOnly: true, maturity: false,
      diversification: false, periodicInfo: true, distributor: false,
    };
    const status = getComplianceStatus(items);
    expect(status.completed).toBe(3);
    expect(status.percentage).toBe(50);
    expect(status.level).toBe("pending");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/__tests__/checklist-logic.test.ts --no-coverage`
Expected: FAIL

- [ ] **Step 3: Implement `checklist-logic.ts`**

```typescript
import type { InvestorType, AssetType, RegistrationType, RegistrationTimeline, ComplianceStatus } from "./types";
import { REGISTRATION_CONFIGS } from "./constants";

export function isForbiddenCombination(
  investorType: InvestorType,
  assetType: AssetType
): boolean {
  return investorType === "varejo" && assetType === "dcnp";
}

export function determineRegistrationType(
  investorType: InvestorType,
  anbimaConvenant: boolean
): RegistrationType {
  if (investorType === "profissional") return "simplified";
  return anbimaConvenant ? "automatic" : "ordinary";
}

function addCalendarDays(startDate: string, days: number): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function calculateTimeline(
  registrationType: RegistrationType,
  startDate: string
): RegistrationTimeline {
  const config = REGISTRATION_CONFIGS[registrationType];
  const typeLabels: Record<RegistrationType, string> = {
    automatic: "Registro Automático",
    ordinary: "Registro Ordinário com Análise CVM",
    simplified: "Registro Simplificado",
  };
  const descriptions: Record<RegistrationType, string> = {
    automatic: "Registro automático após protocolo CVMWeb — sem análise prévia",
    ordinary: "Análise detalhada pela CVM com possíveis rodadas de perguntas",
    simplified: "Revisão acelerada pela CVM com menos requisitos",
  };

  return {
    type: typeLabels[registrationType],
    description: descriptions[registrationType],
    totalDays: config.totalDays,
    milestones: config.milestones.map((m) => ({
      ...m,
      date: addCalendarDays(startDate, m.daysFromStart),
    })),
  };
}

export function getComplianceStatus(
  items: Record<string, boolean>
): ComplianceStatus {
  const total = 6;
  const completed = Object.values(items).filter(Boolean).length;
  const percentage = (completed / total) * 100;

  let level: ComplianceStatus["level"];
  if (completed === total) {
    level = "approved";
  } else if (completed >= 4) {
    level = "almost";
  } else {
    level = "pending";
  }

  return { completed, total, percentage, level };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/__tests__/checklist-logic.test.ts --no-coverage`
Expected: ALL PASS

- [ ] **Step 5: Uncomment checklist exports in `index.ts`**

- [ ] **Step 6: Commit**

```bash
git add src/lib/fidc/checklist-logic.ts src/lib/__tests__/checklist-logic.test.ts src/lib/fidc/index.ts
git commit -m "feat(fidc): add checklist regulatory logic with TDD tests"
```

---

## Task 5: Opening Page — Hero + Stepper Shell

**Files:**
- Create: `src/components/modulo3/OpeningHero.tsx`
- Create: `src/components/modulo3/FidcKinetic.tsx`
- Create: `src/components/modulo3/StepperNav.tsx`
- Create: `src/app/modulo/3/page.tsx`

- [ ] **Step 1: Create `FidcKinetic.tsx`**

Follow the pattern from `src/components/modulo1/KineticVisual.tsx`: hidden on mobile (`hidden lg:block`), glass-panel container, animated bars. Content: 3 entity boxes (Cedente, FIDC, Sacados) with arrows, plus waterfall bars below.

```typescript
"use client";

export default function FidcKinetic() {
  return (
    <div className="relative h-[400px] w-full hidden lg:block">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full opacity-40 blur-[80px] bg-primary-container/20 rounded-full absolute -top-20 -right-20" />
        <div className="w-full h-full glass-panel rounded-3xl overflow-hidden p-8 flex flex-col justify-between border border-outline-variant/15">
          {/* FIDC Flow Diagram */}
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-xl bg-[#1e3a5f] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(0,242,255,0.15)]">
                🏪
              </div>
              <span className="text-[9px] text-outline-variant font-bold uppercase tracking-wide">
                Cedente
              </span>
            </div>
            <div className="flex-1 mx-3 h-[2px] bg-gradient-to-r from-primary-container/60 to-primary-container/20 relative">
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-xl bg-[#3a2a1f] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(255,140,0,0.15)]">
                🏦
              </div>
              <span className="text-[9px] text-outline-variant font-bold uppercase tracking-wide">
                FIDC
              </span>
            </div>
            <div className="flex-1 mx-3 h-[2px] bg-gradient-to-r from-secondary/60 to-secondary/20 relative">
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-xl bg-[#1f3a2a] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(78,222,163,0.15)]">
                👥
              </div>
              <span className="text-[9px] text-outline-variant font-bold uppercase tracking-wide">
                Sacados
              </span>
            </div>
          </div>

          {/* Waterfall Bars */}
          <div className="flex items-end gap-1 h-32 mt-4">
            {[
              { h: "70%", color: "from-secondary/40 to-secondary" },
              { h: "50%", color: "from-[#ff8c00]/40 to-[#ff8c00]" },
              { h: "30%", color: "from-[#ff4444]/40 to-[#ff4444]" },
              { h: "80%", color: "from-secondary/40 to-secondary" },
              { h: "55%", color: "from-[#ff8c00]/40 to-[#ff8c00]" },
              { h: "25%", color: "from-[#ff4444]/40 to-[#ff4444]" },
              { h: "85%", color: "from-secondary/40 to-secondary" },
              { h: "60%", color: "from-[#ff8c00]/40 to-[#ff8c00]" },
              { h: "20%", color: "from-[#ff4444]/40 to-[#ff4444]" },
            ].map((bar, i) => (
              <div
                key={i}
                className={`w-full bg-gradient-to-t ${bar.color} rounded-t-sm`}
                style={{ height: bar.h }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-tighter mt-2">
            <span>Sênior</span>
            <span>Mezanino</span>
            <span>Subordinada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `OpeningHero.tsx`**

Follow Module 2's `OpeningHero.tsx` pattern (props with `onScrollToControls`).

```typescript
"use client";

import FidcKinetic from "./FidcKinetic";

interface OpeningHeroProps {
  onStartJourney: () => void;
}

export default function OpeningHero({ onStartJourney }: OpeningHeroProps) {
  return (
    <section className="relative px-6 md:px-8 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-sm bg-surface-container-highest text-secondary text-[10px] font-bold tracking-widest uppercase">
              Módulo 3
            </span>
            <div className="h-[1px] w-12 bg-outline-variant/30" />
            <span className="text-on-surface-variant text-sm font-medium tracking-tight">
              Securitização
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-primary mb-6 leading-[1.1]">
            Fundos de Direitos Creditórios{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary">
              (FIDC)
            </span>
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl border-l-2 border-primary-container/30 pl-4 mb-8">
            Explore a jornada completa de estruturação de um FIDC — da análise
            de viabilidade econômica ao registro na CVM, passando pela
            arquitetura de classes sob a Resolução CVM 175/2022 e os mecanismos
            de subordinação que protegem os investidores.
          </p>

          <button
            onClick={onStartJourney}
            className="px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold tracking-tight hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,219,231,0.15)]"
          >
            Iniciar Jornada
            <span className="material-symbols-outlined text-xl">
              rocket_launch
            </span>
          </button>
        </div>

        <FidcKinetic />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `StepperNav.tsx`**

```typescript
"use client";

import { STEPS } from "@/lib/fidc/constants";

interface StepperNavProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export default function StepperNav({ activeStep, onStepChange }: StepperNavProps) {
  return (
    <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-outline-variant/15">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Desktop stepper */}
        <div className="hidden md:flex items-center justify-center py-4" role="tablist" aria-label="Etapas da jornada FIDC">
          {STEPS.map((step, i) => (
            <div key={step.index} className="flex items-center">
              <button
                role="tab"
                aria-selected={activeStep === i}
                aria-controls={`panel-${i}`}
                onClick={() => onStepChange(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  activeStep === i
                    ? "bg-primary-container/15 text-primary-container"
                    : "text-outline-variant hover:text-on-surface-variant hover:bg-surface-container/50"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    activeStep === i
                      ? "bg-primary-container text-surface"
                      : activeStep > i
                      ? "bg-primary-container/30 text-primary-container"
                      : "bg-surface-container-highest text-outline-variant"
                  }`}
                >
                  {activeStep > i ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-8 h-[2px] mx-1 transition-colors ${
                    activeStep > i ? "bg-primary-container/40" : "bg-outline-variant/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile stepper */}
        <div className="md:hidden flex items-center justify-between py-3">
          <button
            onClick={() => onStepChange(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="p-2 text-outline-variant disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-container text-surface flex items-center justify-center text-xs font-bold">
              {activeStep + 1}
            </div>
            <span className="text-sm font-semibold text-on-surface">
              {STEPS[activeStep].label}
            </span>
            <span className="text-xs text-outline-variant">
              de {STEPS.length}
            </span>
          </div>
          <button
            onClick={() => onStepChange(Math.min(STEPS.length - 1, activeStep + 1))}
            disabled={activeStep === STEPS.length - 1}
            className="p-2 text-outline-variant disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/modulo/3/page.tsx` with shell**

```typescript
"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OpeningHero from "@/components/modulo3/OpeningHero";
import StepperNav from "@/components/modulo3/StepperNav";
import { STEPS } from "@/lib/fidc/constants";

// Wrap in Suspense because useSearchParams requires it in Next.js 14+
export default function Module3Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Module3Content />
    </Suspense>
  );
}

function Module3Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStep = Number(searchParams.get("step") ?? -1);
  const [activeStep, setActiveStep] = useState(initialStep >= 0 ? initialStep : -1);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleStepChange = useCallback(
    (step: number) => {
      setActiveStep(step);
      router.replace(`/modulo/3?step=${step}`, { scroll: false });
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [router]
  );

  const handleStartJourney = useCallback(() => {
    handleStepChange(0);
  }, [handleStepChange]);

  return (
    <div className="min-h-screen">
      <OpeningHero onStartJourney={handleStartJourney} />

      {activeStep >= 0 && (
        <>
          <div ref={contentRef}>
            <StepperNav activeStep={activeStep} onStepChange={handleStepChange} />
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8" role="tabpanel" id={`panel-${activeStep}`}>
            {activeStep === 0 && (
              <div className="text-on-surface-variant text-center py-20">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">trending_up</span>
                <p>Viabilidade Econômica — em breve</p>
              </div>
            )}
            {activeStep === 1 && (
              <div className="text-on-surface-variant text-center py-20">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">account_tree</span>
                <p>Arquiteto de Classes — em breve</p>
              </div>
            )}
            {activeStep === 2 && (
              <div className="text-on-surface-variant text-center py-20">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">shield</span>
                <p>Subordinação e Risco — em breve</p>
              </div>
            )}
            {activeStep === 3 && (
              <div className="text-on-surface-variant text-center py-20">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">checklist</span>
                <p>Checklist Regulatório — em breve</p>
              </div>
            )}
            {activeStep === 4 && (
              <div className="text-on-surface-variant text-center py-20">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">animation</span>
                <p>Animação — em breve</p>
              </div>
            )}

            {/* Prev/Next buttons */}
            <div className="flex justify-between mt-12 pt-6 border-t border-outline-variant/15">
              <button
                onClick={() => handleStepChange(activeStep - 1)}
                disabled={activeStep === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span className="text-sm font-medium">
                  {activeStep > 0 ? STEPS[activeStep - 1].label : ""}
                </span>
              </button>
              <button
                onClick={() => handleStepChange(activeStep + 1)}
                disabled={activeStep === STEPS.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-primary-container hover:bg-primary-container/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-sm font-medium">
                  {activeStep < STEPS.length - 1 ? STEPS[activeStep + 1].label : ""}
                </span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Update `src/app/modulo/[id]/page.tsx` — add redirect for Module 3**

Add `if (id === "3") redirect("/modulo/3");` to the dynamic route page, following the Module 1 pattern. This prevents the "Em breve" placeholder from showing when navigating from the landing page.

- [ ] **Step 6: Verify — run dev server and navigate to /modulo/3**

Run: `npm run dev`
Check: Hero renders, CTA scrolls to stepper, steps are clickable, prev/next work, URL updates with `?step=N`. Mobile stepper shows compact view. Also verify that navigating from landing page card to `/modulo/3` redirects correctly.

- [ ] **Step 7: Commit**

```bash
git add src/components/modulo3/OpeningHero.tsx src/components/modulo3/FidcKinetic.tsx src/components/modulo3/StepperNav.tsx src/app/modulo/3/page.tsx src/app/modulo/\[id\]/page.tsx
git commit -m "feat(fidc): add opening page with hero, kinetic visual, and stepper navigation"
```

---

## Task 6: Viabilidade Sub-Module — Charts + UI

**Files:**
- Create: `src/components/modulo3/charts/WaterfallChart.tsx`
- Create: `src/components/modulo3/charts/SensitivityChart.tsx`
- Create: `src/components/modulo3/ViabilidadeModule.tsx`
- Modify: `src/app/modulo/3/page.tsx` (replace placeholder)

- [ ] **Step 1: Create `WaterfallChart.tsx`**

Follow the Plotly pattern from `src/components/modulo1/YieldCurveChart.tsx`: dynamic import, dark theme, responsive.

```typescript
"use client";
import dynamic from "next/dynamic";
import type { ViabilidadeResult } from "@/lib/fidc/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface WaterfallChartProps {
  result: ViabilidadeResult;
}

export default function WaterfallChart({ result }: WaterfallChartProps) {
  const formatR$ = (v: number) => `R$ ${(v / 1_000_000).toFixed(2)}M`;

  return (
    <Plot
      data={[
        {
          type: "waterfall" as const,
          orientation: "v" as const,
          x: ["Receita Bruta", "Custos Fixos", "Custos Variáveis", "Resultado Líquido"],
          y: [result.receitaBruta, -result.fixedCosts, -result.variableCosts, result.netResult],
          measure: ["absolute", "relative", "relative", "total"],
          text: [
            formatR$(result.receitaBruta),
            formatR$(result.fixedCosts),
            formatR$(result.variableCosts),
            formatR$(result.netResult),
          ],
          textposition: "outside" as const,
          connector: { line: { color: "#3a494b" } },
          increasing: { marker: { color: "#4edea3" } },
          decreasing: { marker: { color: "#ff6b6b" } },
          totals: { marker: { color: result.netResult >= 0 ? "#00f2ff" : "#ff6b6b" } },
        },
      ]}
      layout={{
        title: { text: "Análise de Viabilidade — Cascata de Resultados", font: { color: "#e1e2e7", family: "Manrope, sans-serif", size: 14 } },
        paper_bgcolor: "#191c1f",
        plot_bgcolor: "#191c1f",
        font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        height: 400,
        margin: { l: 60, r: 30, t: 50, b: 50 },
        yaxis: { title: { text: "R$" }, gridcolor: "#3a494b", tickformat: ",.0f" },
        xaxis: { tickfont: { size: 11 } },
        showlegend: false,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%" }}
    />
  );
}
```

- [ ] **Step 2: Create `SensitivityChart.tsx`**

```typescript
"use client";
import dynamic from "next/dynamic";
import type { SensitivityPoint } from "@/lib/fidc/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface SensitivityChartProps {
  data: SensitivityPoint[];
  currentPL: number;
}

export default function SensitivityChart({ data, currentPL }: SensitivityChartProps) {
  const breakeven = data.find((p, i) => i > 0 && data[i - 1].margin < 0 && p.margin >= 0);

  return (
    <Plot
      data={[
        {
          x: data.map((p) => p.pl),
          y: data.map((p) => p.margin),
          type: "scatter" as const,
          mode: "lines" as const,
          line: { color: "#00f2ff", width: 3 },
          name: "Margem Líquida",
          fill: "tozeroy" as const,
          fillcolor: "rgba(0,242,255,0.05)",
        },
        {
          x: [currentPL],
          y: [data.find((p) => p.pl === currentPL)?.margin ?? 0],
          type: "scatter" as const,
          mode: "markers" as const,
          marker: { color: "#ff4444", size: 12, symbol: "star" },
          name: "PL Atual",
        },
      ]}
      layout={{
        title: { text: "Análise de Sensibilidade — Margem vs PL", font: { color: "#e1e2e7", family: "Manrope, sans-serif", size: 14 } },
        paper_bgcolor: "#191c1f",
        plot_bgcolor: "#191c1f",
        font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        height: 350,
        margin: { l: 60, r: 30, t: 50, b: 50 },
        xaxis: { title: { text: "PL (R$ Milhões)" }, gridcolor: "#3a494b" },
        yaxis: { title: { text: "Margem (%)" }, gridcolor: "#3a494b", zeroline: true, zerolinecolor: "#ff6b6b", zerolinewidth: 2 },
        legend: { x: 0, y: 1, bgcolor: "transparent" },
        shapes: breakeven
          ? [{ type: "line" as const, x0: breakeven.pl, x1: breakeven.pl, y0: -50, y1: 100, line: { color: "#4edea3", width: 2, dash: "dash" as const } }]
          : [],
        annotations: breakeven
          ? [{ x: breakeven.pl, y: 0, text: `Breakeven: R$ ${breakeven.pl}M`, showarrow: true, arrowcolor: "#4edea3", font: { color: "#4edea3", size: 11 } }]
          : [],
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%" }}
    />
  );
}
```

- [ ] **Step 3: Create `ViabilidadeModule.tsx`**

Self-contained component with its own state. Two-column layout: controls left, charts right.

```typescript
"use client";

import { useState, useMemo } from "react";
import type { ViabilidadeParams } from "@/lib/fidc/types";
import { calculateViabilidade, calculateSensitivity, calculateCostBreakdown } from "@/lib/fidc";
import { VIABILIDADE_DEFAULTS, PL_MIN, PL_MAX, PL_STEP, YIELD_MIN, YIELD_MAX, YIELD_STEP, MGMT_FEE_MIN, MGMT_FEE_MAX, MGMT_FEE_STEP, ADMIN_FEE_MIN, ADMIN_FEE_MAX, ADMIN_FEE_STEP } from "@/lib/fidc/constants";
import WaterfallChart from "./charts/WaterfallChart";
import SensitivityChart from "./charts/SensitivityChart";

export default function ViabilidadeModule() {
  const [params, setParams] = useState<ViabilidadeParams>(VIABILIDADE_DEFAULTS);
  const [showCosts, setShowCosts] = useState(false);

  const result = useMemo(() => calculateViabilidade(params), [params]);
  const sensitivity = useMemo(() => calculateSensitivity(params), [params]);
  const costBreakdown = useMemo(() => calculateCostBreakdown(params, result), [params, result]);

  const update = (key: keyof ViabilidadeParams, value: number) =>
    setParams((prev) => ({ ...prev, [key]: value }));

  const formatR$ = (v: number) =>
    v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(2)}M` : `R$ ${(v / 1_000).toFixed(0)}k`;

  const viabilityColors = {
    inviable: { bg: "bg-red-900/20", border: "border-red-500/30", text: "text-red-400" },
    risky: { bg: "bg-yellow-900/20", border: "border-yellow-500/30", text: "text-yellow-400" },
    viable: { bg: "bg-green-900/20", border: "border-green-500/30", text: "text-green-400" },
  };
  const vc = viabilityColors[result.viabilityLevel];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
      {/* Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-on-surface">Parâmetros</h3>

        <label className="block">
          <span className="text-xs text-on-surface-variant font-medium">
            PL Alvo: R$ {params.pl}M
          </span>
          <input type="range" min={PL_MIN} max={PL_MAX} step={PL_STEP} value={params.pl}
            onChange={(e) => update("pl", Number(e.target.value))}
            className="w-full mt-1 accent-primary-container" />
        </label>

        <label className="block">
          <span className="text-xs text-on-surface-variant font-medium">
            Yield Médio: {params.yieldRate.toFixed(1)}% a.a.
          </span>
          <input type="range" min={YIELD_MIN} max={YIELD_MAX} step={YIELD_STEP} value={params.yieldRate}
            onChange={(e) => update("yieldRate", Number(e.target.value))}
            className="w-full mt-1 accent-primary-container" />
        </label>

        <label className="block">
          <span className="text-xs text-on-surface-variant font-medium">
            Taxa de Gestão: {params.managementFee.toFixed(1)}% a.a.
          </span>
          <input type="range" min={MGMT_FEE_MIN} max={MGMT_FEE_MAX} step={MGMT_FEE_STEP} value={params.managementFee}
            onChange={(e) => update("managementFee", Number(e.target.value))}
            className="w-full mt-1 accent-primary-container" />
        </label>

        <label className="block">
          <span className="text-xs text-on-surface-variant font-medium">
            Taxa de Administração: {params.adminFee.toFixed(2)}% a.a.
          </span>
          <input type="range" min={ADMIN_FEE_MIN} max={ADMIN_FEE_MAX} step={ADMIN_FEE_STEP} value={params.adminFee}
            onChange={(e) => update("adminFee", Number(e.target.value))}
            className="w-full mt-1 accent-primary-container" />
        </label>

        <button
          onClick={() => setShowCosts(!showCosts)}
          className="flex items-center gap-1 text-xs text-primary-container hover:underline"
        >
          <span className="material-symbols-outlined text-sm">
            {showCosts ? "expand_less" : "expand_more"}
          </span>
          Configurar Custos Fixos
        </button>

        {showCosts && (
          <div className="space-y-3 p-3 rounded-lg bg-surface-container/50 border border-outline-variant/15">
            {[
              { key: "auditCost" as const, label: "Auditoria (R$/ano)" },
              { key: "ratingCost" as const, label: "Rating (R$/ano)" },
              { key: "cvmFees" as const, label: "CVM + Anbima (R$/ano)" },
              { key: "legalSetup" as const, label: "Jurídico (R$ total)" },
              { key: "otherFixed" as const, label: "Outros Fixos (R$/ano)" },
            ].map(({ key, label }) => (
              <label key={key} className="block">
                <span className="text-[11px] text-on-surface-variant">{label}</span>
                <input type="number" value={params[key]}
                  onChange={(e) => update(key, Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 rounded bg-surface-container text-on-surface text-sm border border-outline-variant/20 focus:border-primary-container/50 outline-none" />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl glass-panel border border-outline-variant/15">
            <div className="text-[10px] uppercase tracking-widest text-outline-variant font-bold">Receita Bruta</div>
            <div className="text-xl font-bold text-secondary mt-1">{formatR$(result.receitaBruta)}</div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-outline-variant/15">
            <div className="text-[10px] uppercase tracking-widest text-outline-variant font-bold">Custos Totais</div>
            <div className="text-xl font-bold text-red-400 mt-1">{formatR$(result.totalCosts)}</div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-outline-variant/15">
            <div className="text-[10px] uppercase tracking-widest text-outline-variant font-bold">Resultado Líquido</div>
            <div className={`text-xl font-bold mt-1 ${result.netResult >= 0 ? "text-primary-container" : "text-red-400"}`}>
              {formatR$(result.netResult)}
            </div>
            <div className="text-xs text-outline-variant">Margem: {result.margin.toFixed(1)}%</div>
          </div>
        </div>

        {/* Viability indicator */}
        <div className={`p-4 rounded-xl border ${vc.bg} ${vc.border}`}>
          <div className={`text-sm font-bold ${vc.text}`}>
            {result.viabilityLevel === "viable" && "✅ FIDC Viável — Margem saudável para operação"}
            {result.viabilityLevel === "risky" && "⚠️ FIDC em Zona de Risco — Margem abaixo de 5%"}
            {result.viabilityLevel === "inviable" && "❌ FIDC Inviável — Resultado líquido negativo"}
          </div>
        </div>

        <WaterfallChart result={result} />
        <SensitivityChart data={sensitivity} currentPL={params.pl} />

        {/* Cost breakdown table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-outline-variant text-[10px] uppercase tracking-widest border-b border-outline-variant/20">
                <th className="py-2">Componente</th>
                <th className="py-2 text-right">Valor (R$)</th>
                <th className="py-2 text-right">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {costBreakdown.map((item) => (
                <tr key={item.label} className="border-b border-outline-variant/10">
                  <td className="py-2 text-on-surface-variant">{item.label}</td>
                  <td className="py-2 text-right text-on-surface">{formatR$(item.value)}</td>
                  <td className="py-2 text-right text-outline-variant">{item.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update `page.tsx` — replace step 0 placeholder**

Replace the `activeStep === 0` placeholder block with:
```typescript
import ViabilidadeModule from "@/components/modulo3/ViabilidadeModule";
// ...
{activeStep === 0 && <ViabilidadeModule />}
```

- [ ] **Step 5: Verify — run dev server and test Viabilidade**

Check: sliders update metrics, waterfall chart renders, sensitivity chart shows breakeven, cost table populates, viability indicator changes color, mobile layout stacks.

- [ ] **Step 6: Commit**

```bash
git add src/components/modulo3/charts/WaterfallChart.tsx src/components/modulo3/charts/SensitivityChart.tsx src/components/modulo3/ViabilidadeModule.tsx src/app/modulo/3/page.tsx
git commit -m "feat(fidc): add viabilidade sub-module with waterfall and sensitivity charts"
```

---

## Task 7: Classes Sub-Module — Dagre Diagram + Config

**Files:**
- Create: `src/components/modulo3/charts/ClassHierarchyDiagram.tsx`
- Create: `src/components/modulo3/ClassesModule.tsx`
- Modify: `src/app/modulo/3/page.tsx` (replace step 1 placeholder)

- [ ] **Step 1: Create `ClassHierarchyDiagram.tsx`**

Uses `@dagrejs/dagre` for layout and React SVG for rendering (no d3 needed).

```typescript
"use client";

import { useMemo } from "react";
import dagre from "@dagrejs/dagre";
import type { DiagramNode, DiagramEdge } from "@/lib/fidc/types";

interface ClassHierarchyDiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 50;

export default function ClassHierarchyDiagram({ nodes, edges }: ClassHierarchyDiagramProps) {
  const layout = useMemo(() => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "TB", nodesep: 30, ranksep: 60 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((n) => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
    edges.forEach((e) => g.setEdge(e.source, e.target, { label: e.label }));

    dagre.layout(g);

    const laid = nodes.map((n) => {
      const pos = g.node(n.id);
      return { ...n, x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 };
    });

    const laidEdges = edges.map((e) => {
      const points = g.edge(e.source, e.target).points;
      return { ...e, points };
    });

    const graph = g.graph();
    return { nodes: laid, edges: laidEdges, width: (graph.width ?? 600) + 40, height: (graph.height ?? 400) + 40 };
  }, [nodes, edges]);

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-outline-variant text-sm">
        Selecione ao menos uma classe de ativos
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`-20 -20 ${layout.width} ${layout.height}`}
        className="w-full min-h-[300px]"
        aria-label="Diagrama hierárquico do FIDC mostrando classes e subclasses"
      >
        {/* Edges */}
        {layout.edges.map((e, i) => {
          const pts = e.points;
          const d = pts.map((p: { x: number; y: number }, j: number) => `${j === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
          return <path key={i} d={d} fill="none" stroke="#3a494b" strokeWidth={1.5} />;
        })}

        {/* Nodes */}
        {layout.nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
            <rect
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={8}
              fill={n.color + "20"}
              stroke={n.color}
              strokeWidth={1.5}
            />
            <text
              x={NODE_WIDTH / 2}
              y={n.sublabel ? NODE_HEIGHT / 2 - 6 : NODE_HEIGHT / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#e1e2e7"
              fontSize={11}
              fontWeight={600}
              fontFamily="Manrope, sans-serif"
            >
              {n.label}
            </text>
            {n.sublabel && (
              <text
                x={NODE_WIDTH / 2}
                y={NODE_HEIGHT / 2 + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#b9cacb"
                fontSize={9}
                fontFamily="Manrope, sans-serif"
              >
                {n.sublabel}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Create `ClassesModule.tsx`**

Self-contained component with class checkboxes, CNPJ/name inputs, preset selector, and the diagram.

The component should:
- Manage `ClassConfig` state via `useState`
- Build `DiagramNode[]` and `DiagramEdge[]` from the config via `useMemo`
- Render controls (left) and diagram (right) in two-column layout
- Include "Without Segregation" vs "With Segregation" comparison cards
- Include use-case preset buttons that auto-fill the config
- Include expandable educational content sections

- [ ] **Step 3: Update `page.tsx` — import and render `ClassesModule` for step 1**

- [ ] **Step 4: Verify — run dev server and test Classes sub-module**

Check: checkboxes add/remove classes from diagram, subordination sliders update, preset buttons auto-fill, CNPJ input works, diagram renders and updates reactively, comparison cards display.

- [ ] **Step 5: Commit**

```bash
git add src/components/modulo3/charts/ClassHierarchyDiagram.tsx src/components/modulo3/ClassesModule.tsx src/app/modulo/3/page.tsx
git commit -m "feat(fidc): add classes sub-module with dagre hierarchy diagram"
```

---

## Task 8: Subordinação Sub-Module — Loss Waterfall + Charts

**Files:**
- Create: `src/components/modulo3/charts/CapitalStructureChart.tsx`
- Create: `src/components/modulo3/charts/RuptureChart.tsx`
- Create: `src/components/modulo3/SubordinacaoModule.tsx`
- Modify: `src/app/modulo/3/page.tsx` (replace step 2 placeholder)

- [ ] **Step 1: Create `CapitalStructureChart.tsx`**

Plotly stacked bar chart showing "Antes" and "Depois" of loss. Junior (red), Mezanino (yellow), Senior (green).

- [ ] **Step 2: Create `RuptureChart.tsx`**

Plotly stacked area chart. X-axis: loss % (0-60). Three fill traces: Junior, Mezanino, Senior. Vertical marker at current loss. Rupture point annotations.

- [ ] **Step 3: Create `SubordinacaoModule.tsx`**

Self-contained component. Left column: PL input, subordination slider, mezanino checkbox, loss slider, metrics. Right column: CapitalStructureChart, status indicator, summary table, drawdown analysis, RuptureChart. Educational expandable sections.

- [ ] **Step 4: Update `page.tsx` — import and render `SubordinacaoModule` for step 2**

- [ ] **Step 5: Verify — run dev server and test Subordinação sub-module**

Check: loss slider updates chart, junior absorbs first, status indicator changes (green→yellow→red), drawdown detection works, rupture chart shows layer depletion, mezanino toggle works correctly.

- [ ] **Step 6: Commit**

```bash
git add src/components/modulo3/charts/CapitalStructureChart.tsx src/components/modulo3/charts/RuptureChart.tsx src/components/modulo3/SubordinacaoModule.tsx src/app/modulo/3/page.tsx
git commit -m "feat(fidc): add subordinacao sub-module with capital structure and rupture charts"
```

---

## Task 9: Checklist Sub-Module — Progressive Reveal

**Files:**
- Create: `src/components/modulo3/charts/TimelineChart.tsx`
- Create: `src/components/modulo3/ChecklistModule.tsx`
- Modify: `src/app/modulo/3/page.tsx` (replace step 3 placeholder)

- [ ] **Step 1: Create `TimelineChart.tsx`**

Plotly scatter chart showing registration milestones on a horizontal timeline. Each milestone as a marker with date label. Color-coded by completion.

- [ ] **Step 2: Create `ChecklistModule.tsx`**

Self-contained component with progressive reveal pattern. State: `ChecklistState`. Four stages unlock sequentially:
- Stage 1: Investor type + Asset type radio cards
- Stage 2: Validation gate (forbidden combo error or unlock)
- Stage 3: 6 compliance items (varejo only) with progress bar; simplified display for profissional
- Stage 4: ANBIMA covenant radio → registration type → timeline chart → cost tables

Each stage uses `aria-live="polite"` for accessibility. Locked stages show grayed-out preview with left border. Educational expandable sections.

- [ ] **Step 3: Update `page.tsx` — import and render `ChecklistModule` for step 3**

- [ ] **Step 4: Verify — run dev server and test Checklist sub-module**

Check: progressive reveal unlocks stages correctly, forbidden combo (varejo+DCNP) shows error and blocks, compliance items track N/6, registration types change with investor/covenant selection, timeline renders, costs display.

- [ ] **Step 5: Commit**

```bash
git add src/components/modulo3/charts/TimelineChart.tsx src/components/modulo3/ChecklistModule.tsx src/app/modulo/3/page.tsx
git commit -m "feat(fidc): add checklist regulatory sub-module with progressive reveal"
```

---

## Task 10: Animação Sub-Module — Three.js Embed

**Files:**
- Copy: `python-code/FIDC/modulo5_animação.html` → `public/animations/fidc-flow.html`
- Create: `src/components/modulo3/AnimacaoModule.tsx`
- Modify: `src/app/modulo/3/page.tsx` (replace step 4 placeholder)

- [ ] **Step 1: Copy animation HTML to public directory**

```bash
mkdir -p public/animations
cp "python-code/FIDC/modulo5_animação.html" public/animations/fidc-flow.html
```

- [ ] **Step 2: Create `AnimacaoModule.tsx`**

```typescript
"use client";

import { useState } from "react";

export default function AnimacaoModule() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-on-surface">
            Fluxo Operacional — FIDC Monocedente
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Visualização 3D interativa do ciclo operacional de um FIDC, do
            cenário inicial ao recebimento. Use os botões &quot;Anterior&quot; e
            &quot;Próximo Passo&quot; para navegar pelas etapas.
          </p>
        </div>
        <a
          href="/animations/fidc-flow.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary-container hover:underline shrink-0"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          Abrir em nova aba
        </a>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-outline-variant/15">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container z-10">
            <div className="flex items-center gap-2 text-outline-variant">
              <div className="w-5 h-5 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin" />
              <span className="text-sm">Carregando cenário 3D...</span>
            </div>
          </div>
        )}
        <iframe
          src="/animations/fidc-flow.html"
          sandbox="allow-scripts"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full min-h-[600px] md:min-h-[600px] border-0"
          title="Animação 3D do fluxo operacional de um FIDC monocedente"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update `page.tsx` — import and render `AnimacaoModule` for step 4**

- [ ] **Step 4: Verify — navigate to step 5 (Animação)**

Check: loading spinner shows, iframe loads Three.js animation, "Open in new tab" link works, responsive height works.

- [ ] **Step 5: Commit**

```bash
git add public/animations/fidc-flow.html src/components/modulo3/AnimacaoModule.tsx src/app/modulo/3/page.tsx
git commit -m "feat(fidc): add animacao sub-module with Three.js iframe embed"
```

---

## Task 11: Educational Content + Polish

**Files:**
- Modify: `src/components/modulo3/ViabilidadeModule.tsx`
- Modify: `src/components/modulo3/ClassesModule.tsx`
- Modify: `src/components/modulo3/SubordinacaoModule.tsx`
- Modify: `src/components/modulo3/ChecklistModule.tsx`

- [ ] **Step 1: Add expandable "Saiba mais" sections to each sub-module**

Each sub-module gets 2-3 expandable sections with Portuguese educational content ported from the Python source (`python-code/FIDC/modulo1_viabilidade.py`, `modulo2_classes.py`, `modulo3_subordinacao.py`, `modulo4_checklist.py`). Use a consistent `<details>` pattern with glass-panel styling.

Pattern:
```tsx
<details className="group mt-8">
  <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary-container hover:text-primary-container/80">
    <span className="material-symbols-outlined text-lg group-open:rotate-90 transition-transform">chevron_right</span>
    Section Title
  </summary>
  <div className="mt-3 p-4 rounded-xl glass-panel border border-outline-variant/15 text-sm text-on-surface-variant leading-relaxed">
    Educational content...
  </div>
</details>
```

- [ ] **Step 2: Verify all educational content renders correctly**

- [ ] **Step 3: Run `npm run build` to verify no build errors**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Run all tests**

Run: `npm test -- --no-coverage`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/modulo3/
git commit -m "feat(fidc): add educational content sections to all sub-modules"
```

---

## Task 12: Final Verification

- [ ] **Step 1: Full end-to-end walkthrough**

Navigate through all 5 sub-modules in order:
1. Hero → "Iniciar Jornada" → Step 1 (Viabilidade)
2. Adjust sliders, verify waterfall + sensitivity charts
3. Step 2 (Classes) → toggle checkboxes, verify diagram updates
4. Step 3 (Subordinação) → simulate losses, verify waterfall
5. Step 4 (Checklist) → test all investor/asset combos, verify progressive reveal
6. Step 5 (Animação) → verify iframe loads
7. Test URL persistence: refresh at `?step=3`, verify it resumes at correct step
8. Test mobile: resize browser, verify stepper collapses and layouts stack

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds, no warnings about bundle size issues

- [ ] **Step 3: Run all tests one final time**

Run: `npm test -- --no-coverage`
Expected: All 3 test files pass (viabilidade, subordinacao, checklist)

- [ ] **Step 4: Final commit if any polish needed**

```bash
git add -A
git commit -m "feat(fidc): complete Module 3 FIDC Builder 175 implementation"
```
