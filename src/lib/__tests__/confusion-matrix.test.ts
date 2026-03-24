import {
  computeConfusionMatrix,
  computeClassificationReport,
  interpretCoefficients,
} from "../credit-risk/confusion-matrix";

describe("computeConfusionMatrix", () => {
  it("computes correct values for known predictions", () => {
    const yTrue = [0, 0, 1, 1, 1, 0, 1, 0];
    const yPred = [0, 1, 1, 1, 0, 0, 1, 0];
    const cm = computeConfusionMatrix(yTrue, yPred);

    expect(cm.tp).toBe(3); // actual=1, pred=1
    expect(cm.tn).toBe(3); // actual=0, pred=0
    expect(cm.fp).toBe(1); // actual=0, pred=1
    expect(cm.fn).toBe(1); // actual=1, pred=0
  });

  it("handles all correct predictions", () => {
    const y = [0, 1, 0, 1];
    const cm = computeConfusionMatrix(y, y);
    expect(cm.tp).toBe(2);
    expect(cm.tn).toBe(2);
    expect(cm.fp).toBe(0);
    expect(cm.fn).toBe(0);
  });

  it("handles all wrong predictions", () => {
    const yTrue = [0, 0, 1, 1];
    const yPred = [1, 1, 0, 0];
    const cm = computeConfusionMatrix(yTrue, yPred);
    expect(cm.tp).toBe(0);
    expect(cm.tn).toBe(0);
    expect(cm.fp).toBe(2);
    expect(cm.fn).toBe(2);
  });

  it("counts sum to total samples", () => {
    const yTrue = [0, 0, 0, 1, 1, 1, 0, 1, 0, 1];
    const yPred = [0, 1, 0, 1, 0, 1, 1, 0, 0, 1];
    const cm = computeConfusionMatrix(yTrue, yPred);
    expect(cm.tp + cm.tn + cm.fp + cm.fn).toBe(10);
  });
});

describe("computeClassificationReport", () => {
  it("computes correct metrics for known data", () => {
    // TP=3, TN=3, FP=1, FN=1
    const yTrue = [0, 0, 1, 1, 1, 0, 1, 0];
    const yPred = [0, 1, 1, 1, 0, 0, 1, 0];
    const report = computeClassificationReport(yTrue, yPred);

    // Class 1: precision = 3/(3+1) = 0.75, recall = 3/(3+1) = 0.75, f1 = 0.75
    expect(report.class1.precision).toBeCloseTo(0.75, 4);
    expect(report.class1.recall).toBeCloseTo(0.75, 4);
    expect(report.class1.f1).toBeCloseTo(0.75, 4);
    expect(report.class1.support).toBe(4);

    // Class 0: precision = 3/(3+1) = 0.75, recall = 3/(3+1) = 0.75, f1 = 0.75
    expect(report.class0.precision).toBeCloseTo(0.75, 4);
    expect(report.class0.recall).toBeCloseTo(0.75, 4);
    expect(report.class0.f1).toBeCloseTo(0.75, 4);
    expect(report.class0.support).toBe(4);

    // Overall accuracy = 6/8 = 0.75
    expect(report.accuracy).toBeCloseTo(0.75, 4);
    expect(report.macroF1).toBeCloseTo(0.75, 4);
    expect(report.weightedF1).toBeCloseTo(0.75, 4);
  });

  it("handles perfect predictions", () => {
    const y = [0, 0, 1, 1];
    const report = computeClassificationReport(y, y);
    expect(report.accuracy).toBe(1);
    expect(report.class0.precision).toBe(1);
    expect(report.class1.recall).toBe(1);
    expect(report.macroF1).toBe(1);
  });

  it("handles all-zero predictions", () => {
    const yTrue = [0, 0, 1, 1];
    const yPred = [0, 0, 0, 0];
    const report = computeClassificationReport(yTrue, yPred);
    expect(report.accuracy).toBe(0.5);
    expect(report.class1.precision).toBe(0); // no positive predictions
    expect(report.class1.recall).toBe(0);
    expect(report.class0.recall).toBe(1); // all negatives correctly predicted
  });
});

describe("interpretCoefficients", () => {
  it("identifies positive coefficients as increasing risk", () => {
    const result = interpretCoefficients([1.0], ["int_rate"]);
    expect(result[0].effect).toBe("increases");
    expect(result[0].oddsRatio).toBeCloseTo(Math.E, 4);
  });

  it("identifies negative coefficients as decreasing risk", () => {
    const result = interpretCoefficients([-0.5], ["fico_score"]);
    expect(result[0].effect).toBe("decreases");
    expect(result[0].oddsRatio).toBeCloseTo(Math.exp(-0.5), 4);
  });

  it("identifies near-zero coefficients as neutral", () => {
    const result = interpretCoefficients([0.0001], ["loan_amnt"]);
    expect(result[0].effect).toBe("neutral");
    expect(result[0].magnitude).toBe("MUITO FRACO");
  });

  it("classifies magnitude correctly", () => {
    // exp(1) - 1 ≈ 1.718 → 171.8% → FORTE
    const forte = interpretCoefficients([1.0], ["x"])[0];
    expect(forte.magnitude).toBe("FORTE");

    // exp(0.3) - 1 ≈ 0.35 → 35% → MODERADO
    const moderado = interpretCoefficients([0.3], ["x"])[0];
    expect(moderado.magnitude).toBe("MODERADO");

    // exp(0.1) - 1 ≈ 0.105 → 10.5% → FRACO
    const fraco = interpretCoefficients([0.1], ["x"])[0];
    expect(fraco.magnitude).toBe("FRACO");
  });

  it("uses feature label from constants when available", () => {
    const result = interpretCoefficients([0.5], ["loan_amnt"]);
    expect(result[0].label).toBe("Valor do Empréstimo");
  });
});
