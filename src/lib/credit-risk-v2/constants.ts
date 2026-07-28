import { FeatureDefinitionV2, FeatureTier } from "./types";

/**
 * Módulo 2 — scorecard de originação.
 *
 * Uma variável da interface pode corresponder a MAIS DE UMA coluna da matriz de desenho
 * (`columns`): `home_ownership` vira três dummies e `emp_length` carrega o próprio indicador
 * de ausência. A regra de contagem é a de um scorecard bancário — uma variável = uma
 * feature, independente de quantas colunas gera.
 *
 * As camadas (`tier`) foram atribuídas por ablação medida, não por opinião — ver TRIALS.md
 * (T29) no repositório do modelo.
 */
export const FEATURES_V2: FeatureDefinitionV2[] = [
  // ---------------------------------------------------------------- CORE
  {
    key: "int_rate",
    label: "Taxa de Juros",
    description:
      "Taxa de juros contratada na operação. É a variável mais forte do modelo: sozinha entrega AUC de 0,706, cerca de 96% do poder do modelo completo. Reflete a própria precificação de risco da LendingClub.",
    columns: ["int_rate"],
    tier: "CORE",
    defaultSelected: true,
  },
  {
    key: "dti",
    label: "Dívida/Renda (DTI)",
    description:
      "Razão entre os pagamentos mensais de dívidas e a renda mensal informada. Atenção: por definição da LendingClub, NÃO inclui o empréstimo que está sendo solicitado.",
    columns: ["dti"],
    tier: "CORE",
    defaultSelected: true,
  },
  {
    key: "fico_range_low",
    label: "FICO Score (originação)",
    description:
      "Limite inferior da faixa de FICO do tomador no momento da originação. Nesta base começa em 660 — a LendingClub já havia recusado os perfis abaixo disso.",
    columns: ["fico_range_low"],
    tier: "CORE",
    defaultSelected: true,
  },
  {
    key: "acc_open_past_24mths",
    label: "Contas Abertas (24 meses)",
    description:
      "Quantidade de linhas de crédito abertas nos últimos 24 meses. Abrir muitas contas em pouco tempo é sinal clássico de pressão de liquidez.",
    columns: ["acc_open_past_24mths"],
    tier: "CORE",
    defaultSelected: true,
  },
  {
    key: "loan_to_income",
    label: "Valor Solicitado / Renda",
    description:
      "Variável derivada: valor pedido dividido pela renda anual. Foi construída porque o DTI exclui o próprio empréstimo — esta razão mede o comprometimento que de fato existirá após a concessão. No screen univariado supera o próprio FICO.",
    columns: ["loan_to_income"],
    tier: "CORE",
    defaultSelected: true,
  },

  // ------------------------------------------------------------ MARGINAL
  {
    key: "term",
    label: "Prazo (36 / 60 meses)",
    description:
      "Prazo da operação em meses. Foi a segunda variável escolhida pela seleção automática, mas removê-la do modelo completo quase não custa AUC: a taxa de juros já carrega quase toda a sua informação.",
    columns: ["term"],
    tier: "MARGINAL",
    defaultSelected: true,
  },
  {
    key: "home_ownership",
    label: "Situação de Moradia",
    description:
      "Hipoteca, imóvel próprio ou aluguel. Variável categórica: liga três colunas indicadoras de uma vez, tendo 'outros' como categoria de referência. É a de maior coeficiente do modelo.",
    columns: ["home_mortgage", "home_own", "home_rent"],
    tier: "MARGINAL",
    defaultSelected: true,
  },
  {
    key: "emp_length",
    label: "Tempo de Emprego",
    description:
      "Anos de emprego, de 0 (menos de 1 ano) a 10 (10 ou mais). Liga também o indicador de ausência — e o achado curioso do modelo é que NÃO informar o tempo de emprego pesa 17 vezes mais do que o valor informado.",
    columns: ["emp_length", "emp_length_missing"],
    tier: "MARGINAL",
    defaultSelected: true,
  },
  {
    key: "mort_acc",
    label: "Contas de Hipoteca",
    description:
      "Número de contas de hipoteca no cadastro do tomador. Reduz o risco: sinaliza patrimônio e histórico de crédito de longo prazo.",
    columns: ["mort_acc"],
    tier: "MARGINAL",
    defaultSelected: true,
  },

  // --------------------------------------------------------------- NOISE
  {
    key: "loan_amnt",
    label: "Valor Solicitado",
    description:
      "Correlação de 0,979 com o Valor da Parcela. Ligue as duas juntas e NÃO olhe o AUC: ele mal se move (+0,00002). Olhe os coeficientes — 'Valor da Parcela' troca de sinal, de +0,09 para −1,27, e este aqui infla 8,5 vezes. O modelo continua prevendo igual e passa a ser impossível de interpretar.",
    columns: ["loan_amnt"],
    tier: "NOISE",
    defaultSelected: false,
  },
  {
    key: "installment",
    label: "Valor da Parcela",
    description:
      "Par colinear de 'Valor Solicitado'. Sozinha é inofensiva e tem coeficiente positivo, como manda a intuição. Junto com a outra, fica negativa — sugerindo que parcela maior reduz o risco, o que é absurdo. É esse o dano da colinearidade.",
    columns: ["installment"],
    tier: "NOISE",
    defaultSelected: false,
  },
  {
    key: "tax_liens",
    label: "Execuções Fiscais",
    description:
      "AUC univariado de 0,4986 — abaixo do acaso. Com 42 mil linhas de treino, acrescentá-la não piora nada (−0,00001 no teste): há dados demais para uma variável inútil causar estrago. Ela só passaria a atrapalhar em amostras pequenas.",
    columns: ["tax_liens"],
    tier: "NOISE",
    defaultSelected: false,
  },
];

