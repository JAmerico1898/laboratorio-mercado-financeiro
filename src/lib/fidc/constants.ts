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
