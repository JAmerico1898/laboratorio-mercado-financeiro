// src/lib/tokenization/types.ts

export interface StepConfig {
  index: number;
  label: string;
  icon: string;
}

export interface Block {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
}

export interface MiningState {
  isMining: boolean;
  currentNonce: number;
  elapsedMs: number;
}

export interface TokenClassification {
  tipo: string;
  regulacao: string;
  fracionalizacao: string;
  padrao: string;
}

export interface MecanicaParams {
  assetName: string;
  valuation: number;
  fractionCount: number;
  standard: "ERC-20" | "ERC-721";
  custodyQuality:
    | "Baixa/Inexistente"
    | "Média (Auditoria Anual)"
    | "Alta (Banco Top-tier)";
}

export interface MecanicaResult {
  tokenPrice: number;
  marketCap: number;
  distribution: Array<{ stakeholder: string; quantidade: number }>;
  riskFlags: Array<{ level: "warning" | "error" | "success"; message: string }>;
}

export interface RealEstateResult {
  months: number[];
  prices: number[];
  dividends: number[];
  totalDividends: number;
  capitalGain: number;
  roi: number;
}

export interface BondResult {
  years: number[];
  cashFlows: number[];
  status: "Adimplente" | "Default (Calote)";
  defaultYear?: number;
}

export interface RiskImpactResult {
  categories: string[];
  impacts: number[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizState {
  answers: Record<number, number>;
  revealed: Record<number, boolean>;
  score: number;
}
