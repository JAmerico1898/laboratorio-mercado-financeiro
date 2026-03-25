import type { SectionConfig, ServiceInfo, ParticipantInfo, OpportunityInfo, RegulatoryPrinciple, TimelineEvent, FlowNode, FlowEdge, StructureModel, RevenueModel, DiscussionTopic } from "./types";

// === SECTION NAVIGATION ===
export const SECTIONS: SectionConfig[] = [
  { id: "introducao",     label: "Introdução",      icon: "home" },
  { id: "ecossistema",    label: "Ecossistema",     icon: "hub" },
  { id: "modelos",        label: "Modelos",         icon: "business" },
  { id: "servicos",       label: "Serviços",        icon: "settings" },
  { id: "regulacao",      label: "Regulação",       icon: "gavel" },
  { id: "riscos",         label: "Riscos",          icon: "warning" },
  { id: "oportunidades",  label: "Oportunidades",   icon: "rocket_launch" },
  { id: "cenario-global", label: "Cenário Global",  icon: "public" },
  { id: "simulador",      label: "Simulador",       icon: "tune" },
  { id: "quiz",           label: "Quiz",            icon: "quiz" },
];

// === SIMULATOR CONFIGURATION ===
export const BASE_COST: Record<string, number> = {
  "Parceria Direta": 500_000,
  "Via Middleware": 150_000,
  "Banco Nativo API": 300_000,
};

export const BASE_TTM: Record<string, number> = {
  "Parceria Direta": 12,
  "Via Middleware": 4,
  "Banco Nativo API": 6,
};

export const RISK_SCORE: Record<string, number> = {
  "Parceria Direta": 2,
  "Via Middleware": 4,
  "Banco Nativo API": 2,
};

export const TIPO_TOMADOR_OPTIONS = [
  "Fintech (Neobank)", "Varejista", "Marketplace", "SaaS B2B", "Gig Economy",
] as const;

export const ESTRUTURA_OPTIONS = [
  "Parceria Direta", "Via Middleware", "Banco Nativo API",
] as const;

export const SERVICOS_OPTIONS = [
  "Conta de Pagamento", "Pix", "Cartão de Débito",
  "Cartão de Crédito", "Crédito/Empréstimo", "Câmbio (eFX)",
] as const;

export const DEFAULT_SERVICOS = ["Conta de Pagamento", "Pix", "Cartão de Débito"];

export const VOLUME_MIN = 10;
export const VOLUME_MAX = 1000;
export const VOLUME_STEP = 10;
export const VOLUME_DEFAULT = 100;

export const TICKET_MIN = 50;
export const TICKET_MAX = 5000;
export const TICKET_STEP = 50;
export const TICKET_DEFAULT = 500;

// === CHART DATA ===
export const RISK_CATEGORIES = ["Regulatório", "Operacional", "Reputacional", "Econômico", "Cibernético", "Conformidade"];
export const RISK_INHERENT = [5, 4, 3, 4, 5, 5];
export const RISK_MITIGATED = [3, 3, 2, 3, 3, 4];

export const GLOBAL_REGIONS = ["EUA", "UK", "UE", "Brasil", "APAC", "África"];
export const GLOBAL_METRICS: Record<string, number[]> = {
  "Maturidade Reg.": [4, 5, 5, 4, 3, 2],
  "Adoção BaaS":     [5, 4, 4, 3, 4, 2],
  "Infra Tech":      [5, 5, 4, 4, 4, 2],
  "Inclusão Fin.":   [3, 4, 4, 3, 3, 4],
};

export const GLOBAL_METRIC_COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b"];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { date: "Out 2024", title: "CP 108/2024", status: "done" },
  { date: "Jan 2025", title: "Prazo Original", status: "done" },
  { date: "Fev 2025", title: "CP 115/2025", status: "current" },
  { date: "2025", title: "Análise", status: "pending" },
  { date: "2025", title: "Resolução", status: "pending" },
];

