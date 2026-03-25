// src/lib/tokenization/risk-calc.ts
import type { RiskImpactResult } from "./types";

export function calculateRiskImpacts(
  marketShock: number,
  techFail: boolean,
  regChange: boolean
): RiskImpactResult {
  const categories = [
    "Mercado", "Operacional", "Cibernético", "Regulatório", "Liquidez", "Custódia",
  ];
  const impacts = [30, 20, 50, 40, 25, 35];

  if (marketShock > 50) {
    impacts[0] += 40;
    impacts[4] += 30;
  } else if (marketShock > 20) {
    impacts[0] += 20;
  }

  if (techFail) {
    impacts[2] = 100;
    impacts[1] += 50;
  }

  if (regChange) {
    impacts[3] = 90;
    impacts[4] += 40;
  }

  return {
    categories,
    impacts: impacts.map((v) => Math.min(v, 100)),
  };
}
