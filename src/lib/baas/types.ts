// Simulator types
export interface SimulatorParams {
  tipoTomador: string;
  estrutura: string;
  servicos: string[];
  volumeSlider: number;   // 10–1000 (thousands)
  ticketMedio: number;     // R$ 50–5000
}

export interface RevenueBreakdown {
  interchange: number;
  float: number;
  credit: number;
  total: number;
}

export interface SimulatorResult {
  investment: number;
  ttm: number;
  revenue: RevenueBreakdown;
  riskScore: number;
  recommendations: string[];
}

// Quiz types
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
}

// Section Nav types
export interface SectionConfig {
  id: string;
  label: string;
  icon: string;
}

// Content data types
export interface ServiceInfo {
  icon: string;
  name: string;
  status: "Previsto" | "Em Discussão" | "Em Avaliação" | "Futuro";
  statusColor: string;
  description: string;
}

export interface ParticipantInfo {
  icon: string;
  name: string;
  subtitle: string;
  color: string;
  responsibilities: string[];
}

export interface OpportunityInfo {
  icon: string;
  title: string;
  color: string;
  description: string;
}

export interface RegulatoryPrinciple {
  icon: string;
  title: string;
  description: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  status: "done" | "current" | "pending";
}

export interface GlobalRegionData {
  region: string;
  maturidadeReg: number;
  adocaoBaas: number;
  infraTech: number;
  inclusaoFin: number;
}

export interface FlowNode {
  id: string;
  x: number;
  y: number;
  icon: string;
  label: string;
  color: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label: string;
}

export interface StructureModel {
  name: string;
  icon: string;
  color: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface RevenueModel {
  title: string;
  color: string;
  variant: "cyan" | "green" | "amber" | "default";
  description: string;
  warning?: string;
}

export interface DiscussionTopic {
  title: string;
  icon: string;
  content: string;
}
