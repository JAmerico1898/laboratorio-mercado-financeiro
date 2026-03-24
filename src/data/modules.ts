export interface ModuleInfo {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const modules: ModuleInfo[] = [
  {
    id: 1,
    title: "Estrutura a Termo de Taxas de Juros",
    description:
      "Analise a curva de juros e suas implicações macroeconômicas e financeiras no cenário atual.",
    icon: "query_stats",
  },
  {
    id: 2,
    title: "Modelagem de Risco de Crédito",
    description:
      "Técnicas avançadas para mensuração e mitigação de riscos em operações de crédito.",
    icon: "security",
  },
  {
    id: 3,
    title: "Fundos de Direitos Creditórios (FIDC)",
    description:
      "Estruturação e gestão de um dos veículos mais dinâmicos de securitização do mercado.",
    icon: "account_balance_wallet",
  },
  {
    id: 4,
    title: "Banking as a Service (BaaS)",
    description:
      "A revolução da infraestrutura bancária modular e o futuro das Fintechs no Brasil.",
    icon: "hub",
  },
  {
    id: 5,
    title: "Tokenização de Ativos",
    description:
      "Transformando ativos reais em digitais através de blockchain e contratos inteligentes.",
    icon: "currency_bitcoin",
  },
  {
    id: 6,
    title: "Regulação Bancária",
    description:
      "O arcabouço normativo do Bacen e CVM para o novo ecossistema financeiro digital.",
    icon: "gavel",
  },
];
