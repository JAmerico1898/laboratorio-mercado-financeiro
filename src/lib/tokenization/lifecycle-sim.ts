// src/lib/tokenization/lifecycle-sim.ts
import type { RealEstateResult, BondResult } from "./types";

export function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalRandom(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
}

export function simulateRealEstate(
  years: number,
  baseValue = 100,
  volatility = 0.02,
  yieldRate = 0.005,
  seed = 42
): RealEstateResult {
  const rng = mulberry32(seed);
  const totalMonths = years * 12;
  const months: number[] = [];
  const prices: number[] = [baseValue];
  const dividends: number[] = [0];

  for (let m = 1; m < totalMonths; m++) {
    const change = normalRandom(rng) * volatility;
    const newPrice = prices[m - 1] * (1 + change);
    prices.push(newPrice);
    dividends.push(newPrice * yieldRate);
  }

  months.push(...Array.from({ length: totalMonths }, (_, i) => i));

  const totalDividends = dividends.reduce((sum, d) => sum + d, 0);
  const capitalGain = prices[prices.length - 1] - prices[0];
  const roi = ((totalDividends + capitalGain) / prices[0]) * 100;

  return { months, prices, dividends, totalDividends, capitalGain, roi };
}

export function simulateBond(
  years: number,
  parValue = 1000,
  couponRate = 0.1,
  defaultProb = 0.02,
  seed = 42
): BondResult {
  const rng = mulberry32(seed);
  const cashFlows: number[] = [];
  const yearsArr: number[] = [];
  let status: BondResult["status"] = "Adimplente";
  let defaultYear: number | undefined;

  for (let y = 1; y <= years; y++) {
    if (rng() < defaultProb) {
      status = "Default (Calote)";
      defaultYear = y;
      cashFlows.push(0);
      yearsArr.push(y);
      break;
    }
    const coupon = parValue * couponRate;
    cashFlows.push(y === years ? coupon + parValue : coupon);
    yearsArr.push(y);
  }

  return { years: yearsArr, cashFlows, status, defaultYear };
}
