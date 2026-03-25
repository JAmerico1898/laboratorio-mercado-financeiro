// src/lib/__tests__/lifecycle-sim.test.ts
import {
  simulateRealEstate,
  simulateBond,
  mulberry32,
} from "../tokenization/lifecycle-sim";

describe("mulberry32", () => {
  it("produces deterministic output for same seed", () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it("produces values between 0 and 1", () => {
    const rng = mulberry32(42);
    const values = Array.from({ length: 1000 }, () => rng());
    values.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    });
  });
});

describe("simulateRealEstate", () => {
  it("returns correct number of months", () => {
    const result = simulateRealEstate(5);
    expect(result.months).toHaveLength(60);
    expect(result.prices).toHaveLength(60);
    expect(result.dividends).toHaveLength(60);
  });

  it("starts at base value", () => {
    const result = simulateRealEstate(1, 100);
    expect(result.prices[0]).toBe(100);
  });

  it("calculates ROI correctly", () => {
    const result = simulateRealEstate(1, 100, 0, 0.01); // zero volatility, 1% yield
    // With zero volatility, price stays at 100. dividends[0]=0, months 1-11 each = 1.0 → total = 11
    expect(result.totalDividends).toBeCloseTo(11, 0);
    expect(result.capitalGain).toBeCloseTo(0, 0);
    expect(result.roi).toBeCloseTo(11, 0);
  });

  it("is deterministic with same seed", () => {
    const r1 = simulateRealEstate(3, 100, 0.02, 0.005, 42);
    const r2 = simulateRealEstate(3, 100, 0.02, 0.005, 42);
    expect(r1.prices).toEqual(r2.prices);
    expect(r1.roi).toBe(r2.roi);
  });
});

describe("simulateBond", () => {
  it("returns adimplente with 0% default probability", () => {
    const result = simulateBond(5, 1000, 0.10, 0, 42);
    expect(result.status).toBe("Adimplente");
    expect(result.cashFlows).toHaveLength(5);
    expect(result.cashFlows[4]).toBe(1100); // 100 coupon + 1000 principal
  });

  it("returns correct coupon payments when no default", () => {
    const result = simulateBond(3, 1000, 0.10, 0, 42);
    expect(result.cashFlows[0]).toBe(100);
    expect(result.cashFlows[1]).toBe(100);
    expect(result.cashFlows[2]).toBe(1100);
  });

  it("handles year-1 default", () => {
    const result = simulateBond(5, 1000, 0.10, 1.0, 42); // 100% default
    expect(result.status).toBe("Default (Calote)");
    expect(result.defaultYear).toBe(1);
    expect(result.cashFlows[0]).toBe(0);
  });

  it("stops cash flows after default", () => {
    const result = simulateBond(10, 1000, 0.10, 1.0, 42);
    expect(result.cashFlows).toHaveLength(1);
  });

  it("handles default on final year", () => {
    const result = simulateBond(1, 1000, 0.10, 1.0, 42);
    expect(result.status).toBe("Default (Calote)");
    expect(result.defaultYear).toBe(1);
    expect(result.cashFlows).toEqual([0]);
  });
});
