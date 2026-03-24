// Stepper
export interface StepConfig {
  index: number;
  label: string;
  icon: string;
}

// Sub-Module 1: Viabilidade
export interface ViabilidadeParams {
  pl: number;              // R$ millions
  yieldRate: number;       // % a.a.
  auditCost: number;       // R$/year
  ratingCost: number;      // R$/year
  cvmFees: number;         // R$/year
  legalSetup: number;      // R$ total (amortized over 3 years)
  otherFixed: number;      // R$/year
  managementFee: number;   // % a.a.
  adminFee: number;        // % a.a.
}

export interface ViabilidadeResult {
  receitaBruta: number;
  fixedCosts: number;
  variableCosts: number;
  totalCosts: number;
  netResult: number;
  margin: number;
  isViable: boolean;
  viabilityLevel: "inviable" | "risky" | "viable";
}

export interface SensitivityPoint {
  pl: number;
  margin: number;
  netResult: number;
}

export interface CostBreakdown {
  label: string;
  value: number;
  percentage: number;
}

// Sub-Module 3: Sensitivity curve point (used by RuptureChart)
export interface SensitivityCurvePoint {
  lossPercent: number;
  lossAmount: number;
  seniorValue: number;
  mezaninoValue?: number;
  juniorValue: number;
}

// Sub-Module 4: Compliance status
export interface ComplianceStatus {
  completed: number;
  total: number;
  percentage: number;
  level: "approved" | "almost" | "pending";
}

// Sub-Module 2: Classes
export interface AssetClass {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  subordinationIndex: number;
}

export interface ClassConfig {
  fundName: string;
  fundCnpj: string;
  classes: AssetClass[];
  includeMezanino: boolean;
}

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  type: "root" | "class" | "subclass";
}

export interface DiagramEdge {
  source: string;
  target: string;
  label?: string;
}

// Sub-Module 3: Subordinação
export interface SubordinacaoParams {
  pl: number;
  subordinationIndex: number;
  includeMezanino: boolean;
  simulatedLoss: number;
}

export interface LayerState {
  initial: number;
  loss: number;
  final: number;
  lossPercent: number;
}

export interface WaterfallResult {
  senior: LayerState;
  mezanino?: LayerState;
  junior: LayerState;
  effectiveSubordination: number;
  contractualSubordination: number;
  isDrawdown: boolean;
  status: "success" | "warning" | "error";
  statusMessage: string;
}

export interface RupturePoint {
  label: string;
  lossPercent: number;
  lossAmount: number;
}

// Sub-Module 4: Checklist
export type InvestorType = "profissional" | "varejo";
export type AssetType = "dcp" | "dcnp";
export type RegistrationType = "automatic" | "ordinary" | "simplified";

export interface ChecklistState {
  investorType: InvestorType | null;
  assetType: AssetType | null;
  isForbiddenCombo: boolean;
  complianceItems: Record<string, boolean>;
  anbimaConvenant: boolean | null;
  registrationType: RegistrationType | null;
}

export interface RegistrationTimeline {
  type: string;
  description: string;
  totalDays: number;
  milestones: { label: string; daysFromStart: number; date: string }[];
}

export interface CostEstimate {
  category: string;
  items: { label: string; value: string; isRetailOnly?: boolean }[];
}
