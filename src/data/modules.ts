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
    id: 7,
    title: "FIDC",
    description:
      "Cinco casos aplicados de securitização: subordinação, concentração cedente × sacado e descasamento de indexador.",
    icon: "account_tree",
  },
  {
    id: 9,
    title: "BaaS e Tokenização",
    description:
      "Revenue sharing de BaaS, ganhos de embedded finance, custo de funding tokenizado e liquidação atômica (DvP, T+0).",
    icon: "lan",
  },
  {
    id: 8,
    title: "Regulação Bancária",
    description:
      "Índice de Basileia, RWA e FPR: como crescimento, perdas, estratégia de risco e migração de rating movem o capital.",
    icon: "account_balance",
  },
  {
    id: 10,
    title: "Gestão de Crédito",
    description:
      "Perda esperada, apetite de risco por cenário, recessão na carteira e concentração — gestão de crédito do empréstimo ao portfólio.",
    icon: "credit_score",
  },
];
