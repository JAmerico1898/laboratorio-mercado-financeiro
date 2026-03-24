import { calculateViabilidade, calculateSensitivity, calculateCostBreakdown } from "../fidc/viabilidade-calc";
import type { ViabilidadeParams } from "../fidc/types";

const defaultParams: ViabilidadeParams = {
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

describe("calculateViabilidade", () => {
  it("calculates gross revenue correctly", () => {
    const result = calculateViabilidade(defaultParams);
    expect(result.receitaBruta).toBeCloseTo(4_500_000, 0);
  });

  it("calculates fixed costs correctly", () => {
    const result = calculateViabilidade(defaultParams);
    expect(result.fixedCosts).toBeCloseTo(146_667, 0);
  });

  it("calculates variable costs correctly", () => {
    const result = calculateViabilidade(defaultParams);
    expect(result.variableCosts).toBeCloseTo(510_000, 0);
  });

  it("calculates net result and margin", () => {
    const result = calculateViabilidade(defaultParams);
    const expectedNet = 4_500_000 - 146_667 - 510_000;
    expect(result.netResult).toBeCloseTo(expectedNet, 0);
    expect(result.margin).toBeCloseTo((expectedNet / 4_500_000) * 100, 1);
  });

  it("returns inviable when net result is negative", () => {
    // Revenue = 5M * 5% = 250,000; Fixed = 45k+35k+15k+80k/3+25k ≈ 146,667; Variable = 5M*1.7% = 85,000; Total ≈ 231,667 → net > 0
    // Use very high fixed costs to force negative: auditCost 200k alone exceeds revenue headroom
    const params = { ...defaultParams, pl: 5, yieldRate: 5, auditCost: 200_000 };
    const result = calculateViabilidade(params);
    expect(result.viabilityLevel).toBe("inviable");
    expect(result.isViable).toBe(false);
  });

  it("returns risky when margin is between 0% and 5%", () => {
    const params = {
      ...defaultParams,
      pl: 5,
      yieldRate: 8,
      auditCost: 80_000,
      ratingCost: 60_000,
      cvmFees: 30_000,
      legalSetup: 120_000,
      otherFixed: 50_000,
      managementFee: 2.5,
      adminFee: 0.2,
    };
    const result = calculateViabilidade(params);
    expect(result.netResult).toBeGreaterThan(0);
    expect(result.margin).toBeLessThan(5);
    expect(result.viabilityLevel).toBe("risky");
  });

  it("returns viable when margin >= 5%", () => {
    const result = calculateViabilidade(defaultParams);
    expect(result.margin).toBeGreaterThanOrEqual(5);
    expect(result.viabilityLevel).toBe("viable");
    expect(result.isViable).toBe(true);
  });

  it("guards against division by zero when yield is 0", () => {
    const params = { ...defaultParams, yieldRate: 0 };
    const result = calculateViabilidade(params);
    expect(result.margin).toBe(0);
    expect(result.receitaBruta).toBe(0);
  });
});

describe("calculateSensitivity", () => {
  it("returns points from PL 5M to 100M", () => {
    const points = calculateSensitivity(defaultParams);
    expect(points[0].pl).toBe(5);
    expect(points[points.length - 1].pl).toBe(100);
  });

  it("margin increases with PL (fixed costs spread)", () => {
    const points = calculateSensitivity(defaultParams);
    const first = points[0].margin;
    const last = points[points.length - 1].margin;
    expect(last).toBeGreaterThan(first);
  });

  it("identifies breakeven PL (margin crosses 0)", () => {
    const points = calculateSensitivity(defaultParams);
    expect(points.some((p) => p.netResult > 0)).toBe(true);
  });
});

describe("calculateCostBreakdown", () => {
  it("returns fixed and variable cost items with percentages", () => {
    const result = calculateViabilidade(defaultParams);
    const breakdown = calculateCostBreakdown(defaultParams, result);
    expect(breakdown.length).toBeGreaterThan(0);
    const totalPct = breakdown.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPct).toBeCloseTo(100, 0);
  });
});
