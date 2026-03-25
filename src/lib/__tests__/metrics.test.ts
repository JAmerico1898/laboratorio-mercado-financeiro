import { computeMetrics } from "../metrics";

describe("computeMetrics", () => {
  const observed = [0.10, 0.12, 0.14, 0.11, 0.13];
  const fitted   = [0.101, 0.119, 0.141, 0.109, 0.131];

  it("computes RMSE correctly", () => {
    const m = computeMetrics(observed, fitted);
    expect(m.rmse).toBeCloseTo(0.001, 5);
  });

  it("computes MAE correctly", () => {
    const m = computeMetrics(observed, fitted);
    expect(m.mae).toBeCloseTo(0.001, 5);
  });

  it("computes R² close to 1 for good fit", () => {
    const m = computeMetrics(observed, fitted);
    expect(m.r2).toBeGreaterThan(0.99);
  });

  it("computes max error correctly", () => {
    const m = computeMetrics(observed, fitted);
    expect(m.maxError).toBeCloseTo(0.001, 5);
  });

  it("returns R²=1 for perfect fit", () => {
    const m = computeMetrics(observed, observed);
    expect(m.r2).toBe(1);
    expect(m.rmse).toBe(0);
  });
});
