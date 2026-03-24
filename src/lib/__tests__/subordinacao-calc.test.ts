import { calculateWaterfall, calculateSensitivityCurve, calculateRupturePoints } from "../fidc/subordinacao-calc";
import type { SubordinacaoParams } from "../fidc/types";

describe("calculateWaterfall", () => {
  it("allocates capital correctly without mezanino", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 0,
    };
    const result = calculateWaterfall(params);
    expect(result.senior.initial).toBeCloseTo(80_000_000, 0);
    expect(result.junior.initial).toBeCloseTo(20_000_000, 0);
    expect(result.mezanino).toBeUndefined();
  });

  it("allocates capital with mezanino (50/50 split)", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: true, simulatedLoss: 0,
    };
    const result = calculateWaterfall(params);
    expect(result.senior.initial).toBeCloseTo(80_000_000, 0);
    expect(result.mezanino!.initial).toBeCloseTo(10_000_000, 0);
    expect(result.junior.initial).toBeCloseTo(10_000_000, 0);
  });

  it("junior absorbs loss first", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 10_000_000,
    };
    const result = calculateWaterfall(params);
    expect(result.junior.loss).toBe(10_000_000);
    expect(result.junior.final).toBe(10_000_000);
    expect(result.senior.loss).toBe(0);
    expect(result.senior.final).toBe(80_000_000);
    expect(result.status).toBe("success");
  });

  it("loss overflows to senior when junior exhausted", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 30_000_000,
    };
    const result = calculateWaterfall(params);
    expect(result.junior.final).toBe(0);
    expect(result.senior.loss).toBe(10_000_000);
    expect(result.status).toBe("error");
  });

  it("mezanino absorbs after junior, before senior", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: true, simulatedLoss: 15_000_000,
    };
    const result = calculateWaterfall(params);
    expect(result.junior.final).toBe(0);
    expect(result.mezanino!.loss).toBe(5_000_000);
    expect(result.mezanino!.final).toBe(5_000_000);
    expect(result.senior.loss).toBe(0);
    expect(result.status).toBe("warning");
  });

  it("caps loss when it exceeds total PL", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 120_000_000,
    };
    const result = calculateWaterfall(params);
    expect(result.junior.final).toBe(0);
    expect(result.senior.final).toBe(0);
    expect(result.junior.loss + result.senior.loss).toBe(100_000_000);
  });

  it("detects drawdown correctly", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 15_000_000,
    };
    const result = calculateWaterfall(params);
    expect(result.effectiveSubordination).toBeCloseTo(5.88, 0);
    expect(result.isDrawdown).toBe(true);
  });

  it("no drawdown when no loss", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 0,
    };
    const result = calculateWaterfall(params);
    expect(result.effectiveSubordination).toBeCloseTo(20, 0);
    expect(result.isDrawdown).toBe(false);
  });
});

describe("calculateRupturePoints", () => {
  it("identifies junior rupture point", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 0,
    };
    const points = calculateRupturePoints(params);
    const juniorRupture = points.find((p) => p.label === "Junior");
    expect(juniorRupture).toBeDefined();
    expect(juniorRupture!.lossPercent).toBeCloseTo(20, 0);
  });
});

describe("calculateSensitivityCurve", () => {
  it("returns data points from 0 to 60% loss", () => {
    const params: SubordinacaoParams = {
      pl: 100, subordinationIndex: 20, includeMezanino: false, simulatedLoss: 0,
    };
    const curve = calculateSensitivityCurve(params);
    expect(curve.length).toBeGreaterThan(0);
    expect(curve[0].lossPercent).toBe(0);
    expect(curve[curve.length - 1].lossPercent).toBe(60);
  });
});
