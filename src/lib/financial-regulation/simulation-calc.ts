import type {
  SimulationState,
  SimulationYearInput,
  SimulationYearResult,
} from "./types";
import { SIM_DEFAULTS, CAR_MINIMUM, LEVERAGE_MINIMUM } from "./constants";

/**
 * Create the initial simulation state with default values.
 */
export function createInitialState(): SimulationState {
  return {
    currentYear: SIM_DEFAULTS.startYear,
    capital: SIM_DEFAULTS.initialCapital,
    assets: SIM_DEFAULTS.initialAssets,
    rwaPercent: SIM_DEFAULTS.initialRwaPercent,
    history: [],
  };
}

/**
 * Advance the simulation by one year.
 * Returns the year result and the next state.
 */
export function advanceYear(
  state: SimulationState,
  input: SimulationYearInput
): { result: SimulationYearResult; nextState: SimulationState } {
  const newAssets = Math.round(state.assets * (1 + input.growthRate / 100) * 10) / 10;

  const profitGross = Math.round(newAssets * (input.roa / 100) * 10) / 10;

  const provisionRate = input.isStress
    ? SIM_DEFAULTS.stressProvisionRate
    : SIM_DEFAULTS.normalProvisionRate;
  const provisions = Math.round(newAssets * provisionRate * 10) / 10;

  const dividends = Math.round((profitGross - provisions) * SIM_DEFAULTS.payoutRatio * 10) / 10;

  const deltaCapital = profitGross - provisions - dividends;
  const capitalFinal = Math.round((state.capital + deltaCapital) * 10) / 10;

  const rwaRatio = state.rwaPercent / 100;
  const car = Math.round((capitalFinal / (newAssets * rwaRatio)) * 100 * 10) / 10;
  const leverage = Math.round((capitalFinal / newAssets) * 100 * 10) / 10;

  const result: SimulationYearResult = {
    year: state.currentYear,
    capitalInitial: state.capital,
    capitalFinal,
    deltaCapital,
    assets: newAssets,
    car,
    leverage,
    profit: profitGross,
    provisions,
    dividends,
  };

  const nextState: SimulationState = {
    currentYear: state.currentYear + 1,
    capital: capitalFinal,
    assets: newAssets,
    rwaPercent: state.rwaPercent,
    history: [...state.history, result],
  };

  return { result, nextState };
}

/**
 * Check if the simulation has ended (past the final year).
 */
export function isGameOver(state: SimulationState): boolean {
  return state.currentYear > SIM_DEFAULTS.endYear;
}

/**
 * Get the outcome of the simulation based on the last year's metrics.
 */
export function getGameOutcome(state: SimulationState): string {
  if (state.history.length === 0) {
    return "Simulação não iniciada";
  }

  const last = state.history[state.history.length - 1];
  const carOk = last.car >= CAR_MINIMUM;
  const leverageOk = last.leverage >= LEVERAGE_MINIMUM;

  if (carOk && leverageOk) {
    return "Banco bem capitalizado! Parabéns, você manteve os índices regulatórios.";
  } else if (!carOk && !leverageOk) {
    return "Banco subcapitalizado! Tanto o CAR quanto o Índice de Alavancagem estão abaixo do mínimo.";
  } else if (!carOk) {
    return "CAR abaixo do mínimo regulatório de 10,5%.";
  } else {
    return "Índice de Alavancagem abaixo do mínimo de 3%.";
  }
}
