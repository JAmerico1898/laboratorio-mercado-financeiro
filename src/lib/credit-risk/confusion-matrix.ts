import {
  ConfusionMatrix,
  ClassMetrics,
  ClassificationReport,
  CoefficientInterpretation,
} from "./types";
import { FEATURES } from "./constants";

/**
 * Compute confusion matrix from actual and predicted labels.
 * Positive class = 1 (delinquent), Negative class = 0 (good payer).
 */
export function computeConfusionMatrix(
  yTrue: number[],
  yPred: number[]
): ConfusionMatrix {
  let tp = 0, tn = 0, fp = 0, fn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++;
    else if (yTrue[i] === 0 && yPred[i] === 0) tn++;
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++;
    else fn++;
  }
  return { tp, tn, fp, fn };
}

/**
 * Compute precision, recall, F1 for a single class.
 */
function classMetrics(
  tp: number,
  fp: number,
  fn: number,
  support: number
): ClassMetrics {
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 =
    precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : 0;
  return { precision, recall, f1, support };
}

/**
 * Compute full classification report matching sklearn's output.
 */
export function computeClassificationReport(
  yTrue: number[],
  yPred: number[]
): ClassificationReport {
  const cm = computeConfusionMatrix(yTrue, yPred);

  // Class 0 (good payer): TP=tn, FP=fn, FN=fp
  const support0 = cm.tn + cm.fp;
  const class0 = classMetrics(cm.tn, cm.fn, cm.fp, support0);

  // Class 1 (delinquent): TP=tp, FP=fp, FN=fn
  const support1 = cm.tp + cm.fn;
  const class1 = classMetrics(cm.tp, cm.fp, cm.fn, support1);

  const total = yTrue.length;
  const acc = total > 0 ? (cm.tp + cm.tn) / total : 0;
  const macroF1 = (class0.f1 + class1.f1) / 2;
  const weightedF1 =
    total > 0
      ? (class0.f1 * support0 + class1.f1 * support1) / total
      : 0;

  return {
    class0,
    class1,
    accuracy: acc,
    macroF1,
    weightedF1,
  };
}

/**
 * Interpret model coefficients: odds ratios, direction, magnitude.
 */
export function interpretCoefficients(
  coefficients: number[],
  featureNames: string[]
): CoefficientInterpretation[] {
  return coefficients.map((coef, i) => {
    const oddsRatio = Math.exp(coef);
    const changePct = Math.abs(oddsRatio - 1) * 100;

    let effect: "increases" | "decreases" | "neutral";
    if (oddsRatio > 1.001) effect = "increases";
    else if (oddsRatio < 0.999) effect = "decreases";
    else effect = "neutral";

    let magnitude: "FORTE" | "MODERADO" | "FRACO" | "MUITO FRACO";
    if (changePct > 50) magnitude = "FORTE";
    else if (changePct > 20) magnitude = "MODERADO";
    else if (changePct > 5) magnitude = "FRACO";
    else magnitude = "MUITO FRACO";

    const featureDef = FEATURES.find((f) => f.key === featureNames[i]);
    const label = featureDef?.label ?? featureNames[i];

    return {
      feature: featureNames[i],
      label,
      coefficient: coef,
      oddsRatio,
      effect,
      magnitude,
      changePct,
    };
  });
}
