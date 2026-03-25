// src/lib/__tests__/risk-calc.test.ts
import { calculateRiskImpacts } from "../tokenization/risk-calc";

describe("calculateRiskImpacts", () => {
  it("returns 6 risk categories", () => {
    const result = calculateRiskImpacts(0, false, false);
    expect(result.categories).toHaveLength(6);
    expect(result.impacts).toHaveLength(6);
    expect(result.categories).toEqual([
      "Mercado", "Operacional", "Cibernético", "Regulatório", "Liquidez", "Custódia",
    ]);
  });

  it("returns base impacts with no stress", () => {
    const result = calculateRiskImpacts(0, false, false);
    expect(result.impacts).toEqual([30, 20, 50, 40, 25, 35]);
  });

  it("increases market + liquidity risk on high market shock", () => {
    const result = calculateRiskImpacts(60, false, false);
    expect(result.impacts[0]).toBe(70);
    expect(result.impacts[4]).toBe(55);
  });

  it("increases moderate market risk on medium shock", () => {
    const result = calculateRiskImpacts(30, false, false);
    expect(result.impacts[0]).toBe(50);
  });

  it("maxes cyber risk on tech failure", () => {
    const result = calculateRiskImpacts(0, true, false);
    expect(result.impacts[2]).toBe(100);
    expect(result.impacts[1]).toBe(70);
  });

  it("increases regulatory + liquidity on reg change", () => {
    const result = calculateRiskImpacts(0, false, true);
    expect(result.impacts[3]).toBe(90);
    expect(result.impacts[4]).toBe(65);
  });

  it("combines all stresses", () => {
    const result = calculateRiskImpacts(60, true, true);
    expect(result.impacts[0]).toBe(70);
    expect(result.impacts[1]).toBe(70);
    expect(result.impacts[2]).toBe(100);
    expect(result.impacts[3]).toBe(90);
    expect(result.impacts[4]).toBeGreaterThanOrEqual(95);
    expect(result.impacts[5]).toBe(35);
  });

  it("caps all impacts at 100", () => {
    const result = calculateRiskImpacts(100, true, true);
    result.impacts.forEach((impact) => {
      expect(impact).toBeLessThanOrEqual(100);
    });
  });
});
