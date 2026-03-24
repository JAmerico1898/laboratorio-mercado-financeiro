import type { SubordinacaoParams, WaterfallResult, LayerState, RupturePoint, SensitivityCurvePoint } from "./types";
import { SUB_LOSS_MAX_PERCENT, SUB_SENSITIVITY_STEP } from "./constants";

export function calculateWaterfall(params: SubordinacaoParams): WaterfallResult {
  const plValue = params.pl * 1_000_000;
  const subPercent = params.subordinationIndex / 100;
  const loss = params.simulatedLoss;

  let seniorInitial: number;
  let mezaninoInitial: number | undefined;
  let juniorInitial: number;

  if (params.includeMezanino) {
    seniorInitial = plValue * (1 - subPercent);
    mezaninoInitial = plValue * (subPercent / 2);
    juniorInitial = plValue * (subPercent / 2);
  } else {
    seniorInitial = plValue * (1 - subPercent);
    juniorInitial = plValue * subPercent;
  }

  // Loss waterfall: Junior → Mezanino → Senior
  let remaining = loss;

  const juniorLoss = Math.min(remaining, juniorInitial);
  remaining -= juniorLoss;

  let mezaninoLoss = 0;
  if (params.includeMezanino && mezaninoInitial !== undefined) {
    mezaninoLoss = Math.min(remaining, mezaninoInitial);
    remaining -= mezaninoLoss;
  }

  const seniorLoss = Math.min(remaining, seniorInitial);

  const junior: LayerState = {
    initial: juniorInitial,
    loss: juniorLoss,
    final: juniorInitial - juniorLoss,
    lossPercent: juniorInitial > 0 ? (juniorLoss / juniorInitial) * 100 : 0,
  };

  const senior: LayerState = {
    initial: seniorInitial,
    loss: seniorLoss,
    final: seniorInitial - seniorLoss,
    lossPercent: seniorInitial > 0 ? (seniorLoss / seniorInitial) * 100 : 0,
  };

  const mezanino: LayerState | undefined =
    params.includeMezanino && mezaninoInitial !== undefined
      ? {
          initial: mezaninoInitial,
          loss: mezaninoLoss,
          final: mezaninoInitial - mezaninoLoss,
          lossPercent: mezaninoInitial > 0 ? (mezaninoLoss / mezaninoInitial) * 100 : 0,
        }
      : undefined;

  // Effective subordination
  const remainingSubordinated = junior.final + (mezanino?.final ?? 0);
  const remainingTotal = plValue - loss;
  const effectiveSubordination =
    remainingTotal > 0 ? (remainingSubordinated / remainingTotal) * 100 : 0;
  const contractualSubordination = params.subordinationIndex;
  const isDrawdown = effectiveSubordination < contractualSubordination;

  // Status
  let status: WaterfallResult["status"];
  let statusMessage: string;
  if (seniorLoss > 0) {
    status = "error";
    statusMessage = "Cota Sênior impactada — drawdown crítico";
  } else if (mezaninoLoss > 0) {
    status = "warning";
    statusMessage = "Cota Mezanino afetada — Sênior protegida";
  } else if (juniorLoss > 0 && junior.final > 0) {
    status = "success";
    statusMessage = "Perda absorvida pela Subordinada";
  } else if (juniorLoss > 0 && junior.final === 0) {
    status = "warning";
    statusMessage = "Subordinada eliminada — próximo nível em risco";
  } else {
    status = "success";
    statusMessage = "Sem perdas simuladas";
  }

  return {
    senior,
    mezanino,
    junior,
    effectiveSubordination,
    contractualSubordination,
    isDrawdown,
    status,
    statusMessage,
  };
}

export function calculateSensitivityCurve(params: SubordinacaoParams): SensitivityCurvePoint[] {
  const plValue = params.pl * 1_000_000;
  const points: SensitivityCurvePoint[] = [];

  for (let pct = 0; pct <= SUB_LOSS_MAX_PERCENT; pct += SUB_SENSITIVITY_STEP) {
    const lossAmount = plValue * (pct / 100);
    const result = calculateWaterfall({ ...params, simulatedLoss: lossAmount });
    points.push({
      lossPercent: pct,
      lossAmount,
      seniorValue: result.senior.final,
      mezaninoValue: result.mezanino?.final,
      juniorValue: result.junior.final,
    });
  }
  return points;
}

export function calculateRupturePoints(params: SubordinacaoParams): RupturePoint[] {
  const plValue = params.pl * 1_000_000;
  const subPercent = params.subordinationIndex / 100;
  const points: RupturePoint[] = [];

  if (params.includeMezanino) {
    const juniorAmount = plValue * (subPercent / 2);
    const mezaninoAmount = plValue * (subPercent / 2);
    points.push({
      label: "Junior",
      lossPercent: (juniorAmount / plValue) * 100,
      lossAmount: juniorAmount,
    });
    points.push({
      label: "Mezanino",
      lossPercent: ((juniorAmount + mezaninoAmount) / plValue) * 100,
      lossAmount: juniorAmount + mezaninoAmount,
    });
  } else {
    const juniorAmount = plValue * subPercent;
    points.push({
      label: "Junior",
      lossPercent: (juniorAmount / plValue) * 100,
      lossAmount: juniorAmount,
    });
  }

  points.push({
    label: "Fundo Total",
    lossPercent: 100,
    lossAmount: plValue,
  });

  return points;
}
