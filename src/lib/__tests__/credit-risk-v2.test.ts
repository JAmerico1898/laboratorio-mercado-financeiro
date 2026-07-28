/**
 * Verificação ponta a ponta do scorecard do módulo 2.
 *
 * Roda EXATAMENTE o mesmo caminho de código que a página executa no navegador, sobre os
 * arquivos reais de public/data, e confere que o resultado bate com o modelo em Python
 * (AUC de teste 0,7294 — ver REPORT.md no repositório do modelo).
 *
 * Se os dados forem regerados e o AUC sair da faixa, este teste quebra.
 */
import fs from "fs";
import path from "path";

import {
  parseColumnarData,
  extractFeatures,
  fitTransform,
  transform,
  stratifiedTrainTestSplit,
  trainLogisticRegression,
  predictProbability,
  computeRocCurve,
  // a versão rápida vem do barrel do scorecard
} from "@/lib/credit-risk";
import {
  FEATURES_V2,
  DEFAULT_FEATURES_V2,
  expandColumns,
  PYTHON_REFERENCE,
  computeRocCurveFast,
  LR_V2_LEARNING_RATE,
  LR_V2_MAX_ITERATIONS,
  LR_V2_TOLERANCE,
  LR_V2_REGULARIZATION,
} from "@/lib/credit-risk-v2";

/** Mesmos parâmetros que a página do módulo 2 usa. */
const LR_ARGS = [
  LR_V2_LEARNING_RATE,
  LR_V2_MAX_ITERATIONS,
  LR_V2_TOLERANCE,
  LR_V2_REGULARIZATION,
] as const;

const DATA_DIR = path.join(process.cwd(), "public", "data");

function loadLocal(file: string) {
  return parseColumnarData(
    JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"))
  );
}

// Treinar 60k linhas em JS leva alguns segundos; sobe o timeout.
jest.setTimeout(180_000);