export const FLOW_NODES: FlowNode[] = [
  { id: "bcb",        x: 0.1,  y: 0.5, icon: "⚖️", label: "Banco Central",          color: "#10b981" },
  { id: "banco",      x: 0.35, y: 0.8, icon: "🏛️", label: "Instituição Prestadora", color: "#0ea5e9" },
  { id: "middleware",  x: 0.5,  y: 0.5, icon: "🔌", label: "Middleware",              color: "#f59e0b" },
  { id: "tomador",    x: 0.65, y: 0.2, icon: "📱", label: "Tomador de Serviços",    color: "#8b5cf6" },
  { id: "cliente",    x: 0.9,  y: 0.5, icon: "👤", label: "Cliente Final",           color: "#ec4899" },
];

export const FLOW_EDGES: FlowEdge[] = [
  { from: "bcb",    to: "banco",    label: "Regulação" },
  { from: "banco",  to: "middleware", label: "APIs" },
  { from: "middleware", to: "tomador", label: "Serviços" },
  { from: "tomador", to: "cliente",  label: "UX" },
  { from: "banco",  to: "tomador",  label: "Supervisão" },
];

// === CONTENT DATA ===
export const SERVICES_DATA: ServiceInfo[] = [
  { icon: "💳", name: "Contas de Pagamento", status: "Previsto", statusColor: "emerald", description: "Contas correntes, poupança e pré-pagas." },
  { icon: "⚡", name: "Pix", status: "Previsto", statusColor: "emerald", description: "Pagamento instantâneo: QR Code, Saque, Troco." },
  { icon: "💎", name: "Cartões", status: "Previsto", statusColor: "emerald", description: "Débito, crédito e pré-pagos." },
  { icon: "📤", name: "TED/TEF", status: "Previsto", statusColor: "emerald", description: "Transferências bancárias tradicionais." },
  { icon: "📈", name: "Crédito", status: "Em Discussão", statusColor: "amber", description: "Oferta e contratação de empréstimos." },
  { icon: "🏪", name: "Credenciamento", status: "Em Discussão", statusColor: "amber", description: "Aceitação de pagamentos. Subcredenciadores." },
  { icon: "🔄", name: "ITP", status: "Em Avaliação", statusColor: "cyan", description: "Iniciação via Open Finance." },
  { icon: "🌎", name: "eFX", status: "Em Avaliação", statusColor: "cyan", description: "Pagamentos internacionais." },
  { icon: "📊", name: "Investimentos", status: "Futuro", statusColor: "violet", description: "CDBs, fundos e previdência." },
];

export const PARTICIPANTS: ParticipantInfo[] = [
  {
    icon: "🏛️", name: "Instituição Prestadora", subtitle: "Banco, IP, SCD autorizado pelo BCB",
    color: "#0ea5e9",
    responsibilities: ["Licença regulatória", "Gestão de balanço", "Conformidade PLD/FT", "Supervisão de riscos", "Reporte ao BCB"],
  },
  {
    icon: "📱", name: "Tomador de Serviços", subtitle: "Fintech, Varejo, Plataforma Digital",
    color: "#8b5cf6",
    responsibilities: ["Tecnologia e UX", "Marketing e aquisição", "Design de produto", "Relacionamento com cliente"],
  },
  {
    icon: "🔌", name: "Middleware (Opcional)", subtitle: "Plataforma de integração técnica",
    color: "#f59e0b",
    responsibilities: ["Simplificação via APIs", "Camada de abstração", "Gestão de programa", "Suporte operacional"],
  },
  {
    icon: "⚖️", name: "Banco Central do Brasil", subtitle: "Regulador e Supervisor",
    color: "#10b981",
    responsibilities: ["Autorização de instituições", "Regulação do modelo BaaS", "Supervisão e fiscalização", "Proteção do SFN"],
  },
];

