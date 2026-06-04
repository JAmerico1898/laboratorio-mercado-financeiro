// Tipos do Módulo 10 — Gestão de Crédito · Cenários (spec §6).
// Mesma estrutura do Módulo 9 (BaaS e Tokenização), com uma diferença (spec §2/§5):
//   • sem regra global (não há GlobalRuleChip / faixa fixa no topo);
//   • acréscimo de `detailBoxLabel`: rótulo adaptável da caixa ocultável por cenário
//     ("Dados da operação", "Cenários macro", "Carteira e provisões", "Comparativo de carteiras").
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
  id: string; // "s8-1"
  code: string; // "S8.1"
  order: number;
  title: string;
  protagonist: string; // "Crédito Alfa" / "Comitê de Crédito" ...
  difficulty: Difficulty;
  estMinutes: number;
  blurb: string;
  archetype: string;
  context: string; // HTML inline restrito
  keyFacts: KeyFact[];
  detailBoxLabel: string; // rótulo da caixa ocultável (spec §2)
  details: DetailTable[];
  etapas: Etapa[];
  encruzilhada: { prompt: string; branches: Branch[] };
  reflexao: Reflexao;
  maxScore: number; // 85
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  intermediario: "Intermediário",
  avancado: "Avançado",
};
