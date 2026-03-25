import type { AssetAllocation, AssetRwaDetail, RwaResult } from "./types";
import {
  RISK_WEIGHTS,
  ASSET_LABELS,
  CAR_MINIMUM,
  CAR_REGULATORY,
  REGULATORY_CAPITAL,
} from "./constants";

/**
 * Calculate Risk-Weighted Assets (RWA) and Capital Adequacy Ratio (CAR)
 * for a given asset allocation.
 *
 * All monetary values are in $M.
 * REGULATORY_CAPITAL is the fixed $10.5M used in the RWA playground.
 */
export function calculateRwa(allocation: AssetAllocation): RwaResult {
  const assetKeys: (keyof AssetAllocation)[] = [
    "cash",
    "govBonds",
    "mortgages",
    "corpLoans",
    "highYield",
    "unrated",
  ];

  const details: AssetRwaDetail[] = assetKeys.map((key) => ({
    label: ASSET_LABELS[key],
    allocation: allocation[key],
    riskWeight: RISK_WEIGHTS[key],
    rwaContribution: allocation[key] * RISK_WEIGHTS[key],
  }));

  const rwaTotal = details.reduce((sum, d) => sum + d.rwaContribution, 0);

  const requiredCapital = rwaTotal * 0.105;

  // CAR = (fixed capital / rwaTotal) * 100
  const car = rwaTotal > 0 ? (REGULATORY_CAPITAL / rwaTotal) * 100 : 100;

  const capitalBuffer = car - CAR_MINIMUM;

  let status: RwaResult["status"];
  if (car >= CAR_MINIMUM) {
    status = "well-capitalized";
  } else if (car >= CAR_REGULATORY) {
    status = "adequate";
  } else {
    status = "undercapitalized";
  }

  return {
    details,
    rwaTotal,
    requiredCapital,
    car,
    capitalBuffer,
    status,
  };
}
