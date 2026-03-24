import { FeatureDefinition } from "./types";

/** Curated features available for model training */
export const FEATURES: FeatureDefinition[] = [
  {
    key: "loan_amnt",
    label: "Valor do Empréstimo",
    description:
      "Valor da operação de crédito",
    defaultSelected: true,
  },
  {
    key: "int_rate",
    label: "Taxa de Juros",
    description:
      "Taxa de juros da operação de crédito",
    defaultSelected: true,
  },
  {
    key: "log_annual_inc",
    label: "Log Renda Anual",
    description:
      "Logaritmo natural da renda anual informada pelo tomador de crédito no momento do pleito",
    defaultSelected: true,
  },
  {
    key: "fico_score",
    label: "FICO Score",
    description:
      "Credit scoring do devedor da operação de crédito no momento da originação da operação de crédito",
    defaultSelected: true,
  },
  {
    key: "funded_amnt",
    label: "Valor Financiado",
    description:
      "Valor total comprometido (ou financiado) naquele empréstimo até aquele momento",
    defaultSelected: true,
  },
  {
    key: "dti",
    label: "Dívida/Renda (DTI)",
    description:
      "Razão entre os pagamentos mensais de operações de crédito pelo devedor e a renda do devedor",
    defaultSelected: false,
  },
  {
    key: "bc_util",
    label: "Utilização Cartão",
    description:
      "Relação entre o saldo total atual e o limite máximo de crédito em todas as contas de cartão de crédito",
    defaultSelected: false,
  },
  {
    key: "revol_util",
    label: "Utilização Rotativo",
    description:
      "Taxa de utilização de crédito rotativo, ou seja, a proporção do crédito disponível que o tomador está efetivamente utilizando",
    defaultSelected: false,
  },
  {
    key: "installment",
    label: "Prestação Mensal",
    description:
      "Valor da prestação mensal devida pelo tomador caso o empréstimo seja efetivamente originado",
    defaultSelected: false,
  },
  {
    key: "avg_cur_bal",
    label: "Saldo Médio Corrente",
    description:
      "Saldo corrente médio de todos os empréstimos",
    defaultSelected: false,
  },
  {
    key: "mort_acc",
    label: "Contas Imobiliárias",
    description:
      "Número de contas de financiamento imobiliário (hipotecas) mantidas pelo tomador",
    defaultSelected: false,
  },
  {
    key: "num_actv_rev_tl",
    label: "Contas Rotativas Ativas",
    description:
      "Número de contas rotativas atualmente ativas",
    defaultSelected: false,
  },
];

/** Default cutoff threshold */
export const DEFAULT_CUTOFF = 0.5;

/** Cutoff slider configuration */
export const CUTOFF_MIN = 0;
export const CUTOFF_MAX = 1;
export const CUTOFF_STEP = 0.01;

/** Train/test split ratio */
export const TEST_SIZE = 0.3;

/** Random seed for reproducibility */
export const RANDOM_SEED = 42;

/** Logistic regression hyperparameters */
export const LR_LEARNING_RATE = 0.01;
export const LR_MAX_ITERATIONS = 1000;
export const LR_TOLERANCE = 1e-6;
export const LR_REGULARIZATION = 1.0; // L2 regularization strength (C=1.0 equivalent → lambda=1/C=1.0)

/** Cutoff scenarios for comparison table */
export const CUTOFF_SCENARIOS = [0.3, 0.4, 0.5, 0.6, 0.7];

/** Risk probability bands */
export const RISK_BANDS = [
  { label: "0-20% (Risco Muito Baixo)", min: 0, max: 0.2 },
  { label: "20-40% (Risco Baixo)", min: 0.2, max: 0.4 },
  { label: "40-60% (Risco Médio)", min: 0.4, max: 0.6 },
  { label: "60-80% (Risco Alto)", min: 0.6, max: 0.8 },
  { label: "80-100% (Risco Muito Alto)", min: 0.8, max: 1.0 },
];

/** Default feature keys */
export const DEFAULT_FEATURES = FEATURES
  .filter((f) => f.defaultSelected)
  .map((f) => f.key);
