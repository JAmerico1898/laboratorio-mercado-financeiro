// Conteúdo tipado dos 4 cenários do Módulo 8 — Regulação Bancária · Cenários.
// Fonte única; nenhum texto fica hard-coded nos componentes (spec §3).
import type { Scenario } from "./types";
import { CAPITAL_RULE } from "./types";

/* ============================ S6.1 — Banco Crescente ============================ */
const s6_1: Scenario = {
  id: "s6-1",
  code: "S6.1",
  order: 1,
  title: "Crescimento orgânico corrói o colchão de capital",
  bank: "Banco Crescente S.A.",
  difficulty: "intermediario",
  estMinutes: 20,
  blurb:
    "O Banco Crescente expande a carteira de crédito a 25% ao ano. Apesar de lucrativo, o CFO teme que o ritmo " +
    "esteja consumindo o Índice de Basileia. Meça o IB atual, entenda o que o derruba e projete onde ele termina o ano.",
  archetype: "Crescimento orgânico — o RWA cresce mais que o capital",
  context:
    "Você assumiu a <strong>tesouraria do Banco Crescente S.A.</strong>, um banco médio que cresce a carteira de " +
    "crédito a <strong>~25% ao ano</strong>. O banco é lucrativo (lucro líquido de <strong>R$ 150 milhões</strong>) " +
    "e distribui <strong>40% em dividendos</strong>. Ainda assim, o CFO está inquieto: o <em>colchão de capital</em> " +
    "vem encolhendo. Você recebe o BP e a DRE e precisa diagnosticar se o plano de crescimento mantém o banco acima " +
    "do requisito de capital — e, se não, o que fazer.",
  keyFacts: [
    { label: "Patrimônio de Referência (PR)", value: "R$ 1.200 M" },
    { label: "RWA atual", value: "R$ 10.000 M" },
    { label: "Crescimento do RWA (plano)", value: "+25%" },
    { label: "Lucro líquido do ano", value: "R$ 150 M" },
    { label: "Payout de dividendos", value: "40%" },
    { label: "Lucro retido", value: "R$ 90 M", tone: "positive" },
    { label: CAPITAL_RULE.label, value: CAPITAL_RULE.value, tone: "warning" },
  ],
  statements: [
    {
      id: "bp",
      title: "Balanço patrimonial (R$ M)",
      columns: ["Conta", "Valor"],
      rows: [
        { label: "Caixa e equivalentes", values: ["800"] },
        { label: "Títulos e valores mobiliários", values: ["3.000"] },
        { label: "Carteira de crédito bruta", values: ["9.500"] },
        { label: "(–) Provisão para perdas (PDD)", values: ["(300)"] },
        { label: "Carteira de crédito líquida", values: ["9.200"] },
        { label: "Imobilizado e outros ativos", values: ["1.000"] },
        { label: "Total do ativo", values: ["14.000"], emphasis: true },
        { label: "Depósitos", values: ["8.000"] },
        { label: "Captações no mercado", values: ["4.000"] },
        { label: "Outros passivos", values: ["800"] },
        { label: "Patrimônio líquido (≈ PR)", values: ["1.200"], emphasis: true },
        { label: "Total do passivo + PL", values: ["14.000"], emphasis: true },
      ],
    },
    {
      id: "dre",
      title: "DRE do exercício (R$ M)",
      columns: ["Conta", "Valor"],
      rows: [
        { label: "Receita de intermediação financeira", values: ["2.000"] },
        { label: "Despesa de captação", values: ["(1.100)"] },
        { label: "Margem financeira", values: ["900"] },
        { label: "Despesa de PDD", values: ["(200)"] },
        { label: "Receita de serviços e tarifas", values: ["300"] },
        { label: "Despesas administrativas", values: ["(800)"] },
        { label: "Resultado antes de impostos", values: ["200"] },
        { label: "IR / CSLL", values: ["(50)"] },
        { label: "Lucro líquido", values: ["150"], emphasis: true },
        { label: "Dividendos (40%)", values: ["(60)"] },
        { label: "Lucro retido", values: ["90"], emphasis: true },
      ],
      note: "RWA total = R$ 10.000 M (dado). No nível intermediário não é necessário decompor por classe de FPR.",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Etapa 1 · Leitura — IB atual",
      points: 20,
      prompt: "Qual é o Índice de Basileia atual do Banco Crescente?",
      options: [
        {
          id: "a",
          text: "12,0%",
          correct: true,
          feedback:
            "IB = PR / RWA = 1.200 / 10.000 = <strong>12,0%</strong>. Acima do requisito de 10,5% → o banco parte " +
            "saudável, com colchão de 1,5 p.p.",
        },
        {
          id: "b",
          text: "8,0%",
          correct: false,
          feedback:
            "Erro: usou o caixa (800) no numerador. O capital regulatório é o PR (≈ PL = 1.200), não o caixa. " +
            "IB = 1.200/10.000 = 12,0%.",
        },
        {
          id: "c",
          text: "10,5%",
          correct: false,
          feedback:
            "Erro: 10,5% é o <em>requisito</em>, não o índice do banco. Calcule PR/RWA = 1.200/10.000 = 12,0%.",
        },
        {
          id: "d",
          text: "15,0%",
          correct: false,
          feedback:
            "Erro: o denominador é o RWA (10.000), não os TVM (3.000) nem a carteira. IB = 1.200/10.000 = 12,0%.",
        },
      ],
    },
    {
      id: "e2",
      label: "Etapa 2 · Mecanismo — o que derruba o IB",
      points: 20,
      prompt:
        "Executando o plano de crescer +25% o RWA financiado só com lucro retido, o que acontece com o IB?",
      options: [
        {
          id: "a",
          text:
            "O RWA cresce 25% enquanto o capital cresce só 7,5% — o IB cai porque o denominador cresce mais que o numerador.",
          correct: true,
          feedback:
            "ΔRWA = +25%. Capital gerado internamente = lucro retido / PR = 90/1.200 = <strong>7,5%</strong>. " +
            "Como 25% > 7,5%, o numerador não acompanha o denominador → IB cai.",
        },
        {
          id: "b",
          text: "O IB sobe: mais carteira gera mais lucro e mais capital.",
          correct: false,
          feedback:
            "Erro: o lucro retido (90) é muito menor que o aumento do RWA (+2.500). O capital não acompanha; o IB cai.",
        },
        {
          id: "c",
          text: "O IB fica estável: o lucro retido cobre o crescimento.",
          correct: false,
          feedback: "Erro: 90 de capital novo contra 2.500 de RWA novo — não cobre. O IB cai.",
        },
        {
          id: "d",
          text: "Depende só do payout; com 40% de retenção o índice se mantém.",
          correct: false,
          feedback:
            "Erro: o payout é 40%, logo retém-se 60% (R$ 90). Mesmo assim 90 ≪ 2.500 de RWA novo; o payout não muda " +
            "a aritmética a favor.",
        },
      ],
    },
    {
      id: "e3",
      label: "Etapa 3 · Síntese — IB projetado",
      points: 20,
      prompt: "Qual o IB projetado ao fim do ano se o plano de crescimento for executado como está?",
      options: [
        {
          id: "a",
          text: "10,3% — abaixo de 10,5% (descumprimento).",
          correct: true,
          feedback:
            "PR projetado = 1.200 + 90 = <strong>1.290</strong>. RWA projetado = 10.000 × 1,25 = <strong>12.500</strong>. " +
            "IB = 1.290/12.500 = <strong>10,3%</strong> → abaixo do requisito de 10,5%: o banco entra em descumprimento.",
        },
        {
          id: "b",
          text: "12,0% — inalterado.",
          correct: false,
          feedback: "Erro: não atualizou o RWA. Com RWA 12.500 e PR 1.290, o IB cai para 10,3%.",
        },
        {
          id: "c",
          text: "9,3%",
          correct: false,
          feedback:
            "Erro: cresceu o RWA mas esqueceu o lucro retido no PR. PR = 1.290 (não 1.200). IB = 1.290/12.500 = 10,3%.",
        },
        {
          id: "d",
          text: "10,1%",
          correct: false,
          feedback:
            "Erro: reteve 40% do lucro (R$ 60) em vez de 60%. Payout de 40% ⇒ retenção de 60% (R$ 90). PR = 1.290; " +
            "IB = 10,3%.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt:
      "O conselho precisa definir a estratégia diante da projeção de descumprimento. Qual caminho seguir?",
    branches: [
      {
        id: "A",
        title: "Manter o ritmo de +25% ao ano",
        summary: "Maximizar crescimento e aceitar o descumprimento do índice.",
        resultado: {
          headline: "Crescimento máximo, capital furado",
          caption: "O IB despenca a cada ciclo de crescimento.",
          metrics: [
            { label: "IB ano 1", value: "10,3%", tone: "risk" },
            { label: "IB ano 2", value: "~9,0%", tone: "risk" },
            { label: "IB ano 3", value: "~7,9%", tone: "risk" },
            { label: "Carteira (3 anos)", value: "+95%", tone: "positive" },
            { label: "Descumprimento", value: "Recorrente", tone: "risk" },
          ],
          explanation:
            "Maximiza o crescimento de curto prazo, mas o IB despenca a cada ciclo — <em>descumprimento estrutural</em>, " +
            "plano de regularização e provável restrição a dividendos.",
        },
      },
      {
        id: "B",
        title: "Calibrar o crescimento à geração de capital",
        summary:
          "Crescer o RWA no ritmo da geração interna de capital, mantendo o IB nos atuais 12%.",
        resultado: {
          headline: "Equilíbrio: crescer no ritmo do capital",
          caption: "g* = lucro retido / PR = 90 / 1.200 = 7,5% → IB = 1.290 / 10.750 = 12,0%.",
          metrics: [
            { label: "IB projetado", value: "12,0% (mantido)", tone: "positive" },
            { label: "Crescimento sustentável", value: "+7,5% a.a.", tone: "neutral" },
            { label: "Condição de equilíbrio", value: "g = ROE 12,5% × retenção 60%", tone: "neutral" },
            { label: "Market share", value: "Cede vs. +25%", tone: "negative" },
          ],
          explanation:
            "O crescimento que mantém o IB constante iguala a geração interna de capital: <strong>g* = ROE × " +
            "retenção = 12,5% × 60% = 7,5%</strong> (ROE = 150/1.200; retenção = 90/150). A esse ritmo, RWA = " +
            "10.000 × 1,075 = 10.750 e PR = 1.200 + 90 = 1.290 → IB = 1.290/10.750 = <strong>12,0%</strong>, " +
            "exatamente o nível de partida. Crescer acima disso corrói o índice; abaixo, acumula colchão. O custo " +
            "é ceder participação de mercado frente aos +25%.",
        },
      },
      {
        id: "C",
        title: "Captar capital para sustentar +25%/ano",
        summary: "Sustentar o crescimento com aportes recorrentes de capital.",
        resultado: {
          headline: "Crescimento sustentado, acionista diluído",
          caption: "O índice se mantém à custa de captações sucessivas.",
          metrics: [
            { label: "IB mantido", value: "~10,5–11%", tone: "positive" },
            { label: "Capital novo", value: "~R$ 200–300 M/ano", tone: "negative" },
            { label: "Diluição", value: "Recorrente", tone: "risk" },
          ],
          explanation:
            "Sustenta crescimento e IB, mas exige captações sucessivas (diluição/custo de capital a cada rodada).",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Mesmo que o banco capte capital agora (caminho C), qual risco residual permanece?",
    options: [
      {
        id: "a",
        text:
          "Enquanto a geração interna de capital (7,5%) ficar abaixo do crescimento do RWA (25%), o banco precisará " +
          "captar repetidamente — é estrutural, não pontual.",
        correct: true,
        feedback:
          "O crescimento sustentável de ativos sem perder capital ≈ ROE × retenção. Enquanto o crescimento do RWA " +
          "superar a geração de capital, o IB tende a cair a cada ciclo — a captação resolve um ano, não o descasamento.",
      },
      {
        id: "b",
        text: "Nenhum: uma vez capitalizado, o IB fica permanentemente resolvido.",
        correct: false,
        feedback:
          "Erro: a captação cobre um exercício; o descasamento entre crescimento e geração de capital recorre.",
      },
      {
        id: "c",
        text: "O único risco é o custo da dívida subir.",
        correct: false,
        feedback: "Erro: o risco central é de capital regulatório, não de custo de funding isolado.",
      },
      {
        id: "d",
        text: "O risco é o payout cair.",
        correct: false,
        feedback:
          "Erro: reduzir payout ajuda, mas mesmo com retenção total (150) < 2.500 de RWA novo — não resolve o descasamento.",
      },
    ],
  },
  maxScore: 85,
};

/* ============================ S6.2 — Banco Atlântico ============================ */
const s6_2: Scenario = {
  id: "s6-2",
  code: "S6.2",
  order: 2,
  title: "Perda na carteira: desalavancar ou capitalizar",
  bank: "Banco Atlântico S.A.",
  difficulty: "intermediario",
  estMinutes: 22,
  blurb:
    "Uma exposição setorial concentrada se deteriora e o Banco Atlântico reconhece R$ 600 M de provisão adicional. " +
    "O IB fura o requisito. Veja onde a perda bate e dimensione cada alavanca de recomposição.",
  archetype: "Perda na carteira — o capital absorve o choque",
  context:
    "O <strong>Banco Atlântico S.A.</strong> tinha exposição concentrada em um setor que entrou em crise. Auditoria " +
    "e área de risco determinam o reconhecimento de <strong>R$ 600 milhões de PDD adicional</strong> no resultado. " +
    "A provisão <em>abate o saldo líquido</em> da exposição: reduz o <strong>capital (PR)</strong> via resultado e o " +
    "<strong>RWA</strong> nos mesmos R$ 600 M — mas, como a base do PR é muito menor, o impacto relativo no índice " +
    "é muito maior pelo numerador. As exposições foram provisionadas, mas <strong>não baixadas</strong> (sem " +
    "write-off). O banco partia confortável (IB de 12,0%). Sua tarefa: medir o IB após o choque, identificar o " +
    "componente atingido e dimensionar quanto seria preciso em cada alavanca isolada para voltar a 10,5%.",
  keyFacts: [
    { label: "PR (capital) inicial", value: "R$ 2.400 M" },
    { label: "RWA inicial", value: "R$ 20.000 M" },
    { label: "PDD adicional (no resultado)", value: "R$ 600 M", tone: "warning" },
    { label: "Efeito da provisão", value: "Reduz PR e RWA em R$ 600 M" },
    { label: CAPITAL_RULE.label, value: CAPITAL_RULE.value, tone: "warning" },
  ],
  statements: [
    {
      id: "bp",
      title: "Balanço patrimonial (R$ M) — pós-choque",
      columns: ["Conta", "Pós-choque"],
      rows: [
        { label: "Caixa e equivalentes", values: ["3.000"] },
        { label: "Títulos e valores mobiliários", values: ["5.000"] },
        { label: "Carteira de crédito bruta", values: ["19.000"] },
        { label: "(–) PDD total", values: ["(1.200)"] },
        { label: "Carteira líquida", values: ["17.800"] },
        { label: "Outros ativos", values: ["1.800"] },
        { label: "Total do ativo", values: ["27.600"], emphasis: true },
        { label: "Depósitos", values: ["16.000"] },
        { label: "Captações no mercado", values: ["8.000"] },
        { label: "Outros passivos", values: ["1.800"] },
        { label: "Patrimônio líquido (≈ PR pós-perda)", values: ["1.800"], emphasis: true },
        { label: "Total do passivo + PL", values: ["27.600"], emphasis: true },
      ],
    },
    {
      id: "dre",
      title: "DRE — efeito do choque (R$ M)",
      columns: ["Conta", "Valor"],
      rows: [
        { label: "Margem financeira", values: ["1.500"] },
        { label: "Despesa de PDD (recorrente)", values: ["(400)"] },
        { label: "Despesa de PDD adicional (choque)", values: ["(600)"], emphasis: true },
        { label: "Receita de serviços", values: ["500"] },
        { label: "Despesas administrativas", values: ["(900)"] },
        { label: "Resultado do período", values: ["100"] },
      ],
      note: "A provisão abate o saldo líquido da exposição: RWA pós-choque = 20.000 − 600 = 19.400. PR pós-choque = 2.400 − 600 = 1.800.",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Etapa 1 · Leitura — IB pós-perda",
      points: 20,
      prompt: "Após reconhecer R$ 600 M de PDD adicional, qual o IB do Banco Atlântico?",
      options: [
        {
          id: "a",
          text: "9,3%",
          correct: true,
          feedback:
            "A provisão abate o saldo líquido da exposição: reduz o capital e o RWA nos mesmos R$ 600 M. " +
            "PR = 2.400 − 600 = <strong>1.800</strong>; RWA = 20.000 − 600 = <strong>19.400</strong>. " +
            "IB = (2.400 − 600)/(20.000 − 600) = 1.800/19.400 = <strong>9,3%</strong> → abaixo de 10,5%. " +
            "O impacto é maior no PR porque sua base é muito menor: o numerador cai 25% e o denominador só 3%.",
        },
        {
          id: "b",
          text: "9,0%",
          correct: false,
          feedback:
            "Quase: deduziu os 600 do capital, mas manteve o RWA em 20.000. A provisão também abate o saldo " +
            "líquido da exposição → RWA = 19.400. IB = 1.800/19.400 = 9,3%.",
        },
        {
          id: "c",
          text: "12,0%",
          correct: false,
          feedback:
            "Erro: não deduziu a perda. A PDD reduz o capital (e o RWA); o IB cai para 9,3%.",
        },
        {
          id: "d",
          text: "10,5%",
          correct: false,
          feedback:
            "Erro: 10,5% é o requisito, não o índice do banco. O cálculo dá 1.800/19.400 = 9,3%, abaixo do piso.",
        },
      ],
    },
    {
      id: "e2",
      label: "Etapa 2 · Mecanismo — componente atingido",
      points: 20,
      prompt: "A perda de crédito derruba o IB atingindo qual componente?",
      options: [
        {
          id: "a",
          text:
            "Ambos: a provisão reduz o PR (numerador) e o RWA (denominador) em R$ 600 M cada — mas o impacto relativo é muito maior no PR, porque sua base é menor.",
          correct: true,
          feedback:
            "PDD é despesa → reduz o lucro → reduz o PR em 600 (de 2.400 para 1.800, −25%). E abate o saldo líquido " +
            "da exposição → reduz o RWA em 600 (de 20.000 para 19.400, −3%). Numerador cai 25%, denominador só 3% → " +
            "o IB despenca de 12,0% para 9,3%.",
        },
        {
          id: "b",
          text:
            "Só o numerador (capital/PR); o RWA fica estável porque as exposições foram provisionadas, não baixadas.",
          correct: false,
          feedback:
            "Erro: a provisão também abate o saldo líquido da exposição → o RWA cai 600 (para 19.400). O ponto é a " +
            "assimetria: o capital cai muito mais em termos relativos (−25% vs. −3%).",
        },
        {
          id: "c",
          text: "Só o denominador (RWA), porque a carteira líquida encolhe.",
          correct: false,
          feedback:
            "Erro: o capital também cai — a PDD é despesa que reduz o lucro/PR, e é nele que o impacto relativo é maior.",
        },
        {
          id: "d",
          text: "Nenhum: PDD é conta de resultado e não afeta capital nem RWA.",
          correct: false,
          feedback:
            "Erro: a PDD reduz o lucro → reduz o capital; e abate o saldo líquido → reduz o RWA. Atinge os dois.",
        },
      ],
    },
    {
      id: "e3",
      label: "Etapa 3 · Síntese — alavancas de recomposição",
      points: 20,
      prompt: "Para voltar a cumprir 10,5%, quanto o banco precisa em CADA alavanca isolada?",
      options: [
        {
          id: "a",
          text: "Capital: injetar ≈ R$ 237 M; OU desalavancar: reduzir o RWA em ≈ R$ 2.257 M.",
          correct: true,
          feedback:
            "Já reconhecida a PDD (PR 1.800; RWA 19.400). Capital → PR ≥ 0,105 × 19.400 = 2.037; déficit = 2.037 − " +
            "1.800 = <strong>R$ 237 M</strong>. Desalavancagem → RWA ≤ 1.800/0,105 = 17.143; corte = 19.400 − 17.143 " +
            "≈ <strong>R$ 2.257 M</strong>.",
        },
        {
          id: "b",
          text: "Capital: R$ 600 M; desalavancar: R$ 600 M.",
          correct: false,
          feedback:
            "Erro: R$ 600 era a perda já reconhecida. O déficit que resta para 10,5% é ≈ R$ 237 M (capital) ou " +
            "≈ R$ 2.257 M (RWA).",
        },
        {
          id: "c",
          text: "Capital: R$ 237 M; desalavancar: R$ 237 M.",
          correct: false,
          feedback:
            "Erro: o corte de RWA não é igual ao aporte. RWA ≤ 1.800/0,105 = 17.143 → corte ≈ R$ 2.257 M.",
        },
        {
          id: "d",
          text: "Capital: R$ 300 M; desalavancar: ≈ R$ 2.857 M.",
          correct: false,
          feedback:
            "Erro: esses valores ignoram que a provisão já reduziu o RWA para 19.400. Com o RWA correto: déficit " +
            "≈ R$ 237 M (capital) e corte ≈ R$ 2.257 M (RWA).",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Como recompor o IB?",
    branches: [
      {
        id: "A",
        title: "Capitalizar (chamada de capital / oferta)",
        summary: "Injetar capital novo para restaurar o índice sem encolher o banco.",
        resultado: {
          headline: "Capital novo restaura o índice",
          caption: "Restaura o IB sem encolher o balanço.",
          metrics: [
            { label: "IB", value: "9,3% → 10,5%", tone: "positive" },
            { label: "Capital novo", value: "≈ R$ 237 M", tone: "neutral" },
            { label: "Balanço", value: "Preservado", tone: "positive" },
            { label: "Acionista", value: "Diluição", tone: "negative" },
          ],
          explanation:
            "Restaura o IB sem encolher o banco, mas dilui acionistas em um momento ruim e depende de demanda por capital.",
        },
      },
      {
        id: "B",
        title: "Desalavancar (vender ativos de risco)",
        summary: "Cortar o RWA vendendo exposições, sem capital novo.",
        resultado: {
          headline: "Encolher o RWA, sem capital novo",
          caption: "Reduz o RWA rápido, mas vende barato.",
          metrics: [
            { label: "IB", value: "→ 10,5%", tone: "positive" },
            { label: "Carteira", value: "−R$ 2.257 M", tone: "negative" },
            { label: "Receita futura", value: "↓", tone: "negative" },
            { label: "Fire sale", value: "Realiza perda", tone: "risk" },
          ],
          explanation:
            "Reduz o RWA rápido e sem capital novo, mas vende barato e encolhe a geração de receita.",
        },
      },
      {
        id: "C",
        title: "Híbrido (capital parcial + corte de RWA de pior RAROC)",
        summary: "Combinar aporte parcial e corte seletivo de RWA.",
        resultado: {
          headline: "Diluição menor, carteira otimizada",
          caption: "Ex.: R$ 120 M de capital → PR 1.920; RWA ≤ 1.920/0,105 = 18.286 → cortar ≈ R$ 1.114 M.",
          metrics: [
            { label: "IB", value: "→ 10,5%", tone: "positive" },
            { label: "Diluição", value: "Menor", tone: "neutral" },
            { label: "Carteira", value: "Otimizada", tone: "positive" },
            { label: "Execução", value: "Complexa", tone: "risk" },
          ],
          explanation:
            "Equilibra diluição e encolhimento, mas exige seletividade e é mais lento.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual risco residual as alavancas de recomposição NÃO resolvem?",
    options: [
      {
        id: "a",
        text:
          "Se a causa (concentração setorial) persistir, recompor capital não evita um 2º choque; e desalavancar " +
          "vendendo os ativos líquidos de baixo risco piora a densidade de RWA do que sobra.",
        correct: true,
        feedback:
          "A recomposição corrige o índice, não a origem da perda. Vender o que é líquido e de baixo risco deixa a " +
          "carteira mais arriscada na média (densidade de RWA maior).",
      },
      {
        id: "b",
        text: "Nenhum: recompor o IB encerra o problema.",
        correct: false,
        feedback: "Erro: a fonte da perda (concentração) segue ativa.",
      },
      {
        id: "c",
        text: "O risco é só de liquidez.",
        correct: false,
        feedback: "Erro: o risco central é a recorrência da perda de crédito por concentração.",
      },
      {
        id: "d",
        text: "Desalavancar sempre melhora a qualidade da carteira.",
        correct: false,
        feedback:
          "Erro: se vender o que é líquido e de baixo risco, sobra o pior — a densidade de RWA piora.",
      },
    ],
  },
  maxScore: 85,
};

/* ============================ S6.3 — Banco Meridiano ============================ */
const s6_3: Scenario = {
  id: "s6-3",
  code: "S6.3",
  order: 3,
  title: "Estratégia de risco dos ativos e RAROC",
  bank: "Banco Meridiano S.A.",
  difficulty: "avancado",
  estMinutes: 25,
  blurb:
    "Com R$ 1.000 M de capital, o Banco Meridiano escolhe como alocar R$ 10.000 M entre duas estratégias — uma " +
    "conservadora, outra agressiva. Mais risco rende mais? Compute o RWA por classe de FPR e compare o retorno sobre o capital.",
  archetype: "Estratégia de risco — o FPR escolhido define o RWA",
  context:
    "O <strong>Banco Meridiano S.A.</strong> tem <strong>R$ 1.000 milhões de capital (PR)</strong> e precisa decidir " +
    "como alocar <strong>R$ 10.000 milhões</strong> de exposição. A diretoria avalia duas carteiras: a " +
    "<em>conservadora</em> (Estratégia A), com mais títulos públicos e imobiliário, e a <em>agressiva</em> " +
    "(Estratégia B), pesada em corporativo e exposições de maior risco. Cada classe de ativo tem um <em>fator de " +
    "ponderação de risco (FPR)</em> próprio. Sua tarefa: computar o RWA de cada estratégia e decidir qual entrega " +
    "melhor retorno sobre o capital regulatório.",
  keyFacts: [
    { label: "Capital disponível (PR)", value: "R$ 1.000 M" },
    { label: "Exposição a alocar", value: "R$ 10.000 M" },
    { label: "Margem líquida — Estratégia A", value: "R$ 200 M" },
    { label: "Margem líquida — Estratégia B", value: "R$ 350 M" },
    { label: CAPITAL_RULE.label, value: CAPITAL_RULE.value, tone: "warning" },
  ],
  statements: [
    {
      id: "fpr",
      title: "Tabela de FPR por classe de ativo",
      columns: ["Classe de ativo", "FPR (ilustrativo · verificar)"],
      rows: [
        { label: "Títulos públicos federais (TPF)", values: ["0%"] },
        { label: "Crédito imobiliário residencial", values: ["50%"] },
        { label: "Crédito varejo / PME", values: ["75%"] },
        { label: "Crédito corporativo", values: ["100%"] },
        { label: "Exposições de maior risco (subordinado / inadimplente)", values: ["150%"] },
      ],
    },
    {
      id: "composicao",
      title: "Composição (R$ M)",
      columns: ["Composição (R$ M)", "Estratégia A (conservadora)", "Estratégia B (agressiva)"],
      rows: [
        { label: "TPF (0%)", values: ["4.000", "2.000"] },
        { label: "Imobiliário residencial (50%)", values: ["2.000", "—"] },
        { label: "Corporativo (100%)", values: ["4.000", "6.000"] },
        { label: "Maior risco (150%)", values: ["—", "2.000"] },
        { label: "Exposição total", values: ["10.000", "10.000"], emphasis: true },
        { label: "RWA", values: ["5.000", "9.000"], emphasis: true },
        { label: "Margem líquida", values: ["200", "350"] },
      ],
      note:
        "RWA = Σ exposição × FPR. A: 4.000×0% + 2.000×50% + 4.000×100% = 5.000. " +
        "B: 2.000×0% + 6.000×100% + 2.000×150% = 9.000.",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Etapa 1 · Leitura — RWA da Estratégia A",
      points: 20,
      prompt: "Usando a tabela de FPR, qual o RWA da Estratégia A?",
      options: [
        {
          id: "a",
          text: "R$ 5.000 M",
          correct: true,
          feedback:
            "RWA = Σ exposição × FPR = 4.000×0% + 2.000×50% + 4.000×100% = 0 + 1.000 + 4.000 = <strong>5.000</strong>.",
        },
        {
          id: "b",
          text: "R$ 10.000 M",
          correct: false,
          feedback:
            "Erro: somou a exposição sem ponderar. O TPF entra com 0% e o imobiliário com 50%. RWA = 5.000.",
        },
        {
          id: "c",
          text: "R$ 4.000 M",
          correct: false,
          feedback: "Erro: esqueceu o imobiliário (2.000×50% = 1.000). RWA = 5.000.",
        },
        {
          id: "d",
          text: "R$ 6.000 M",
          correct: false,
          feedback: "Erro: usou 100% no imobiliário. O FPR residencial é 50% (2.000×50% = 1.000). RWA = 5.000.",
        },
      ],
    },
    {
      id: "e2",
      label: "Etapa 2 · Mecanismo — por que B consome mais capital",
      points: 20,
      prompt:
        "Por que a Estratégia B consome mais capital que a A, com a mesma exposição nominal de R$ 10.000 M?",
      options: [
        {
          id: "a",
          text: "B aloca em classes de FPR maior → RWA maior → capital exigido (10,5% × RWA) maior.",
          correct: true,
          feedback:
            "Capital exigido = 10,5% × RWA. RWA_B (9.000) > RWA_A (5.000) → exigência B = 945 > A = 525, mesmo " +
            "com exposição bruta igual.",
        },
        {
          id: "b",
          text: "Porque B tem mais ativos, não mais risco.",
          correct: false,
          feedback:
            "Erro: a exposição bruta é igual (10.000). O que difere é o FPR (risco), que eleva o RWA.",
        },
        {
          id: "c",
          text: "Porque o capital exigido depende da exposição bruta, não do RWA.",
          correct: false,
          feedback: "Erro: o requisito incide sobre o RWA (ponderado), não sobre a exposição bruta.",
        },
        {
          id: "d",
          text: "B não consome mais capital; consome igual.",
          correct: false,
          feedback: "Erro: RWA_B 9.000 vs RWA_A 5.000 → exigências diferentes (945 vs 525).",
        },
      ],
    },
    {
      id: "e3",
      label: "Etapa 3 · Síntese — RAROC",
      points: 20,
      prompt: "Qual estratégia tem melhor retorno sobre o capital regulatório?",
      options: [
        {
          id: "a",
          text: "A: 38,1% vs B: 37,0% — a conservadora rende (um pouco) mais por unidade de capital.",
          correct: true,
          feedback:
            "RAROC = margem / (10,5% × RWA). A = 200/525 = <strong>38,1%</strong>; B = 350/945 = <strong>37,0%</strong>. " +
            "A margem nominal de B é maior (350), mas consome tanto capital que o retorno ajustado fica abaixo.",
        },
        {
          id: "b",
          text: "B, porque tem maior margem (350 > 200).",
          correct: false,
          feedback:
            "Erro: margem nominal ≠ retorno sobre capital. B consome 945 de capital vs 525 de A.",
        },
        {
          id: "c",
          text: "Empatam.",
          correct: false,
          feedback: "Erro: 38,1% ≠ 37,0%; A leva por ~1,1 p.p.",
        },
        {
          id: "d",
          text: "A, com 4,0%.",
          correct: false,
          feedback:
            "Erro: usou a exposição (5.000) no denominador. O denominador é o capital exigido (10,5%×RWA = 525). " +
            "RAROC_A = 38,1%.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Que estratégia de balanço adotar?",
    branches: [
      {
        id: "A",
        title: "Carteira conservadora",
        summary: "Priorizar segurança e colchão de capital.",
        resultado: {
          headline: "Muito colchão, capital subutilizado",
          caption: "Segurança alta, mas custo de oportunidade elevado.",
          metrics: [
            { label: "IB", value: "20,0%", tone: "positive" },
            { label: "Margem", value: "R$ 200 M", tone: "neutral" },
            { label: "Capital ocioso", value: "ROE baixo", tone: "risk" },
          ],
          explanation:
            "Muito colchão e segurança, mas subutiliza o capital — custo de oportunidade alto.",
        },
      },
      {
        id: "B",
        title: "Carteira agressiva",
        summary: "Maximizar margem nominal aceitando menos buffer.",
        resultado: {
          headline: "Mais margem, pouco buffer",
          caption: "Maior margem nominal, mas retorno sobre capital pior.",
          metrics: [
            { label: "IB", value: "11,1% (apertado)", tone: "neutral" },
            { label: "Margem", value: "R$ 350 M", tone: "positive" },
            { label: "Buffer p/ choques", value: "Pouco", tone: "risk" },
            { label: "RAROC", value: "37,0%", tone: "negative" },
          ],
          explanation:
            "Maior margem nominal, mas pouco buffer e retorno sobre capital pior que a conservadora.",
        },
      },
      {
        id: "C",
        title: "Otimização por RAROC",
        summary: "Selecionar, dentro de cada classe, os ativos de melhor retorno/RWA.",
        resultado: {
          headline: "Melhor uso do capital",
          caption: "Sem rótulo conservador/agressivo: escolher pelo retorno ajustado ao risco.",
          metrics: [
            { label: "RAROC", value: "↑", tone: "positive" },
            { label: "IB", value: "Equilibrado", tone: "positive" },
            { label: "Requisito", value: "Modelo e disciplina", tone: "risk" },
          ],
          explanation:
            "Melhor uso do capital, porém depende de capacidade de precificar risco e governança.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual risco residual a otimização por RAROC NÃO elimina?",
    options: [
      {
        id: "a",
        text:
          "O FPR padronizado não captura o risco econômico real (concentração, correlações); um portfólio “ótimo” " +
          "pelo RAROC regulatório ainda pode ser arriscado de fato.",
        correct: true,
        feedback:
          "O FPR é uma proxy regulatória, não a perda esperada/inesperada real. Otimizar contra a proxy não elimina " +
          "o risco que ela subestima.",
      },
      {
        id: "b",
        text: "Nenhum: maximizar RAROC elimina o risco.",
        correct: false,
        feedback: "Erro: o RAROC usa FPR padronizado, proxy imperfeita do risco.",
      },
      {
        id: "c",
        text: "Só falta considerar liquidez.",
        correct: false,
        feedback: "Erro: liquidez importa, mas o ponto central é o descolamento entre FPR e risco real.",
      },
      {
        id: "d",
        text: "O risco é o IB ficar alto demais.",
        correct: false,
        feedback: "Erro: IB alto não é risco; o risco é o FPR subestimar perdas.",
      },
    ],
  },
  maxScore: 85,
};

/* ============================ S6.4 — Banco Horizonte ============================ */
const s6_4: Scenario = {
  id: "s6-4",
  code: "S6.4",
  order: 4,
  title: "Migração de rating: o RWA que cresce sozinho",
  bank: "Banco Horizonte S.A.",
  difficulty: "avancado",
  estMinutes: 25,
  blurb:
    "Uma recessão rebaixa os tomadores do Banco Horizonte. Sem originar crédito novo e sem baixar nada, o IB despenca. " +
    "Compute o RWA por bucket de rating antes e depois e explique por que o índice piora “sozinho”.",
  archetype: "Migração de rating — o RWA sobe na carteira existente",
  context:
    "O <strong>Banco Horizonte S.A.</strong> partia confortável (IB de 13,0%). Uma recessão deteriora a qualidade " +
    "dos tomadores da carteira <em>já existente</em>: parte das exposições sofre <em>downgrade</em> e migra para " +
    "<em>buckets</em> de rating de FPR mais alto. O banco <strong>não originou crédito novo</strong> e <strong>ainda " +
    "não provisionou nada</strong> (não reconheceu a perda de crédito), apenas redefiniu os fatores de ponderação de " +
    "risco. Sua tarefa: computar o RWA por bucket antes e depois da migração, e mostrar por que o IB cai mesmo com " +
    "capital e exposição total inalterados.",
  keyFacts: [
    { label: "PR (capital)", value: "R$ 1.300 M" },
    { label: "Exposição da carteira corporativa", value: "R$ 10.000 M" },
    { label: "Demais RWA (fora a carteira)", value: "R$ 2.000 M" },
    { label: "Origina crédito novo?", value: "Não" },
    { label: "Perda já realizada?", value: "Não (sem write-off)" },
    { label: CAPITAL_RULE.label, value: CAPITAL_RULE.value, tone: "warning" },
  ],
  statements: [
    {
      id: "buckets",
      title: "Buckets de rating × FPR (R$ M)",
      columns: ["Bucket de rating", "FPR", "Exposição ANTES", "Exposição DEPOIS"],
      rows: [
        { label: "AA – A", values: ["50%", "5.000", "1.000"] },
        { label: "BBB – BB", values: ["100%", "4.000", "4.000"] },
        { label: "B e abaixo", values: ["150%", "1.000", "5.000"] },
        { label: "Exposição total da carteira", values: ["", "10.000", "10.000"], emphasis: true },
        { label: "RWA da carteira", values: ["", "8.000", "12.000"], emphasis: true },
        { label: "+ demais RWA", values: ["", "2.000", "2.000"] },
        { label: "RWA total", values: ["", "10.000", "14.000"], emphasis: true },
      ],
      note:
        "A migração move R$ 4.000 M de AA–A (50%) para B e abaixo (150%); a exposição total não muda (sem nova " +
        "originação). RWA carteira antes = 5.000×50% + 4.000×100% + 1.000×150% = 8.000; depois = 1.000×50% + " +
        "4.000×100% + 5.000×150% = 12.000.",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Etapa 1 · Leitura — IB antes da recessão",
      points: 20,
      prompt: "Qual o IB do Banco Horizonte ANTES da recessão?",
      options: [
        {
          id: "a",
          text: "13,0%",
          correct: true,
          feedback:
            "RWA carteira = 5.000×50% + 4.000×100% + 1.000×150% = 2.500 + 4.000 + 1.500 = 8.000; RWA total = 8.000 + " +
            "2.000 = <strong>10.000</strong>; IB = 1.300/10.000 = <strong>13,0%</strong>.",
        },
        {
          id: "b",
          text: "10,8%",
          correct: false,
          feedback:
            "Erro: usou FPR 100% para todos os buckets. Cada bucket tem o seu (50/100/150%). RWA carteira = 8.000; IB = 13,0%.",
        },
        {
          id: "c",
          text: "16,3%",
          correct: false,
          feedback: "Erro: esqueceu os demais R$ 2.000 M de RWA. RWA total = 10.000; IB = 13,0%.",
        },
        {
          id: "d",
          text: "7,6%",
          correct: false,
          feedback:
            "Erro: aplicou 150% à carteira inteira. Só o bucket B– tem 150%. RWA carteira = 8.000; IB = 13,0%.",
        },
      ],
    },
    {
      id: "e2",
      label: "Etapa 2 · Mecanismo — por que o IB piora “sozinho”",
      points: 20,
      prompt: "O banco não originou crédito nem provisionou nada. Por que mesmo assim o IB piora?",
      options: [
        {
          id: "a",
          text:
            "Os tomadores sofrem downgrade → exposições migram para buckets de FPR maior → o RWA sobe sem mudar " +
            "capital nem exposição total.",
          correct: true,
          feedback:
            "RWA = Σ exposição × FPR. A exposição total (10.000) é a mesma, mas o mix migra para FPR maior (mais 150%, " +
            "menos 50%) → RWA ↑ → IB ↓. Capital (1.300) inalterado.",
        },
        {
          id: "b",
          text: "Porque o capital cai com a recessão.",
          correct: false,
          feedback:
            "Erro: ainda não há perda realizada; o PR segue 1.300. O que muda é o RWA (denominador).",
        },
        {
          id: "c",
          text: "Porque a carteira encolhe.",
          correct: false,
          feedback:
            "Erro: a exposição total é a mesma (10.000); muda a ponderação de risco, não o tamanho.",
        },
        {
          id: "d",
          text: "Porque o requisito de 10,5% sobe na recessão.",
          correct: false,
          feedback:
            "Erro: no arcabouço simplificado o requisito é fixo em 10,5%; o que muda é o RWA do banco.",
        },
      ],
    },
    {
      id: "e3",
      label: "Etapa 3 · Síntese — IB após a migração",
      points: 20,
      prompt: "Qual o IB APÓS a migração de rating?",
      options: [
        {
          id: "a",
          text: "9,3% — abaixo de 10,5%.",
          correct: true,
          feedback:
            "RWA carteira pós = 1.000×50% + 4.000×100% + 5.000×150% = 500 + 4.000 + 7.500 = 12.000; RWA total = " +
            "12.000 + 2.000 = <strong>14.000</strong>; IB = 1.300/14.000 = <strong>9,3%</strong>.",
        },
        {
          id: "b",
          text: "13,0% — inalterado.",
          correct: false,
          feedback: "Erro: não atualizou o mix. A migração eleva o RWA para 14.000; IB cai para 9,3%.",
        },
        {
          id: "c",
          text: "10,8%",
          correct: false,
          feedback:
            "Erro: esqueceu o bucket B– a 150% (5.000×150% = 7.500, não 5.000). RWA total 14.000; IB 9,3%.",
        },
        {
          id: "d",
          text: "7,9%",
          correct: false,
          feedback: "Erro: contou exposição em dobro. A exposição total segue 10.000; RWA 14.000; IB 9,3%.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Como reagir à queda do IB causada pela migração?",
    branches: [
      {
        id: "A",
        title: "Reforçar capital",
        summary: "Para IB ≥ 10,5% com RWA 14.000: PR ≥ 0,105×14.000 = 1.470 → injetar R$ 170 M.",
        resultado: {
          headline: "Capital novo no pior momento",
          caption: "Restaura o índice rápido, mas capitaliza em mercado ruim.",
          metrics: [
            { label: "IB", value: "9,3% → 10,5%", tone: "positive" },
            { label: "Acionista", value: "Diluição", tone: "negative" },
            { label: "Timing", value: "Mercado ruim", tone: "risk" },
          ],
          explanation:
            "Restaura o índice rápido, mas levanta capital no pior momento do ciclo.",
        },
      },
      {
        id: "B",
        title: "Reduzir RWA migrando o mix",
        summary: "RWA total ≤ 1.300/0,105 = 12.381 → cortar ≈ R$ 1.619 M de RWA (reduzir o bucket 150%).",
        resultado: {
          headline: "Cortar RWA, vender o que ninguém quer",
          caption: "Dispensa capital novo, mas realiza preços ruins.",
          metrics: [
            { label: "IB", value: "→ 10,5%", tone: "positive" },
            { label: "Receita", value: "↓", tone: "negative" },
            { label: "Preços", value: "Realiza ruins", tone: "risk" },
          ],
          explanation:
            "Dispensa capital novo, mas vende exatamente o que o mercado também quer evitar.",
        },
      },
      {
        id: "C",
        title: "Gerir ativamente o rating",
        summary: "Renegociar / recuperar exposições deterioradas para reverter parte da migração.",
        resultado: {
          headline: "Mais barato, porém lento",
          caption: "Custo baixo, mas depende do ciclo.",
          metrics: [
            { label: "Custo", value: "Baixo", tone: "positive" },
            { label: "Efetividade", value: "Depende do ciclo", tone: "risk" },
            { label: "IB no intervalo", value: "Apertado", tone: "risk" },
          ],
          explanation:
            "Mais barato, mas demora e deixa o banco descumprindo enquanto a recuperação não vem.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual risco residual permanece mesmo após recompor o RWA (caminho B)?",
    options: [
      {
        id: "a",
        text:
          "A migração de FPR é antecipatória: atrás dela vem a perda realizada, que aí sim drena o capital (como no " +
          "caso Atlântico). Recompor RWA não impede a chegada da perda, e nova deterioração gera novas migrações.",
        correct: true,
        feedback:
          "O downgrade sinaliza perda esperada futura; ela ainda não atingiu o capital. Ajustar o RWA melhora o " +
          "índice hoje, mas não impede que a perda, ao se realizar, derrube o PR amanhã.",
      },
      {
        id: "b",
        text: "Nenhum: ajustar o RWA encerra o problema.",
        correct: false,
        feedback: "Erro: a migração sinaliza perdas futuras que ainda não atingiram o capital.",
      },
      {
        id: "c",
        text: "O risco é só de marcação a mercado dos TPF.",
        correct: false,
        feedback: "Erro: o risco central é a perda de crédito iminente sinalizada pelo downgrade.",
      },
      {
        id: "d",
        text: "Recompor RWA também recompõe o capital.",
        correct: false,
        feedback:
          "Erro: reduzir RWA melhora o índice, mas não cria capital; se a perda se realizar, o PR cai.",
      },
    ],
  },
  maxScore: 85,
};

export const scenarios: Scenario[] = [s6_1, s6_2, s6_3, s6_4];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