/** Variáveis marcadas ao abrir o módulo: exatamente as 9 que a seleção automática escolheu. */
export const DEFAULT_FEATURES_V2 = FEATURES_V2.filter((f) => f.defaultSelected).map(
  (f) => f.key
);

/** Arquivos de dados do módulo, em public/data/. */
export const DATASET_TRAINING_V2 = "training_sample_v2.json";
export const DATASET_PRODUCTION_V2 = "testing_sample_v2.json";
export const DATASET_PRODUCTION_TRUE_V2 = "testing_sample_true_v2.json";

/**
 * Hiperparâmetros do gradiente deste scorecard.
 *
 * A implementação anterior usava learningRate = 0,01, que com 1.000 iterações NÃO converge. Isso não
 * atrapalha o AUC (a diferença é de 0,00005), mas achata os coeficientes: a parada precoce
 * age como regularização implícita e ESCONDE a patologia de colinearidade que este módulo
 * precisa demonstrar. Medido, com as variáveis colineares ligadas:
 *
 *   lr = 0,01 -> loan_amnt +0,0976 / installment +0,0142  (nada acontece)
 *   lr = 1,0  -> loan_amnt +1,3428 / installment -1,2283  (troca de sinal aparece)
 *   sklearn   -> loan_amnt +1,3798 / installment -1,2660  (referência convergida)
 *
 * Mesmo custo computacional, mesmas 1.000 iterações, mesmo AUC (0,72943). Testado em 40
 * combinações aleatórias de variáveis: nenhuma divergência.
 * Estes parâmetros são passados explicitamente na página; o default de
 * logistic-regression.ts permanece inalterado.
 */
export const LR_V2_LEARNING_RATE = 1.0;
export const LR_V2_MAX_ITERATIONS = 1000;
export const LR_V2_TOLERANCE = 1e-6;
export const LR_V2_REGULARIZATION = 1.0;

export const TIER_INFO: Record<
  FeatureTier,
  { label: string; hint: string; chip: string }
> = {
  // Usa os tokens do design system do app (globals.css), e não cores avulsas do Tailwind:
  // o tema define a própria paleta, então classes como `bg-emerald-500` não são geradas.
  CORE: {
    label: "Essencial",
    hint: "Remover custa AUC de forma mensurável.",
    chip: "bg-secondary/10 text-secondary border-secondary/30",
  },
  MARGINAL: {
    label: "Marginal",
    hint: "Contribuição pequena — ensina retornos decrescentes.",
    chip: "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/40",
  },
  NOISE: {
    label: "Sem contribuição",
    hint: "Não melhoram nem pioram o AUC. Olhe os COEFICIENTES, não a métrica.",
    chip: "bg-error/10 text-error border-error/30",
  },
};

/**
 * Traduz as chaves de variáveis da interface nas colunas da matriz de desenho.
 * A ordem das colunas segue a ordem de FEATURES_V2, para que o modelo seja reprodutível.
 */
export function expandColumns(selectedKeys: string[]): string[] {
  const selected = new Set(selectedKeys);
  return FEATURES_V2.filter((f) => selected.has(f.key)).flatMap((f) => f.columns);
}

/** Rótulo em português de cada COLUNA (não de cada variável), para a tabela de coeficientes. */
export const COLUMN_LABELS: Record<string, string> = {
  int_rate: "Taxa de Juros",
  dti: "Dívida/Renda (DTI)",
  fico_range_low: "FICO Score",
  acc_open_past_24mths: "Contas Abertas (24m)",
  loan_to_income: "Valor Solicitado / Renda",
  term: "Prazo (meses)",
  home_mortgage: "Moradia: Hipoteca",
  home_own: "Moradia: Imóvel Próprio",
  home_rent: "Moradia: Aluguel",
  emp_length: "Tempo de Emprego",
  emp_length_missing: "Tempo de Emprego não informado",
  mort_acc: "Contas de Hipoteca",
  loan_amnt: "Valor Solicitado (armadilha)",
  installment: "Valor da Parcela (armadilha)",
  tax_liens: "Execuções Fiscais (armadilha)",
};

/** Métricas de referência do modelo em Python, para o aluno comparar com o que o navegador produz. */
export const PYTHON_REFERENCE = {
  features: 9,
  testAuc: 0.7294,
  testKs: 0.3395,
  testGini: 0.4589,
  trainTestGap: 0.0044,
  ceilingAuc: 0.7362,
  ceilingGbmAuc: 0.7341,
  intRateAloneAuc: 0.7061,
  badRate: 0.1876,
  totalRows: 86138,
};
