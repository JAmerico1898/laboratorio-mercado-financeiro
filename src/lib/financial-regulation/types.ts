// Stepper
export interface StepConfig {
  index: number;
  label: string;
  icon: string;
}

// RWA
export interface AssetAllocation {
  cash: number;
  govBonds: number;
  mortgages: number;
  corpLoans: number;
  highYield: number;
  unrated: number;
}

export interface AssetRwaDetail {
  label: string;
  allocation: number;
  riskWeight: number;
  rwaContribution: number;
}

export interface RwaResult {
  details: AssetRwaDetail[];
  rwaTotal: number;
  requiredCapital: number;
  car: number;
  capitalBuffer: number;
  status: "well-capitalized" | "adequate" | "undercapitalized";
}

// Provisioning
export type Scenario = "Boom" | "Normal" | "Recessão";
export type ProvisioningModel = "Res2682" | "Res4966";

export interface ProvisioningParams {
  portfolio: number; // $M
  interestRate: number; // % annual
  scenario: Scenario;
  model: ProvisioningModel;
}

export interface ProvisioningYearResult {
  year: number;
  interest: number;
  provision: number;
  netProfit: number;
}

export interface ProvisioningResult {
  years: ProvisioningYearResult[];
  cumProvisions: number;
  cumProfit: number;
  calloutKey: string;
}

// Leverage
export interface LeverageParams {
  capital: number; // $M
  totalAssets: number; // $M
  rwaPercent: number; // 0-100
}

export interface LeverageResult {
  rwa: number;
  car: number;
  leverage: number;
  status: "both-ok" | "car-violation" | "leverage-violation" | "both-violation";
}

// Simulation (Build Your Bank)
export interface SimulationState {
  currentYear: number;
  capital: number;
  assets: number;
  rwaPercent: number;
  history: SimulationYearResult[];
}

export interface SimulationYearInput {
  growthRate: number; // % (-20 to 60)
  roa: number; // % (0-8)
  isStress: boolean;
}

export interface SimulationYearResult {
  year: number;
  capitalInitial: number;
  capitalFinal: number;
  deltaCapital: number;
  assets: number;
  car: number;
  leverage: number;
  profit: number;
  provisions: number;
  dividends: number;
}

// Animation
export interface AnimationStage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface BankMetrics {
  capital: number;
  assets: number;
  rwa: number;
  provisions: number;
  car: number;
  leverage: number;
}

// Quiz
export interface QuizQuestion {
  id: string;
  type: "radio" | "checkbox";
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
}
