// Tipos do Módulo 9 — BaaS e Tokenização · Cenários (spec §6).
// Mesma estrutura do Módulo 8 (Regulação Bancária), com três diferenças (spec §2/§5):
//   • sem regra global (não há GlobalRuleChip / CAPITAL_RULE);
//   • `bank` → `protagonist` (banco licenciado, marca, empresa ou tesouraria);
//   • `statements` → `details`, renderizado sob o título "Dados detalhados".
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

export interface DetailRow {
  label: string;
  values: string[];
  emphasis?: boolean;
}

export interface DetailTable {
  id: string;
  title: string;
  columns: string[];
  rows: DetailRow[];
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
  id: string; // "s7-1"
  code: string; // "S7.1"
  order: number;
  title: string;
  protagonist: string; // "Banco Trilho S.A." / "VarejoX (marca)" ...
  difficulty: Difficulty;
  estMinutes: number;
  blurb: string;
  archetype: string;
  context: string; // HTML inline restrito
  keyFacts: KeyFact[];
  details: DetailTable[]; // renderizado sob "Dados detalhados"
  etapas: Etapa[];
  encruzilhada: { prompt: string; branches: Branch[] };
  reflexao: Reflexao;
  maxScore: number; // 85
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  intermediario: "Intermediário",
  avancado: "Avançado",
};
