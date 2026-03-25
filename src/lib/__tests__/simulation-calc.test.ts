import {
  createInitialState,
  advanceYear,
  isGameOver,
  getGameOutcome,
} from "../financial-regulation/simulation-calc";
import { SIM_DEFAULTS } from "../financial-regulation/constants";
import type { SimulationYearInput } from "../financial-regulation/types";

describe("createInitialState", () => {
  it("returns defaults matching SIM_DEFAULTS", () => {
    const state = createInitialState();
    expect(state.currentYear).toBe(SIM_DEFAULTS.startYear);
    expect(state.capital).toBe(SIM_DEFAULTS.initialCapital);
    expect(state.assets).toBe(SIM_DEFAULTS.initialAssets);
    expect(state.rwaPercent).toBe(SIM_DEFAULTS.initialRwaPercent);
    expect(state.history).toEqual([]);
  });
});

describe("advanceYear", () => {
  it("computes correct values for a normal year", () => {
    const state = createInitialState();
    const input: SimulationYearInput = { growthRate: 10, roa: 2, isStress: false };
    const { result } = advanceYear(state, input);

    // newAssets = 1000 * 1.1 = 1100
    expect(result.assets).toBeCloseTo(1100, 1);
    // profit = 1100 * 0.02 = 22
    expect(result.profit).toBeCloseTo(22, 1);
    // provisions = 1100 * 0.008 = 8.8
    expect(result.provisions).toBeCloseTo(8.8, 1);
    // dividends = (22 - 8.8) * 0.5 = 6.6
    expect(result.dividends).toBeCloseTo(6.6, 1);
    // deltaCapital = 22 - 8.8 - 6.6 = 6.6
    expect(result.deltaCapital).toBeCloseTo(6.6, 1);
    // capitalFinal = 150 + 6.6 = 156.6
    expect(result.capitalFinal).toBeCloseTo(156.6, 1);
  });

  it("uses stress provision rate when isStress=true", () => {
    const state = createInitialState();
    const input: SimulationYearInput = { growthRate: 0, roa: 2, isStress: true };
    const { result } = advanceYear(state, input);

    // provisions = 1000 * 0.04 = 40
    expect(result.provisions).toBeCloseTo(40, 1);
  });

  it("returns correct nextState", () => {
    const state = createInitialState();
    const input: SimulationYearInput = { growthRate: 10, roa: 2, isStress: false };
    const { result, nextState } = advanceYear(state, input);

    expect(nextState.currentYear).toBe(state.currentYear + 1);
    expect(nextState.capital).toBe(result.capitalFinal);
    expect(nextState.assets).toBe(result.assets);
    expect(nextState.rwaPercent).toBe(state.rwaPercent);
    expect(nextState.history).toHaveLength(1);
    expect(nextState.history[0]).toBe(result);
  });

  it("progresses correctly over 3 years", () => {
    let state = createInitialState();
    const input: SimulationYearInput = { growthRate: 5, roa: 3, isStress: false };

    for (let i = 0; i < 3; i++) {
      const { nextState } = advanceYear(state, input);
      state = nextState;
    }

    expect(state.currentYear).toBe(SIM_DEFAULTS.startYear + 3);
    expect(state.history).toHaveLength(3);
    // Capital should have grown (positive ROA, moderate growth)
    expect(state.capital).toBeGreaterThan(SIM_DEFAULTS.initialCapital);
  });
});

describe("isGameOver", () => {
  it("returns false when currentYear <= endYear", () => {
    const state = createInitialState();
    expect(isGameOver(state)).toBe(false);
  });

  it("returns true when currentYear > endYear", () => {
    const state = { ...createInitialState(), currentYear: SIM_DEFAULTS.endYear + 1 };
    expect(isGameOver(state)).toBe(true);
  });
});

describe("getGameOutcome", () => {
  it("returns not started message for empty history", () => {
    const state = createInitialState();
    expect(getGameOutcome(state)).toContain("não iniciada");
  });

  it("returns success message when both ratios pass", () => {
    let state = createInitialState();
    const input: SimulationYearInput = { growthRate: 5, roa: 3, isStress: false };
    for (let i = 0; i < 3; i++) {
      const { nextState } = advanceYear(state, input);
      state = nextState;
    }
    const outcome = getGameOutcome(state);
    expect(outcome).toContain("bem capitalizado");
  });
});