describe("módulo 2 — scorecard de originação", () => {
  const training = loadLocal("training_sample_v2.json");
  const productionTrue = loadLocal("testing_sample_true_v2.json");

  it("carrega os dados exportados com o tamanho esperado", () => {
    expect(training.length).toBe(60296);
    expect(productionTrue.length).toBe(25842);
    expect(training.length + productionTrue.length).toBe(PYTHON_REFERENCE.totalRows);
  });

  it("mantém a taxa de inadimplência da base", () => {
    const bad = training.filter((r) => r.loan_status === 1).length / training.length;
    expect(bad).toBeCloseTo(PYTHON_REFERENCE.badRate, 3);
  });

  it("expande variáveis em colunas: 9 variáveis padrão -> 12 colunas", () => {
    expect(DEFAULT_FEATURES_V2).toHaveLength(9);
    const cols = expandColumns(DEFAULT_FEATURES_V2);
    // 7 numéricas simples + 2 de emp_length + 3 dummies de moradia
    expect(cols).toHaveLength(12);
    expect(cols).toContain("home_mortgage");
    expect(cols).toContain("emp_length_missing");
  });

  it("toda coluna declarada existe de fato nos dados", () => {
    const sample = training[0];
    for (const f of FEATURES_V2) {
      for (const c of f.columns) {
        expect(sample[c]).toBeDefined();
      }
    }
  });

  it("nenhuma coluna de vazamento foi exportada", () => {
    const forbidden = [
      "total_pymnt", "total_rec_prncp", "total_rec_int", "recoveries",
      "collection_recovery_fee", "out_prncp", "last_pymnt_amnt",
      "last_fico_range_high", "last_fico_range_low", "debt_settlement_flag",
    ];
    const present = Object.keys(training[0]);
    for (const f of forbidden) expect(present).not.toContain(f);
  });

  it("reproduz o AUC do modelo em Python (0,7294) no caminho real do app", () => {
    const cols = expandColumns(DEFAULT_FEATURES_V2);
    const { X, y } = extractFeatures(training, cols);
    const split = stratifiedTrainTestSplit(X, y, 0.3, 42);
    const { transformed: xTrainStd, params } = fitTransform(split.xTrain);
    const model = trainLogisticRegression(xTrainStd, split.yTrain, cols, params, ...LR_ARGS);

    // Holdout verdadeiro (25.842 contratos que o modelo nunca viu).
    const { X: XProd, ids } = extractFeatures(productionTrue, cols);
    const trueById = new Map(productionTrue.map((r) => [r.id, r.loan_status]));
    const yProd = ids.map((id) => trueById.get(id) ?? 0);
    const probs = predictProbability(transform(XProd, params), model);
    const { auc } = computeRocCurveFast(yProd, probs);

    // Referência Python: 0,7294. O navegador treina em 70% do arquivo de treino
    // (42.207 linhas) em vez das 60.296, então uma folga pequena é esperada.
    expect(auc).toBeGreaterThan(0.72);
    expect(auc).toBeLessThan(0.74);
  });

  // Amostra pequena: a versão original é quadrática e inviabiliza o teste com 42 mil linhas.
  const rocSample = (rows: number) => {
    const cols = expandColumns(DEFAULT_FEATURES_V2);
    const { X, y } = extractFeatures(training.slice(0, rows), cols);
    const { transformed: xStd, params } = fitTransform(X);
    const model = trainLogisticRegression(xStd, y, cols, params, ...LR_ARGS);
    return { y, probs: predictProbability(xStd, model) };
  };

  it("a ROC rápida O(n log n) reproduz ponto a ponto a ROC original O(n²)", () => {
    // 500 linhas: abaixo do limite de redução, então a curva sai completa.
    const { y, probs } = rocSample(500);
    const lenta = computeRocCurve(y, probs);
    const rapida = computeRocCurveFast(y, probs);

    expect(rapida.auc).toBeCloseTo(lenta.auc, 10);
    expect(rapida.fpr).toHaveLength(lenta.fpr.length);
    for (let i = 0; i < lenta.fpr.length; i++) {
      expect(rapida.fpr[i]).toBeCloseTo(lenta.fpr[i], 10);
      expect(rapida.tpr[i]).toBeCloseTo(lenta.tpr[i], 10);
    }
  });

  it("a redução de pontos para o gráfico não altera o AUC", () => {
    // 6.000 linhas: acima do limite, a curva é reduzida para desenho.
    const { y, probs } = rocSample(6000);
    const lenta = computeRocCurve(y, probs);
    const rapida = computeRocCurveFast(y, probs);

    // AUC calculado sobre a curva COMPLETA — idêntico.
    expect(rapida.auc).toBeCloseTo(lenta.auc, 10);
    // Mas o que vai para o Plotly é bem menor.
    expect(rapida.fpr.length).toBeLessThanOrEqual(2000);
    expect(rapida.fpr.length).toBeLessThan(lenta.fpr.length);
    // Extremos preservados.
    expect(rapida.fpr[0]).toBeCloseTo(0, 10);
    expect(rapida.tpr[0]).toBeCloseTo(0, 10);
    expect(rapida.fpr[rapida.fpr.length - 1]).toBeCloseTo(1, 10);
    expect(rapida.tpr[rapida.tpr.length - 1]).toBeCloseTo(1, 10);
  });

  // NOTA: as três variáveis da camada "Sem contribuição" NÃO pioram o AUC — medido +0,00002.
  // Com 42 mil linhas de treino e 15 parâmetros há folga demais para uma variável inútil
  // causar estrago. O efeito delas aparece nos COEFICIENTES (teste seguinte), não aqui.
  it("as variáveis sem contribuição deixam o AUC praticamente inalterado", () => {
    const run = (keys: string[]) => {
      const cols = expandColumns(keys);
      const { X, y } = extractFeatures(training, cols);
      const split = stratifiedTrainTestSplit(X, y, 0.3, 42);
      const { transformed: xTrainStd, params } = fitTransform(split.xTrain);
      const model = trainLogisticRegression(xTrainStd, split.yTrain, cols, params, ...LR_ARGS);
      const probs = predictProbability(transform(split.xTest, params), model);
      return computeRocCurveFast(split.yTest, probs).auc;
    };

    const semArmadilhas = run(DEFAULT_FEATURES_V2);
    const comArmadilhas = run([
      ...DEFAULT_FEATURES_V2,
      "loan_amnt",
      "installment",
      "tax_liens",
    ]);

    // Variação indistinguível de zero, na 5ª casa decimal — e é esse o ponto pedagógico.
    expect(Math.abs(comArmadilhas - semArmadilhas)).toBeLessThan(0.0005);
  });

  it("a colinearidade loan_amnt + installment distorce os coeficientes", () => {
    const coefFor = (keys: string[]) => {
      const cols = expandColumns(keys);
      const { X, y } = extractFeatures(training, cols);
      const split = stratifiedTrainTestSplit(X, y, 0.3, 42);
      const { transformed: xTrainStd, params } = fitTransform(split.xTrain);
      const model = trainLogisticRegression(xTrainStd, split.yTrain, cols, params, ...LR_ARGS);
      return Object.fromEntries(cols.map((c, i) => [c, model.coefficients[i]]));
    };

    const base = ["int_rate", "dti", "fico_range_low"];
    const soValor = coefFor([...base, "loan_amnt"]).loan_amnt;
    const ambas = coefFor([...base, "loan_amnt", "installment"]);

    // Sozinha, "valor solicitado" tem coeficiente positivo e modesto.
    expect(soValor).toBeGreaterThan(0);
    // Juntas, o par se opõe: uma infla, a outra troca de sinal.
    expect(ambas.loan_amnt).toBeGreaterThan(soValor);
    expect(ambas.installment).toBeLessThan(0);
  });
});