export const OPPORTUNITIES: OpportunityInfo[] = [
  { icon: "🚀", title: "Inclusão Financeira", color: "#10b981", description: "Ampliação do acesso a serviços financeiros para populações desbancarizadas." },
  { icon: "💡", title: "Inovação", color: "#8b5cf6", description: "Novos produtos e experiências financeiras integradas." },
  { icon: "📈", title: "Novos Mercados", color: "#0ea5e9", description: "Acesso a segmentos antes inviáveis economicamente." },
  { icon: "💰", title: "Diversificação", color: "#f59e0b", description: "Novas fontes de receita para bancos e fintechs." },
  { icon: "⚡", title: "Eficiência", color: "#ec4899", description: "Otimização via especialização de cada participante." },
  { icon: "🤝", title: "Competitividade", color: "#06b6d4", description: "Democratização da infraestrutura bancária." },
];

export const REGULATORY_PRINCIPLES: RegulatoryPrinciple[] = [
  { icon: "🔍", title: "Transparência", description: "Clareza nas informações ao cliente" },
  { icon: "⚖️", title: "Conduta", description: "Proteção do consumidor financeiro" },
  { icon: "🛡️", title: "PLD/FT", description: "Prevenção à lavagem de dinheiro" },
  { icon: "🔒", title: "Controles Internos", description: "Gestão de riscos" },
  { icon: "📋", title: "Responsabilização", description: "Definição clara de responsabilidades" },
  { icon: "📊", title: "Prudencial", description: "Requerimentos de capital em avaliação" },
];

export const STRUCTURE_MODELS: StructureModel[] = [
  {
    name: "Parceria Direta", icon: "🤝", color: "#0ea5e9",
    description: "Integração direta entre instituição e tomador.",
    pros: ["Maior controle e flexibilidade"],
    cons: ["Maior complexidade técnica"],
  },
  {
    name: "Via Middleware", icon: "🔗", color: "#8b5cf6",
    description: "Plataforma intermediária facilita a integração.",
    pros: ["Integração simplificada"],
    cons: ["Dependência do intermediário"],
  },
  {
    name: "Banco Nativo API", icon: "⚡", color: "#10b981",
    description: "Bancos construídos com tecnologia moderna.",
    pros: ["Alta performance/escala"],
    cons: ["Poucos players"],
  },
];

export const REVENUE_MODELS: RevenueModel[] = [
  { title: "Orientado por Intercâmbio", color: "#0ea5e9", variant: "cyan", description: "Receita gerada a cada transação com cartão. Nos EUA, Emenda Durbin criou arbitragem favorecendo bancos menores." },
  { title: "Captação de Depósitos", color: "#10b981", variant: "green", description: "Fintechs como canal de aquisição de depósitos de baixo custo. Banco compartilha margem de juros líquida." },
  { title: "Originação de Crédito", color: "#f59e0b", variant: "amber", description: "Banco origina empréstimos usando sua licença, vende para fintech ou investidores.", warning: "Atenção ao risco de \"True Lender\"" },
  { title: "Taxas de Plataforma", color: "#8b5cf6", variant: "default", description: "Modelo de middlewares: taxas fixas, percentual sobre volume, ou compartilhamento de receita." },
];

export const DISCUSSION_TOPICS: DiscussionTopic[] = [
  { title: "Subcredenciamento via BaaS", icon: "🏪", content: "O BCB propõe que subcredenciadores atuem exclusivamente como tomadores de BaaS, operando através de credenciadores autorizados." },
  { title: "Inclusão de ITP", icon: "🔄", content: "Avaliação de condicionantes para Iniciação de Transação de Pagamento: limitação de volume, portes de prestador e tomador." },
  { title: "Inclusão de eFX", icon: "🌎", content: "Discussão sobre câmbio internacional: montante máximo, tipo de instituição, obrigatoriedade de conta na mesma instituição." },
];
