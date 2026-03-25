import type { LeverageParams, LeverageResult } from "./types";
import { CAR_MINIMUM, LEVERAGE_MINIMUM } from "./constants";

/**
 * Calculate leverage ratio and capital adequacy ratio,
 * and determine regulatory status based on dual constraints.
 */
export function calculateLeverage(params: LeverageParams): LeverageResult {
  const { capital, totalAssets, rwaPercent } = params;

  const rwa = totalAssets * (rwaPercent / 100);
  const car = rwa > 0 ? (capital / rwa) * 100 : 0;
  const leverage = (capital / totalAssets) * 100;

  let status: LeverageResult["status"];
  const carOk = car >= CAR_MINIMUM;
  const leverageOk = leverage >= LEVERAGE_MINIMUM;

  if (carOk && leverageOk) {
    status = "both-ok";
  } else if (!carOk && leverageOk) {
    status = "car-violation";
  } else if (carOk && !leverageOk) {
    status = "leverage-violation";
  } else {
    status = "both-violation";
  }

  return { rwa, car, leverage, status };
}
