import type {
  StepConfig,
  AnimationStage,
  BankMetrics,
  QuizQuestion,
} from "./types";

export const STEPS: StepConfig[] = [
  { index: 0, label: "Introdução", icon: "info" },
  { index: 1, label: "RWA", icon: "balance" },
  { index: 2, label: "Provisões", icon: "savings" },
  { index: 3, label: "Alavancagem", icon: "compress" },
  { index: 4, label: "Construa seu Banco", icon: "account_balance" },
  { index: 5, label: "Animação", icon: "movie" },
  { index: 6, label: "Quiz", icon: "quiz" },
];

export const RISK_WEIGHTS = {
  cash: 0,
  govBonds: 0.1,
  mortgages: 0.5,
  corpLoans: 1.0,
  highYield: 1.2,
  unrated: 1.5,
} as const;

export const ASSET_LABELS: Record<string, string> = {
  cash: "Caixa",
  govBonds: "Títulos Públicos",
  mortgages: "Hipotecas",
  corpLoans: "Corp. IG",
  highYield: "High-Yield",
  unrated: "Não Classificado",
};

// Regulatory thresholds
export const CAR_MINIMUM = 10.5;
export const CAR_REGULATORY = 8.0;
export const LEVERAGE_MINIMUM = 3.0;
export const REGULATORY_CAPITAL = 10.5; // $10.5M fixed capital in RWA playground
export const TOTAL_ASSETS = 100; // $100M in RWA playground

// Provisioning
export const SIMULATION_YEARS = [2025, 2026, 2027, 2028, 2029];
export const LGD = 0.5;
export const BASE_IFRS9_RATE = 0.01; // 1% per year

export const PD_RATES: Record<string, number[]> = {
  Boom: [0.5, 0.4, 0.3, 0.4, 0.5],
  Normal: [1.0, 1.2, 1.5, 1.8, 1.6],
  Recessão: [2.0, 3.5, 6.0, 12.0, 8.0],
};

export const FRONT_PROPORTIONS = [0.35, 0.3, 0.2, 0.1, 0.05]; // Res 4966 in recession
export const BACK_PROPORTIONS = [0.0, 0.05, 0.15, 0.35, 0.45]; // Res 2682 in recession

// Simulation defaults (Build Your Bank)
export const SIM_DEFAULTS = {
  startYear: 2025,
  endYear: 2027,
  initialCapital: 150,
  initialAssets: 1000,
  initialRwaPercent: 70,
  payoutRatio: 0.5,
  normalProvisionRate: 0.008,
  stressProvisionRate: 0.04,
};

