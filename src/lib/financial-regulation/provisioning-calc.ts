import type { ProvisioningParams, ProvisioningResult, ProvisioningYearResult } from "./types";
import {
  SIMULATION_YEARS,
  LGD,
  BASE_IFRS9_RATE,
  PD_RATES,
  FRONT_PROPORTIONS,
  BACK_PROPORTIONS,
} from "./constants";

/**
 * Calculate provisioning over 5 years under different scenarios and models.
 *
 * Models:
 * - Res2682: incurred-loss (back-loaded in recession, zero otherwise)
 * - Res4966: expected-loss / IFRS 9 (front-loaded in recession, base rate otherwise)
 */
export function calculateProvisioning(
  params: ProvisioningParams
): ProvisioningResult {
  const { portfolio, interestRate, scenario, model } = params;

  const pdRates = PD_RATES[scenario];

  // Realized losses per year
  const realizedLosses = pdRates.map((pd) => portfolio * (pd / 100) * LGD);
  const totalRealized = realizedLosses.reduce((a, b) => a + b, 0);

  const baseIfrs9 = portfolio * BASE_IFRS9_RATE;

  // Calculate provisions per year
  let provisions: number[];
  let calloutKey: string;

  const isRecession = scenario === "Recessão";

  if (isRecession) {
    if (model === "Res4966") {
      provisions = FRONT_PROPORTIONS.map((prop, i) =>
        Math.round((baseIfrs9 + totalRealized * prop) * 10) / 10
      );
      calloutKey = "recession-4966";
    } else {
      provisions = BACK_PROPORTIONS.map((prop) =>
        Math.round((0 + totalRealized * prop) * 10) / 10
      );
      calloutKey = "recession-2682";
    }
  } else {
    if (model === "Res4966") {
      provisions = SIMULATION_YEARS.map(() => baseIfrs9);
      calloutKey = "non-recession-4966";
    } else {
      provisions = SIMULATION_YEARS.map(() => 0);
      calloutKey = "non-recession-2682";
    }
  }

  // Build year results
  const years: ProvisioningYearResult[] = SIMULATION_YEARS.map((year, i) => {
    const interest = portfolio * (interestRate / 100);
    const provision = provisions[i];
    const netProfit = interest - provision;
    return { year, interest, provision, netProfit };
  });

  const cumProvisions = years.reduce((sum, y) => sum + y.provision, 0);
  const cumProfit = years.reduce((sum, y) => sum + y.netProfit, 0);

  return { years, cumProvisions, cumProfit, calloutKey };
}
