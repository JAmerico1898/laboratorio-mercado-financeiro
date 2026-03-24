import { computeRocCurve, computeAuc } from "../credit-risk/roc-auc";

describe("computeAuc", () => {
  it("returns 1 for perfect ROC (0,0)->(0,1)->(1,1)", () => {
    const fpr = [0, 0, 1];
    const tpr = [0, 1, 1];
    expect(computeAuc(fpr, tpr)).toBeCloseTo(1, 4);
  });

  it("returns 0.5 for diagonal ROC (random classifier)", () => {
    const fpr = [0, 0.25, 0.5, 0.75, 1];
    const tpr = [0, 0.25, 0.5, 0.75, 1];
    expect(computeAuc(fpr, tpr)).toBeCloseTo(0.5, 4);
  });

  it("returns 0 for worst classifier (0,0)->(1,0)->(1,1)", () => {
    const fpr = [0, 1, 1];
    const tpr = [0, 0, 1];
    expect(computeAuc(fpr, tpr)).toBeCloseTo(0, 4);
  });
});

describe("computeRocCurve", () => {
  it("perfect classifier gives AUC = 1", () => {
    // All positives have higher probability than all negatives
    const yTrue = [0, 0, 0, 1, 1, 1];
    const probs = [0.1, 0.2, 0.3, 0.7, 0.8, 0.9];
    const roc = computeRocCurve(yTrue, probs);

    expect(roc.auc).toBeCloseTo(1, 4);
    // Should start at (0,0) and reach (0,1) before (1,1)
    expect(roc.fpr[0]).toBe(0);
    expect(roc.tpr[0]).toBe(0);
  });

  it("random classifier gives AUC ≈ 0.5", () => {
    // Probabilities unrelated to true labels
    const yTrue = [0, 1, 0, 1, 0, 1, 0, 1];
    const probs = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
    const roc = computeRocCurve(yTrue, probs);

    // AUC should be around 0.5 for this alternating pattern
    expect(roc.auc).toBeGreaterThan(0.3);
    expect(roc.auc).toBeLessThan(0.8);
  });

  it("includes FPR and TPR arrays of same length", () => {
    const yTrue = [0, 0, 1, 1];
    const probs = [0.2, 0.4, 0.6, 0.8];
    const roc = computeRocCurve(yTrue, probs);

    expect(roc.fpr.length).toBe(roc.tpr.length);
    expect(roc.fpr.length).toBe(roc.thresholds.length);
    expect(roc.fpr.length).toBeGreaterThanOrEqual(2);
  });

  it("FPR starts at 0 and ends at 1", () => {
    const yTrue = [0, 0, 1, 1];
    const probs = [0.2, 0.4, 0.6, 0.8];
    const roc = computeRocCurve(yTrue, probs);

    expect(roc.fpr[0]).toBe(0);
    expect(roc.fpr[roc.fpr.length - 1]).toBe(1);
  });

  it("TPR starts at 0 and ends at 1", () => {
    const yTrue = [0, 0, 1, 1];
    const probs = [0.2, 0.4, 0.6, 0.8];
    const roc = computeRocCurve(yTrue, probs);

    expect(roc.tpr[0]).toBe(0);
    expect(roc.tpr[roc.tpr.length - 1]).toBe(1);
  });

  it("AUC is between 0 and 1", () => {
    const yTrue = [0, 1, 0, 1, 1, 0];
    const probs = [0.3, 0.7, 0.4, 0.6, 0.5, 0.2];
    const roc = computeRocCurve(yTrue, probs);

    expect(roc.auc).toBeGreaterThanOrEqual(0);
    expect(roc.auc).toBeLessThanOrEqual(1);
  });
});