// Animation stages (12 stages from the Python embedded React animation)
export const ANIMATION_STAGES: AnimationStage[] = [
  {
    id: "intro",
    title: "Regulação Prudencial Bancária",
    subtitle: "Os Acordos de Basileia",
    description:
      "Uma jornada pelos pilares que sustentam a estabilidade financeira global. Os Acordos de Basileia representam o padrão internacional para regulação bancária, estabelecendo requisitos de capital que protegem depositantes e a estabilidade financeira.",
    icon: "🏛️",
  },
  {
    id: "crisis",
    title: "A Crise de 2008",
    subtitle: "Por que precisamos de regulação?",
    description:
      "Bancos operavam com índices de capital menores que 4%. Hipotecas subprime e produtos estruturados sem buffers adequados levaram ao colapso sistêmico. A crise demonstrou a necessidade de regulação prudencial mais rigorosa.",
    icon: "📉",
  },
  {
    id: "basel1",
    title: "Basileia I (1988)",
    subtitle: "O Nascimento da Regulação de Capital",
    description:
      "Introduziu o conceito revolucionário de capital mínimo de 8% sobre ativos ponderados pelo risco. Pela primeira vez, bancos internacionais seguiriam padrões uniformes de capitalização.",
    icon: "📜",
  },
  {
    id: "rwa",
    title: "Ativos Ponderados pelo Risco",
    subtitle: "RWA - Risk-Weighted Assets",
    description:
      "Diferentes classes de ativos carregam diferentes pesos de risco. Caixa = 0%, Títulos Soberanos = 0-20%, Hipotecas = 35-75%, Corporativo = 100%. Este conceito é o coração da regulação bancária.",
    icon: "⚖️",
  },
  {
    id: "basel2",
    title: "Basileia II (2004)",
    subtitle: "Os Três Pilares",
    description:
      "Pilar 1: Requerimentos Mínimos de Capital | Pilar 2: Revisão Supervisória | Pilar 3: Disciplina de Mercado. Uma estrutura mais sofisticada que reconhece a complexidade do risco bancário moderno.",
    icon: "🏗️",
  },
  {
    id: "basel3",
    title: "Basileia III (2010)",
    subtitle: "Resposta à Crise Financeira",
    description:
      "Exigência de capital aumenta para mínimo de 10,5% total. Introdução do Índice de Alavancagem de 3%. Requisitos mais rigorosos para garantir a resiliência do sistema bancário.",
    icon: "🛡️",
  },
  {
    id: "car",
    title: "Índice de Adequação de Capital",
    subtitle: "CAR - Capital Adequacy Ratio",
    description:
      "CAR = Capital Total / RWA × 100%. Mínimo regulatório: 10,5%. Bancos bem capitalizados superam 15%.",
    icon: "📊",
  },
  {
    id: "leverage",
    title: "Índice de Alavancagem",
    subtitle: "Restrição Dupla",
    description:
      "Leverage Ratio = Tier 1 Capital / Ativos Totais × 100%. Mínimo: 3%. Complementa o CAR para evitar arbitragem regulatória e acúmulo excessivo de ativos de baixo risco.",
    icon: "🔒",
  },
  {
    id: "ifrs9",
    title: "IFRS 9 vs IAS 39",
    subtitle: "Provisão para Perdas Esperadas",
    description:
      "IAS 39: Perda Incorrida (reativo) - reconhece perdas apenas quando ocorrem. IFRS 9: Perda Esperada (prospectivo) - provisiona antecipadamente. Modelo de 3 estágios reduz a prociclicalidade.",
    icon: "📈",
  },
  {
    id: "basel4",
    title: "Basileia IV (2023)",
    subtitle: "Refinamentos Finais",
    description:
      "Revisão dos pesos de risco padronizados, piso de output de 72,5% para modelos internos, e tratamento revisado de risco operacional. O framework continua evoluindo.",
    icon: "🔧",
  },
  {
    id: "simulation",
    title: "Simulação Integrada",
    subtitle: "Gestão Estratégica de Capital",
    description:
      "Equilibre crescimento, rentabilidade e conformidade regulatória. Um CFO bancário enfrenta decisões complexas: expandir ativos, reter lucros, pagar dividendos - tudo mantendo os índices adequados.",
    icon: "🎮",
  },
  {
    id: "conclusion",
    title: "Estabilidade Financeira",
    subtitle: "O Objetivo Final",
    description:
      "Regulação prudencial protege depositantes, previne crises sistêmicas e garante a resiliência do sistema financeiro global. Os Acordos de Basileia são fundamentais para um sistema bancário saudável.",
    icon: "🌍",
  },
];

export const STAGE_METRICS_MAP: Record<number, BankMetrics> = {
  0: { capital: 150, assets: 1000, rwa: 600, provisions: 20, car: 25, leverage: 15 },
  1: { capital: 30, assets: 1000, rwa: 800, provisions: 5, car: 3.75, leverage: 3 },
  2: { capital: 80, assets: 1000, rwa: 600, provisions: 15, car: 13.3, leverage: 8 },
  3: { capital: 100, assets: 1000, rwa: 500, provisions: 18, car: 20, leverage: 10 },
  4: { capital: 100, assets: 1000, rwa: 550, provisions: 20, car: 18.2, leverage: 10 },
  5: { capital: 120, assets: 1000, rwa: 600, provisions: 25, car: 20, leverage: 12 },
  6: { capital: 105, assets: 1000, rwa: 600, provisions: 22, car: 17.5, leverage: 10.5 },
  7: { capital: 105, assets: 1000, rwa: 400, provisions: 22, car: 26.25, leverage: 10.5 },
  8: { capital: 110, assets: 1000, rwa: 580, provisions: 35, car: 19, leverage: 11 },
  9: { capital: 115, assets: 1000, rwa: 620, provisions: 30, car: 18.5, leverage: 11.5 },
  10: { capital: 125, assets: 1200, rwa: 700, provisions: 28, car: 17.9, leverage: 10.4 },
  11: { capital: 150, assets: 1000, rwa: 600, provisions: 25, car: 25, leverage: 15 },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    type: "radio",
    question: "Qual o capital mínimo exigido pelo Basel III (Pilar 1)?",
    options: ["4%", "8%", "10.5%"],
    correctAnswer: "10.5%",
  },
  {
    id: "q2",
    type: "radio",
    question: "O que o Leverage Ratio tenta evitar?",
    options: [
      "Risco de crédito",
      "Alavancagem excessiva independentemente do risco dos ativos",
      "Risco operacional",
    ],
    correctAnswer:
      "Alavancagem excessiva independentemente do risco dos ativos",
  },
  {
    id: "q3",
    type: "checkbox",
    question: "Res 4966 é mais conservadora que Res 2682 em recessões",
    correctAnswer: true,
  },
];
