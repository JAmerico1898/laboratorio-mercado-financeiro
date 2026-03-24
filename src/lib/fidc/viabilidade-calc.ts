import type { ViabilidadeParams, ViabilidadeResult, SensitivityPoint, CostBreakdown } from "./types";
import { PL_MIN, PL_MAX, SENSITIVITY_PL_STEP, RISKY_MARGIN_THRESHOLD } from "./constants";

export function calculateViabilidade(params: ViabilidadeParams): ViabilidadeResult {
  const plValue = params.pl * 1_000_000;
  const receitaBruta = plValue * (params.yieldRate / 100);

  const fixedCosts =
    params.auditCost +
    params.ratingCost +
    params.cvmFees +
    params.legalSetup / 3 +
    params.otherFixed;

  const variableCosts = plValue * ((params.managementFee + params.adminFee) / 100);
  const totalCosts = fixedCosts + variableCosts;
  const netResult = receitaBruta - totalCosts;
  const margin = receitaBruta > 0 ? (netResult / receitaBruta) * 100 : 0;

  let viabilityLevel: ViabilidadeResult["viabilityLevel"];
  if (netResult < 0) {
    viabilityLevel = "inviable";
  } else if (margin < RISKY_MARGIN_THRESHOLD) {
    viabilityLevel = "risky";
  } else {
    viabilityLevel = "viable";
  }

  return {
    receitaBruta,
    fixedCosts,
    variableCosts,
    totalCosts,
    netResult,
    margin,
    isViable: netResult >= 0,
    viabilityLevel,
  };
}

export function calculateSensitivity(params: ViabilidadeParams): SensitivityPoint[] {
  const points: SensitivityPoint[] = [];
  for (let pl = PL_MIN; pl <= PL_MAX; pl += SENSITIVITY_PL_STEP) {
    const result = calculateViabilidade({ ...params, pl });
    points.push({ pl, margin: result.margin, netResult: result.netResult });
  }
  return points;
}

export function calculateCostBreakdown(
  params: ViabilidadeParams,
  result: ViabilidadeResult
): CostBreakdown[] {
  const total = result.totalCosts;
  if (total <= 0) return [];

  const items: CostBreakdown[] = [
    { label: "Auditoria", value: params.auditCost, percentage: (params.auditCost / total) * 100 },
    { label: "Rating", value: params.ratingCost, percentage: (params.ratingCost / total) * 100 },
    { label: "CVM + Anbima", value: params.cvmFees, percentage: (params.cvmFees / total) * 100 },
    { label: "Jurídico (amort. 3 anos)", value: params.legalSetup / 3, percentage: ((params.legalSetup / 3) / total) * 100 },
    { label: "Outros Fixos", value: params.otherFixed, percentage: (params.otherFixed / total) * 100 },
    { label: "Gestão", value: params.pl * 1_000_000 * params.managementFee / 100, percentage: (params.pl * 1_000_000 * params.managementFee / 100 / total) * 100 },
    { label: "Administração", value: params.pl * 1_000_000 * params.adminFee / 100, percentage: (params.pl * 1_000_000 * params.adminFee / 100 / total) * 100 },
  ];
  return items;
}
