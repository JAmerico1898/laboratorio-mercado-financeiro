import { RocData } from "./types";

/**
 * Compute ROC curve data (FPR, TPR) at varying thresholds.
 * Matches sklearn's roc_curve output.
 */
export function computeRocCurve(
  yTrue: number[],
  probabilities: number[]
): RocData {
  // Get unique sorted thresholds (descending)
  const uniqueThresholds = [...new Set(probabilities)].sort((a, b) => b - a);

  // Add a threshold above max to get (0, 0) point
  const thresholds = [uniqueThresholds[0] + 1, ...uniqueThresholds];

  const totalPositive = yTrue.filter((y) => y === 1).length;
  const totalNegative = yTrue.length - totalPositive;

  const fpr: number[] = [];
  const tpr: number[] = [];
  const thresholdsOut: number[] = [];

  for (const threshold of thresholds) {
    let tp = 0;
    let fp = 0;
    for (let i = 0; i < yTrue.length; i++) {
      if (probabilities[i] >= threshold) {
        if (yTrue[i] === 1) tp++;
        else fp++;
      }
    }
    const currentFpr = totalNegative > 0 ? fp / totalNegative : 0;
    const currentTpr = totalPositive > 0 ? tp / totalPositive : 0;
    fpr.push(currentFpr);
    tpr.push(currentTpr);
    thresholdsOut.push(threshold);
  }

  const auc = computeAuc(fpr, tpr);

  return { fpr, tpr, thresholds: thresholdsOut, auc };
}

/**
 * Compute Area Under Curve using the trapezoidal rule.
 * Assumes fpr and tpr are ordered (not necessarily sorted).
 */
export function computeAuc(fpr: number[], tpr: number[]): number {
  // Sort by fpr ascending for proper integration
  const indices = fpr.map((_, i) => i).sort((a, b) => fpr[a] - fpr[b]);

  let area = 0;
  for (let k = 1; k < indices.length; k++) {
    const i = indices[k - 1];
    const j = indices[k];
    const dx = fpr[j] - fpr[i];
    const avgHeight = (tpr[i] + tpr[j]) / 2;
    area += dx * avgHeight;
  }

  return area;
}
