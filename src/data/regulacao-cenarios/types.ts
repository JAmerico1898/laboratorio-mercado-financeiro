// Tipos do Módulo 8 — Regulação Bancária · Cenários (spec §6).
// Estrutura idêntica à do Módulo 7 (FIDC · Cenários), acrescida do campo `bank`
// no breadcrumb e da regra de capital global (GlobalRuleChip + KeyFact).
// Strings de conteúdo aceitam HTML inline restrito (<strong>, <em>, <br>),
// renderizado de forma sanitizada por <SafeHtml/>.

export type Difficulty = "intermediario" | "avancado";
export type Tone = "default" | "positive" | "warning";
export type DeltaTone = "positive" | "negative" | "neutral" | "risk";

export interface KeyFact {
  label: string;
  value: string;
  tone?: Tone;
}

export interface StatementRow {
  label: string;
  values: string[];
  emphasis?: boolean;
}

export interface Statement {
  id: string;
  title: string;
  columns: string[];
  rows: StatementRow[];
  note?: string;
}

export interface Option {
  id: string;
  text: string; // HTML inline restrito
  correct: boolean;
  feedback: string; // memória de cálculo (HTML inline restrito)
}

export interface Etapa {
  id: string;
  label: string;
  prompt: string; // HTML inline restrito
  options: Option[]; // 4 opções; exatamente 1 com correct:true
  points: number; // padrão 20
}

export interface DeltaMetric {
  label: string;
  value: string;
  tone: DeltaTone;
}

export interface Resultado {
  headline: string;
  caption: string;
  metrics: DeltaMetric[];
  explanation: string; // HTML inline restrito
}

export interface Branch {
  id: "A" | "B" | "C";
  title: string;
  summary: string; // HTML inline restrito
  resultado: Resultado;
}

export interface Reflexao {
  prompt: string;
  options: Option[]; // 4 opções; 1 correta
  points: number; // padrão 25
}

export interface Scenario {
  id: string; // "s6-1"
  code: string; // "S6.1"
  order: number;
  title: string;
  bank: string; // "Banco Crescente S.A."
  difficulty: Difficulty;
  estMinutes: number;
  blurb: string;
  archetype: string;
  context: string; // HTML inline restrito
  keyFacts: KeyFact[];
  statements: Statement[];
  etapas: Etapa[];
  encruzilhada: { prompt: string; branches: Branch[] };
  reflexao: Reflexao;
  maxScore: number; // 85
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  intermediario: "Intermediário",
  avancado: "Avançado",
};

// Regra de capital única do módulo (spec §2). Reutilizada pelo GlobalRuleChip
// e por um KeyFact destacado em cada cenário.
export const CAPITAL_RULE = {
  label: "Requisito de capital",
  value: "IB = PR/RWA ≥ 10,5%",
} as const;
