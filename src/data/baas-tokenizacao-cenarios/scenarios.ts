// Conteúdo dos 4 cenários do Módulo 9 — BaaS e Tokenização (spec §11–14).
// Fonte única, data-driven. Strings aceitam HTML inline restrito (<strong>, <em>, <br>).
// Acrônimo "RWA" evitado nos cenários de tokenização (spec §9): aqui é sempre
// "ativos do mundo real / recebíveis tokenizados".
import type { Scenario } from "./types";

// ===================================================================
// S7.1 — Banco Trilho · BaaS (lado provedor) · revenue sharing
// ===================================================================
const s7_1: Scenario = {
  id: "s7-1",
  code: "S7.1",
  order: 1,
  title: "BaaS: revenue sharing e o break-even do banco licenciado",
  protagonist: "Banco Trilho S.A.",
  difficulty: "intermediario",
  estMinutes: 20,
  blurb:
    "O Banco Trilho fornece a infraestrutura bancária (licença, conta, cartão, crédito) para a marca VarejoX. Como a economia de cada conta se divide entre os dois — e a partir de quantas contas o banco cobre seus custos?",
  archetype: "BaaS (lado provedor) — revenue sharing e break-even",
  context:
    "O <strong>Banco Trilho S.A.</strong> é um banco licenciado que oferece <em>Banking as a Service</em>: a marca " +
    "<strong>VarejoX</strong> embute conta, cartão e crédito no seu app, mas quem detém a <em>licença, o balanço, o " +
    "capital e o risco de crédito</em> é o Banco Trilho. Em troca, repassa à marca uma fatia da receita " +
    "(<strong>rev-share</strong>). Você é da tesouraria do banco e precisa medir a economia por conta, entender por " +
    "que o split não é simétrico e calcular a escala mínima para o negócio fechar a conta.",
  keyFacts: [
    { label: "Intercâmbio / conta / ano", value: "R$ 120" },
    { label: "Float / conta / ano", value: "R$ 80" },
    { label: "Spread de crédito / conta / ano", value: "R$ 270" },
    { label: "Tarifas / conta / ano", value: "R$ 30" },
    { label: "Custo infra + compliance / conta", value: "R$ 150" },
    { label: "PDD esperada / conta / ano", value: "R$ 60", tone: "warning" },
    { label: "Share da marca (rev-share)", value: "40%" },
    { label: "Custo fixo de plataforma", value: "R$ 9 mi/ano" },
  ],
  details: [
    {
      id: "unit",
      title: "Unit economics (R$ / conta / ano)",
      columns: ["Item", "Valor"],
      rows: [
        { label: "Intercâmbio", values: ["120"] },
        { label: "Float", values: ["80"] },
        { label: "Spread de crédito embarcado", values: ["270"] },
        { label: "Tarifas", values: ["30"] },
        { label: "Receita bruta", values: ["500"], emphasis: true },
        { label: "(–) Repasse à marca (40%)", values: ["(200)"] },
        { label: "(–) Infra + compliance", values: ["(150)"] },
        { label: "(–) PDD esperada", values: ["(60)"] },
        { label: "Net do banco / conta", values: ["90"], emphasis: true },
      ],
    },
    {
      id: "plat",
      title: "Plataforma (R$)",
      columns: ["Item", "Valor"],
      rows: [
        { label: "Custo fixo anual (tech, compliance, licença)", values: ["9.000.000"] },
        { label: "Net por conta", values: ["90"] },
        { label: "Break-even (contas ativas)", values: ["100.000"], emphasis: true },
      ],
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Etapa 1 · Leitura — receita bruta por conta",
      points: 20,
      prompt: "Qual a receita bruta por conta ativa ao ano?",
      options: [
        {
          id: "a",
          text: "R$ 500",
          correct: true,
          feedback:
            "Receita bruta = intercâmbio + float + spread + tarifas = 120 + 80 + 270 + 30 = <strong>R$ 500</strong>.",
        },
        {
          id: "b",
          text: "R$ 200",
          correct: false,
          feedback:
            "Erro: R$ 200 é o que vai à marca (40% × 500). A receita bruta por conta é a soma das fontes = 500.",
        },
        {
          id: "c",
          text: "R$ 290",
          correct: false,
          feedback:
            "Erro: 290 é a contribuição antes do split (500 − 150 − 60). A receita bruta é a soma das 4 fontes = 500.",
        },
        {
          id: "d",
          text: "R$ 470",
          correct: false,
          feedback: "Erro: esqueceu as tarifas (30). 120 + 80 + 270 + 30 = 500.",
        },
      ],
    },
    {
      id: "e2",
      label: "Etapa 2 · Mecanismo — por que o split não é 50/50",
      points: 20,
      prompt: "Por que o rev-share não é simétrico entre banco e marca?",
      options: [
        {
          id: "a",
          text: "O banco detém licença, capital e risco de crédito; a marca detém distribuição/CAC. O split remunera papéis assimétricos.",
          correct: true,
          feedback:
            "O banco aporta balanço, compliance e absorve a PDD (60) e o capital regulatório; a marca aporta a base de clientes. Como os papéis são assimétricos, o split também é.",
        },
        {
          id: "b",
          text: "É 50/50 por padrão de mercado.",
          correct: false,
          feedback:
            "Erro: não há padrão fixo; o split é negociado e reflete quem carrega risco/capital (banco) vs. distribuição (marca).",
        },
        {
          id: "c",
          text: "A marca fica com mais porque assume o risco de crédito.",
          correct: false,
          feedback:
            "Erro: invertido — quem carrega o risco de crédito (PDD 60) e o capital é o banco, não a marca.",
        },
        {
          id: "d",
          text: "O banco fica com mais porque processa os pagamentos.",
          correct: false,
          feedback:
            "Erro: processar é um custo (infra 150), não a razão do split. O que justifica a fatia do banco é licença/capital/risco.",
        },
      ],
    },
    {
      id: "e3",
      label: "Etapa 3 · Síntese — net e break-even",
      points: 20,
      prompt: "Qual o net do banco por conta e o break-even em contas ativas?",
      options: [
        {
          id: "a",
          text: "Net R$ 90/conta; break-even 100.000 contas.",
          correct: true,
          feedback:
            "Net = 60% × 500 − 150 − 60 = 300 − 210 = <strong>R$ 90</strong>. Break-even = custo fixo / net = 9.000.000 / 90 = <strong>100.000 contas</strong>.",
        },
        {
          id: "b",
          text: "Net R$ 290; break-even 31.034 contas.",
          correct: false,
          feedback:
            "Erro: não descontou o repasse à marca (200). Net = 500 − 200 − 150 − 60 = 90 → break-even 100.000.",
        },
        {
          id: "c",
          text: "Net R$ 90; break-even 100 contas.",
          correct: false,
          feedback: "Erro de escala: 9.000.000 / 90 = 100.000 (não 100).",
        },
        {
          id: "d",
          text: "Net R$ 150; break-even 60.000 contas.",
          correct: false,
          feedback:
            "Erro: esqueceu a PDD (60). Net = 500 − 200 − 150 − 60 = 90 → break-even 100.000.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Que modelo de contrato adotar com a marca?",
    branches: [
      {
        id: "A",
        title: "Pure rev-share (40% à marca)",
        summary: "Alinhado e escalável, exposto a contas inativas.",
        resultado: {
          headline: "Alinhado, mas dependente de contas ativas",
          caption: "Rentabilidade ligada à ativação da base.",
          metrics: [
            { label: "Net / conta", value: "R$ 90", tone: "neutral" },
            { label: "Break-even", value: "100k contas", tone: "neutral" },
            { label: "Alinhamento", value: "Alto", tone: "positive" },
            { label: "Contas inativas", value: "Risco", tone: "risk" },
          ],
          explanation:
            "Alinha incentivos e escala junto com a marca, mas a rentabilidade depende de contas ativas — contas dormentes não cobrem o custo fixo.",
        },
      },
      {
        id: "B",
        title: "Fee fixo por conta + por transação",
        summary: "Receita previsível ao banco, sem o upside de crescimento.",
        resultado: {
          headline: "Receita previsível, sem o upside",
          caption: "Troca variância por teto de retorno.",
          metrics: [
            { label: "Receita ao banco", value: "Previsível", tone: "positive" },
            { label: "Upside (float/spread)", value: "Abre mão", tone: "negative" },
            { label: "Risco de volume", value: "Vai à marca", tone: "neutral" },
            { label: "Net / conta", value: "Limitado", tone: "neutral" },
          ],
          explanation:
            "Protege o banco do risco de volume e dá receita previsível, mas entrega o upside de crescimento à marca.",
        },
      },
      {
        id: "C",
        title: "Híbrido (fee fixo menor + rev-share)",
        summary: "Piso de receita com participação no crescimento, ao custo de complexidade.",
        resultado: {
          headline: "Piso de receita com participação no upside",
          caption: "Equilíbrio risco/retorno, à custa de complexidade contratual.",
          metrics: [
            { label: "Piso de receita", value: "Sim", tone: "positive" },
            { label: "Upside", value: "Compartilhado", tone: "positive" },
            { label: "Risco/retorno", value: "Equilibrado", tone: "neutral" },
            { label: "Contrato", value: "Complexo", tone: "risk" },
          ],
          explanation:
            "Combina piso previsível com participação no crescimento, ao custo de um contrato mais difícil de administrar.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual risco residual o modelo de rev-share NÃO resolve para o banco?",
    options: [
      {
        id: "a",
        text: "O banco carrega o risco regulatório e reputacional (KYC/AML, falhas da marca) e fica concentrado num parceiro — se a marca sai, a base evapora.",
        correct: true,
        feedback:
          "O rev-share alinha receita, mas não transfere o risco de compliance/reputação (que é do licenciado) nem dilui a dependência de um único distribuidor.",
      },
      {
        id: "b",
        text: "Nenhum: o rev-share alinha tudo.",
        correct: false,
        feedback:
          "Erro: alinha receita, não elimina o risco regulatório/reputacional nem a concentração no parceiro.",
      },
      {
        id: "c",
        text: "Só falta cobrar mais por transação.",
        correct: false,
        feedback:
          "Erro: preço não cobre risco regulatório/reputacional nem a concentração de parceiro.",
      },
      {
        id: "d",
        text: "O risco é só o custo de infra subir.",
        correct: false,
        feedback:
          "Erro: o risco central é regulatório/reputacional e de concentração, não o custo de infra.",
      },
    ],
  },
  maxScore: 85,
};

// ===================================================================
// S7.2 — VarejoX · BaaS (lado distribuidor) · embedded finance
// ===================================================================
const s7_2: Scenario = {
  id: "s7-2",
  code: "S7.2",
  order: 2,
  title: "Embedded finance: o ganho da marca ao embarcar finanças",
  protagonist: "VarejoX (marca)",
  difficulty: "intermediario",
  estMinutes: 20,
  blurb:
    "A VarejoX (a mesma marca do S7.1) embute conta, wallet e crédito no seu app. Quanto isso adiciona à receita — e de onde vem o ganho: do produto financeiro em si ou do efeito no funil core?",
  archetype: "BaaS (lado distribuidor) — receita + funil + LTV",
  context:
    "A <strong>VarejoX</strong> é um marketplace com <strong>R$ 500 milhões de GMV</strong> e <em>take rate</em> de 12%. " +
    "Ela passa a embutir finanças (wallet, pagamentos e <em>BNPL</em>) usando um parceiro BaaS. A diretoria quer saber o " +
    "<strong>ganho incremental</strong> e — mais importante — <em>de onde ele vem</em>: da nova receita financeira, do " +
    "aumento do GMV pela conversão, ou da retenção. Sua tarefa: medir a receita base, mapear as fontes do ganho e quantificá-lo.",
  keyFacts: [
    { label: "GMV anual", value: "R$ 500 mi" },
    { label: "Take rate", value: "12%" },
    { label: "Base de clientes", value: "1 mi" },
    { label: "CAC", value: "R$ 40" },
    { label: "Retenção atual", value: "60%" },
    { label: "Intercâmbio (novo)", value: "R$ 1,0 mi" },
    { label: "Float (novo)", value: "R$ 0,5 mi" },
    { label: "Spread BNPL (novo)", value: "R$ 2,5 mi" },
    { label: "Lift de GMV pela conversão", value: "+10%" },
  ],
  details: [
    {
      id: "rec",
      title: "Receita atual (R$ mi)",
      columns: ["Item", "Valor"],
      rows: [
        { label: "GMV (Gross Merchandise Value — volume bruto transacionado)", values: ["500"] },
        { label: "Take rate (% do GMV retido como receita)", values: ["12%"] },
        { label: "Receita do marketplace", values: ["60"], emphasis: true },
      ],
    },
    {
      id: "ganho",
      title: "Ganho de embedded finance (R$ mi)",
      columns: ["Item", "Valor"],
      rows: [
        { label: "Intercâmbio", values: ["1,0"] },
        { label: "Float (receita sobre saldos parados em conta)", values: ["0,5"] },
        { label: "Spread BNPL (BNPL = Buy Now, Pay Later; ganho no parcelamento)", values: ["2,5"] },
        { label: "Take sobre GMV incremental (+10% × 500 = 50; × 12%)", values: ["6,0"] },
        { label: "Ganho incremental total", values: ["10,0"], emphasis: true },
      ],
      note: "O lift de retenção (60% → maior) reforça o LTV, mas o cálculo do ganho usa as quatro linhas acima.",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Etapa 1 · Leitura — receita atual",
      points: 20,
      prompt: "Qual a receita atual do marketplace?",
      options: [
        {
          id: "a",
          text: "R$ 60 mi",
          correct: true,
          feedback: "Receita = GMV × take rate = 500 × 12% = <strong>R$ 60 mi</strong>.",
        },
        {
          id: "b",
          text: "R$ 500 mi",
          correct: false,
          feedback:
            "Erro: R$ 500 mi é o GMV (volume transacionado), não a receita. Receita = 500 × 12% = 60.",
        },
        {
          id: "c",
          text: "R$ 6,0 mi",
          correct: false,
          feedback:
            "Erro: aplicou 12% sobre o GMV incremental (50), não sobre o GMV total (500). Receita base = 60.",
        },
        {
          id: "d",
          text: "R$ 12 mi",
          correct: false,
          feedback: "Erro: o take incide sobre o GMV (500), não sobre a base de clientes. Receita = 60.",
        },
      ],
    },
    {
      id: "e2",
      label: "Etapa 2 · Mecanismo — de onde vem o ganho",
      points: 20,
      prompt: "De onde vem, principalmente, o ganho de embarcar finanças?",
      options: [
        {
          id: "a",
          text: "De três fontes: nova receita financeira; lift do GMV core (conversão/frequência); e retenção/LTV. Não é só “vender um produto financeiro”.",
          correct: true,
          feedback:
            "O efeito principal costuma ser no funil (mais conversão, mais frequência, menos churn) somado às linhas financeiras — não apenas a margem do produto financeiro isolado.",
        },
        {
          id: "b",
          text: "Só da nova receita financeira (intercâmbio/float/spread).",
          correct: false,
          feedback: "Erro: ignora o lift de GMV (6,0), que aqui é a maior parcela.",
        },
        {
          id: "c",
          text: "Só do lift de GMV.",
          correct: false,
          feedback: "Erro: ignora as linhas financeiras (1,0 + 0,5 + 2,5 = 4,0).",
        },
        {
          id: "d",
          text: "Apenas de um CAC menor.",
          correct: false,
          feedback:
            "Erro: CAC menor ajuda o LTV, mas o ganho medido vem de receita financeira + lift de GMV.",
        },
      ],
    },
    {
      id: "e3",
      label: "Etapa 3 · Síntese — ganho incremental",
      points: 20,
      prompt: "Qual o ganho incremental anual de embarcar finanças?",
      options: [
        {
          id: "a",
          text: "R$ 10,0 mi (+16,7% sobre a receita base)",
          correct: true,
          feedback:
            "Ganho = 1,0 + 0,5 + 2,5 + (10% × 500 × 12% = 6,0) = <strong>R$ 10,0 mi</strong>. Sobre os R$ 60 mi de base → <strong>+16,7%</strong>.",
        },
        {
          id: "b",
          text: "R$ 4,0 mi",
          correct: false,
          feedback:
            "Erro: somou só as linhas financeiras (1,0 + 0,5 + 2,5). Falta o take sobre o GMV incremental (6,0). Total 10,0.",
        },
        {
          id: "c",
          text: "R$ 6,0 mi",
          correct: false,
          feedback:
            "Erro: contou só o lift de GMV. Faltam as linhas financeiras (4,0). Total 10,0.",
        },
        {
          id: "d",
          text: "R$ 16,7 mi",
          correct: false,
          feedback: "Erro: +16,7% é o ganho relativo; o valor absoluto é R$ 10,0 mi.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Como a marca deve operacionalizar as finanças embarcadas?",
    branches: [
      {
        id: "A",
        title: "Partner via BaaS (ex.: Banco Trilho)",
        summary: "Time-to-market rápido e capex baixo, dividindo a margem com o parceiro.",
        resultado: {
          headline: "Rápido ao mercado, margem dividida",
          caption: "Lança sem balanço próprio; depende do provedor.",
          metrics: [
            { label: "Time-to-market", value: "Rápido", tone: "positive" },
            { label: "Capex", value: "Baixo", tone: "positive" },
            { label: "Margem", value: "Rev-share", tone: "negative" },
            { label: "Parceiro", value: "Dependência", tone: "risk" },
          ],
          explanation:
            "Lança rápido e sem balanço próprio, mas entrega parte do ganho ao provedor (o outro lado do S7.1) e fica dependente dele.",
        },
      },
      {
        id: "B",
        title: "Licença própria (IP / SCD)",
        summary: "Captura toda a margem, virando (parcialmente) instituição financeira.",
        resultado: {
          headline: "Margem integral, virando instituição financeira",
          caption: "100% da economia ao custo de prazo e risco regulatório.",
          metrics: [
            { label: "Margem", value: "100%", tone: "positive" },
            { label: "Custo regulatório/capital", value: "Alto", tone: "negative" },
            { label: "Compliance e risco", value: "Assume", tone: "risk" },
            { label: "Prazo", value: "Longo", tone: "neutral" },
          ],
          explanation:
            "Fica com 100% da economia, mas vira (parcialmente) uma instituição financeira — custo, prazo e risco regulatório.",
        },
      },
      {
        id: "C",
        title: "Híbrido / referral",
        summary: "Pagamentos via parceiro e crédito como referral; exposição mínima.",
        resultado: {
          headline: "Exposição mínima, captura parcial",
          caption: "Pagamentos via parceiro; crédito como referral.",
          metrics: [
            { label: "Risco", value: "Baixo", tone: "positive" },
            { label: "Captura", value: "Parcial", tone: "neutral" },
            { label: "Balanço de crédito", value: "Sem", tone: "positive" },
            { label: "Ganho", value: "Menor", tone: "neutral" },
          ],
          explanation:
            "Embute pagamentos via parceiro e mantém o crédito como referral (sem assumir a carteira); ganho menor, exposição mínima.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual risco residual o ganho de embedded finance esconde?",
    options: [
      {
        id: "a",
        text: "Os R$ 10 mi são brutos: líquidos do rev-share com o banco parceiro ficam bem menores. No modelo BaaS o risco de crédito, o compliance e o perímetro regulatório são do banco — mas o ganho da marca ainda depende do ciclo: se a inadimplência do BNPL sobe, o banco reprecifica/restringe o crédito e o spread repartido encolhe; somam-se risco reputacional e dependência do parceiro.",
        correct: true,
        feedback:
          "Num modelo BaaS, crédito, compliance e observância regulatória ficam com o banco licenciado, não com a marca. Ainda assim, o ganho é bruto (o rev-share reduz o líquido) e sensível ao ciclo de crédito — pior inadimplência leva o banco a apertar o BNPL e dividir menos spread —, além do risco reputacional (o cliente vê a marca) e da dependência do parceiro.",
      },
      {
        id: "b",
        text: "Nenhum: é receita pura.",
        correct: false,
        feedback: "Erro: o ganho é bruto; o rev-share com o banco parceiro reduz o líquido, que ainda depende do ciclo de crédito.",
      },
      {
        id: "c",
        text: "Só o risco de TI.",
        correct: false,
        feedback: "Erro: vai além de TI — o ganho é bruto (rev-share), depende do ciclo de crédito e há risco reputacional e de dependência do parceiro.",
      },
      {
        id: "d",
        text: "O risco é o take rate cair.",
        correct: false,
        feedback: "Erro: o principal é o ganho ser bruto (rev-share) e sensível ao ciclo de crédito, somado à dependência do parceiro e ao risco reputacional.",
      },
    ],
  },
  maxScore: 85,
};

// ===================================================================
// S7.3 — AgroNova · Tokenização de recebíveis · custo de funding
// ===================================================================
const s7_3: Scenario = {
  id: "s7-3",
  code: "S7.3",
  order: 3,
  title: "Tokenização de recebíveis: o custo de funding",
  protagonist: "AgroNova S.A.",
  difficulty: "avancado",
  estMinutes: 24,
  blurb:
    "A AgroNova precisa antecipar R$ 50 mi de recebíveis de 180 dias. Antecipação bancária, FIDC ou tokenização? Sua tarefa: precificar a rota tokenizada, entender por que a taxa exigida cai e medir a economia.",
  archetype: "Tokenização — desintermediação e fracionamento do funding",
  context:
    "A <strong>AgroNova S.A.</strong> tem <strong>R$ 50 milhões em recebíveis</strong> de prazo médio de <strong>180 " +
    "dias</strong> e precisa de caixa agora. Há três rotas: <em>antecipação bancária</em> (rápida, cara), <em>FIDC</em> " +
    "(estruturada, regulada, mais lenta) e <em>tokenização</em> (tokens lastreados nos recebíveis, distribuídos a " +
    "investidores fracionados, com registro on-chain e mercado secundário). Você é da tesouraria e precisa comparar o " +
    "custo efetivo e decidir a rota.",
  keyFacts: [
    { label: "Recebíveis a financiar", value: "R$ 50 mi" },
    { label: "Prazo médio", value: "180 dias" },
    { label: "CDI (premissa · verificar)", value: "11% a.a.", tone: "warning" },
    { label: "Antecipação bancária", value: "~30% a.a." },
    { label: "FIDC", value: "CDI + 6% (17%)" },
    { label: "Tokenização", value: "CDI + 3% (14%)" },
  ],
  details: [
    {
      id: "rotas",
      title: "Rotas de funding",
      columns: ["Rota", "Taxa a.a.", "Custo no ciclo (180d) sobre R$ 50 mi", "Característica"],
      rows: [
        {
          label: "Antecipação bancária",
          values: ["~30%", "R$ 7,5 mi", "Rápida, simples, cara"],
        },
        {
          label: "FIDC",
          values: ["17%", "R$ 4,25 mi", "Estruturada, regulada, lenta; taxa de adm/subordinação"],
        },
        {
          label: "Tokenização",
          values: ["14%", "R$ 3,5 mi", "Fracionada, secundário, risco operacional/jurídico novo"],
          emphasis: true,
        },
      ],
      note: "Custo no ciclo = taxa a.a. × (180/360) × 50. Aqui falamos de recebíveis tokenizados (ativos do mundo real), não de um acrônimo prudencial.",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Etapa 1 · Leitura — custo da rota tokenizada",
      points: 20,
      prompt: "Qual o custo da rota tokenizada no ciclo de 180 dias?",
      options: [
        {
          id: "a",
          text: "R$ 3,5 mi",
          correct: true,
          feedback:
            "Custo = 14% × (180/360) × 50 = 0,14 × 0,5 × 50 = <strong>R$ 3,5 mi</strong>.",
        },
        {
          id: "b",
          text: "R$ 7,0 mi",
          correct: false,
          feedback:
            "Erro: usou a taxa anual sem ajustar o prazo. O ciclo é 180 dias (×0,5): 14% × 0,5 × 50 = 3,5.",
        },
        {
          id: "c",
          text: "R$ 1,5 mi",
          correct: false,
          feedback:
            "Erro: usou só o spread (3%). A taxa é CDI + 3% = 14%. Custo = 14% × 0,5 × 50 = 3,5.",
        },
        {
          id: "d",
          text: "R$ 4,25 mi",
          correct: false,
          feedback:
            "Erro: usou a taxa do FIDC (17%). A tokenização é 14%: 14% × 0,5 × 50 = 3,5.",
        },
      ],
    },
    {
      id: "e2",
      label: "Etapa 2 · Mecanismo — por que a taxa cai",
      points: 20,
      prompt: "Por que a taxa exigida na tokenização é menor que no FIDC?",
      options: [
        {
          id: "a",
          text: "Remove camadas de intermediação, permite fracionamento, o registro on-chain reduz risco operacional/fraude e o secundário aumenta a liquidez → menor prêmio exigido.",
          correct: true,
          feedback:
            "Cedente → plataforma → investidor direto (vs. cedente → FIDC → cotistas): menos camadas e mais demanda fracionada comprimem o prêmio de risco/liquidez.",
        },
        {
          id: "b",
          text: "Porque tokens rendem menos por serem digitais.",
          correct: false,
          feedback:
            "Erro: a queda vem de desintermediação/liquidez/fracionamento, não de “ser digital”.",
        },
        {
          id: "c",
          text: "Porque a tokenização elimina o risco de crédito do recebível.",
          correct: false,
          feedback:
            "Erro: o risco de crédito do sacado permanece; o que muda é a estrutura de distribuição.",
        },
        {
          id: "d",
          text: "Porque o CDI cai com a tokenização.",
          correct: false,
          feedback:
            "Erro: o CDI é exógeno; o que cai é o spread exigido (prêmio sobre o CDI).",
        },
      ],
    },
    {
      id: "e3",
      label: "Etapa 3 · Síntese — economia vs. FIDC",
      points: 20,
      prompt: "Qual a economia de tokenizar em vez de usar FIDC?",
      options: [
        {
          id: "a",
          text: "R$ 0,75 mi por ciclo (≈ R$ 1,5 mi/ano girando 2×)",
          correct: true,
          feedback:
            "Economia = (17% − 14%) × (180/360) × 50 = 3% × 0,5 × 50 = <strong>R$ 0,75 mi</strong> por ciclo de 180 dias.",
        },
        {
          id: "b",
          text: "R$ 1,5 mi por ciclo",
          correct: false,
          feedback:
            "Erro: não ajustou o prazo. 3% × 0,5 × 50 = 0,75 no ciclo de 180d (1,5 só anualizado).",
        },
        {
          id: "c",
          text: "R$ 4,0 mi por ciclo",
          correct: false,
          feedback:
            "Erro: comparou com a antecipação bancária (30%), não com o FIDC. Vs. FIDC = 0,75; vs. banco = 4,0.",
        },
        {
          id: "d",
          text: "R$ 0,15 mi por ciclo",
          correct: false,
          feedback:
            "Erro: usou diferença de spread errada. A diferença é 3 p.p. (17 − 14): 3% × 0,5 × 50 = 0,75.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Qual rota de funding adotar para os recebíveis?",
    branches: [
      {
        id: "A",
        title: "Antecipação bancária",
        summary: "Rápida e simples, porém a rota mais cara (~30% a.a.).",
        resultado: {
          headline: "Liquidez imediata, a rota mais cara",
          caption: "Caixa agora, custo ~R$ 7,5 mi/ciclo.",
          metrics: [
            { label: "Velocidade", value: "Rápida", tone: "positive" },
            { label: "Custo/ciclo", value: "~R$ 7,5 mi", tone: "negative" },
            { label: "Relação bancária", value: "Mantida", tone: "neutral" },
            { label: "Taxa", value: "~30% a.a.", tone: "negative" },
          ],
          explanation: "Liquidez imediata, mas a rota mais cara (~30% a.a.).",
        },
      },
      {
        id: "B",
        title: "FIDC",
        summary: "Estrutura robusta e regulada, com setup lento.",
        resultado: {
          headline: "Arcabouço maduro, montagem lenta",
          caption: "Custo médio (R$ 4,25 mi/ciclo) com estrutura regulada.",
          metrics: [
            { label: "Custo/ciclo", value: "R$ 4,25 mi", tone: "neutral" },
            { label: "Estrutura", value: "Robusta/regulada", tone: "positive" },
            { label: "Setup", value: "Lento", tone: "negative" },
            { label: "Adm/subordinação", value: "Custo extra", tone: "neutral" },
          ],
          explanation:
            "Custo médio e arcabouço maduro, mas montagem lenta e taxa de adm/subordinação.",
        },
      },
      {
        id: "C",
        title: "Tokenização",
        summary: "O menor custo, com riscos operacionais e jurídicos novos.",
        resultado: {
          headline: "Menor custo, risco novo a gerir",
          caption: "R$ 3,5 mi/ciclo com fracionamento e secundário.",
          metrics: [
            { label: "Custo/ciclo", value: "R$ 3,5 mi", tone: "positive" },
            { label: "Distribuição", value: "Fracionada + secundário", tone: "positive" },
            { label: "Risco op./jurídico", value: "Novo", tone: "risk" },
            { label: "Economia vs. FIDC", value: "R$ 0,75 mi", tone: "positive" },
          ],
          explanation:
            "O menor custo, mas introduz riscos de custódia, smart contract e enforceability ainda em amadurecimento.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual risco residual a tokenização introduz?",
    options: [
      {
        id: "a",
        text: "A liquidez do secundário pode ser ilusória; o vínculo jurídico token↔recebível precisa ser exequível na inadimplência; há risco de custódia/smart contract/plataforma; e a demanda some no estresse.",
        correct: true,
        feedback:
          "A taxa menor pressupõe um mercado secundário líquido e um elo legal robusto entre o token e o lastro — premissas que podem falhar exatamente quando mais importam.",
      },
      {
        id: "b",
        text: "Nenhum: on-chain é à prova de risco.",
        correct: false,
        feedback:
          "Erro: há risco operacional, jurídico e de liquidez, não eliminados pela tecnologia.",
      },
      {
        id: "c",
        text: "Só o risco de o CDI subir.",
        correct: false,
        feedback:
          "Erro: o CDI afeta todas as rotas igualmente; o risco específico é jurídico/operacional/liquidez.",
      },
      {
        id: "d",
        text: "O token elimina a inadimplência do sacado.",
        correct: false,
        feedback: "Erro: o risco de crédito do recebível subjacente permanece.",
      },
    ],
  },
  maxScore: 85,
};

// ===================================================================
// S7.4 — Tesouraria Mérito · Liquidação atômica (DvP, T+0)
// ===================================================================
const s7_4: Scenario = {
  id: "s7-4",
  code: "S7.4",
  order: 4,
  title: "Liquidação atômica: liberar liquidez e zerar risco de liquidação",
  protagonist: "Tesouraria Mérito",
  difficulty: "avancado",
  estMinutes: 24,
  blurb:
    "A Tesouraria Mérito liquida R$ 200 mi/dia em T+2. Uma plataforma de razão tokenizada permite liquidação atômica (DvP, T+0). Sua tarefa: medir a liquidez travada, entender por que o atômico elimina o risco de liquidação e quantificar o ganho.",
  archetype: "Tokenização — liquidez e risco de liquidação (DvP atômico)",
  context:
    "A <strong>Tesouraria Mérito</strong> liquida <strong>R$ 200 milhões por dia</strong> em operações com janela " +
    "<strong>T+2</strong>. Nessa janela, parte da liquidez fica “em trânsito” e existe o <em>risco de liquidação</em> " +
    "(uma parte entrega e a outra não — risco Herstatt), exigindo um <em>buffer</em>. Uma plataforma de <strong>razão " +
    "tokenizada</strong> permite <strong>liquidação atômica (DvP, T+0)</strong>: entrega do ativo e pagamento ocorrem de " +
    "forma simultânea e condicional. Sua tarefa: medir a liquidez travada, explicar o mecanismo e quantificar o ganho de liberá-la.",
  keyFacts: [
    { label: "Volume diário de liquidação", value: "R$ 200 mi" },
    { label: "Janela tradicional", value: "T+2" },
    { label: "Funding do buffer", value: "CDI + 2%" },
    { label: "Caixa rende (premissa · verificar)", value: "CDI", tone: "warning" },
  ],
  details: [
    {
      id: "liq",
      title: "Liquidação",
      columns: ["Item", "Tradicional (T+2)", "Atômica (T+0)"],
      rows: [
        { label: "Liquidez em trânsito", values: ["R$ 400 mi (200 × 2 dias)", "R$ 0"] },
        { label: "Risco de liquidação (Herstatt)", values: ["Presente", "Eliminado"] },
        { label: "Buffer necessário", values: ["~R$ 400 mi", "Desnecessário"] },
        { label: "Carry do buffer (funding − rendimento)", values: ["2% a.a.", "—"] },
      ],
      note: "DvP = delivery versus payment. Atomicidade: ou ambas as pernas ocorrem, ou nenhuma — não há janela de exposição.",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Etapa 1 · Leitura — liquidez travada",
      points: 20,
      prompt: "Quanta liquidez fica travada em liquidação no regime T+2?",
      options: [
        {
          id: "a",
          text: "R$ 400 mi",
          correct: true,
          feedback:
            "Liquidez em trânsito = volume diário × dias da janela = 200 × 2 = <strong>R$ 400 mi</strong>.",
        },
        {
          id: "b",
          text: "R$ 200 mi",
          correct: false,
          feedback:
            "Erro: contou só 1 dia. Em T+2, dois dias de volume ficam em trânsito: 200 × 2 = 400.",
        },
        {
          id: "c",
          text: "R$ 600 mi",
          correct: false,
          feedback: "Erro: contou 3 dias. T+2 = 2 dias: 200 × 2 = 400.",
        },
        {
          id: "d",
          text: "R$ 100 mi",
          correct: false,
          feedback:
            "Erro: o volume diário inteiro (200) fica em trânsito por 2 dias: 200 × 2 = 400.",
        },
      ],
    },
    {
      id: "e2",
      label: "Etapa 2 · Mecanismo — por que o atômico elimina o risco",
      points: 20,
      prompt: "Por que a liquidação atômica elimina o risco de liquidação e libera o buffer?",
      options: [
        {
          id: "a",
          text: "Em DvP atômico, entrega e pagamento ocorrem simultaneamente e condicionalmente (ou ambos, ou nenhum) → some a janela de risco Herstatt; T+0 → nada em trânsito → buffer desnecessário.",
          correct: true,
          feedback:
            "A atomicidade remove o intervalo em que uma parte já entregou e a outra ainda não; sem janela, não há buffer a manter.",
        },
        {
          id: "b",
          text: "Porque o tokenizado é mais rápido, mas o risco continua.",
          correct: false,
          feedback: "Erro: a atomicidade elimina o risco de liquidação — não é só velocidade.",
        },
        {
          id: "c",
          text: "Porque elimina o risco de crédito da contraparte.",
          correct: false,
          feedback:
            "Erro: elimina o risco de liquidação (settlement), não o risco de crédito geral da contraparte.",
        },
        {
          id: "d",
          text: "Porque o buffer passa a render mais.",
          correct: false,
          feedback: "Erro: o ganho é não precisar do buffer (liberá-lo), não fazê-lo render mais.",
        },
      ],
    },
    {
      id: "e3",
      label: "Etapa 3 · Síntese — ganho anual",
      points: 20,
      prompt: "Qual o ganho anual de liberar o buffer com a liquidação atômica?",
      options: [
        {
          id: "a",
          text: "R$ 8 mi/ano",
          correct: true,
          feedback:
            "Ganho = carry negativo evitado = (CDI+2% − CDI) × buffer = 2% × 400 = <strong>R$ 8 mi/ano</strong>, além de zerar o risco de liquidação.",
        },
        {
          id: "b",
          text: "R$ 44 mi/ano",
          correct: false,
          feedback:
            "Erro: usou o CDI cheio (11%). O que se evita é o carry negativo (funding − rendimento = 2%): 2% × 400 = 8.",
        },
        {
          id: "c",
          text: "R$ 4 mi/ano",
          correct: false,
          feedback: "Erro: usou metade do buffer. Buffer liberado = 400: 2% × 400 = 8.",
        },
        {
          id: "d",
          text: "R$ 8 mil/ano",
          correct: false,
          feedback: "Erro de escala: 2% × R$ 400 mi = R$ 8 milhões/ano.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Qual caminho de adoção seguir?",
    branches: [
      {
        id: "A",
        title: "Manter T+2 (rails tradicionais)",
        summary: "Custo de mudança zero, mas mantém buffer e risco de liquidação.",
        resultado: {
          headline: "Zero esforço, custo e risco mantidos",
          caption: "Sem migração; carrega o carry negativo e o risco Herstatt.",
          metrics: [
            { label: "Custo de mudança", value: "Zero", tone: "positive" },
            { label: "Buffer", value: "R$ 400 mi", tone: "risk" },
            { label: "Risco de liquidação", value: "Mantido", tone: "risk" },
            { label: "Carry", value: "Negativo", tone: "negative" },
          ],
          explanation: "Nenhum esforço de migração, mas carrega o carry negativo e o risco Herstatt.",
        },
      },
      {
        id: "B",
        title: "Pilotar tokenização numa fatia (25%)",
        summary: "Captura parte do ganho com risco controlado, operando dois sistemas.",
        resultado: {
          headline: "Ganho parcial com aprendizado controlado",
          caption: "Captura uma fatia, ao custo de dupla operação.",
          metrics: [
            { label: "Ganho", value: "Parcial", tone: "positive" },
            { label: "Risco", value: "Controlado", tone: "positive" },
            { label: "Operação", value: "Dois sistemas", tone: "neutral" },
            { label: "Integração", value: "Necessária", tone: "neutral" },
          ],
          explanation: "Ganho parcial e aprendizado, ao custo de integração e dupla operação.",
        },
      },
      {
        id: "C",
        title: "Migrar full para liquidação tokenizada",
        summary: "Captura todo o ganho (R$ 8 mi), dependente de interoperabilidade e adoção.",
        resultado: {
          headline: "Ganho integral, dependente de adoção",
          caption: "R$ 8 mi/ano só se a infra for madura e as contrapartes aderirem.",
          metrics: [
            { label: "Ganho", value: "R$ 8 mi", tone: "positive" },
            { label: "Interoperabilidade", value: "Dependente", tone: "risk" },
            { label: "Finalidade jurídica", value: "A maturar", tone: "risk" },
            { label: "Contrapartes", value: "Precisam aderir", tone: "neutral" },
          ],
          explanation:
            "Ganho integral, mas só funciona se a infra for madura e as contrapartes aderirem.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual condição/risco residual permanece?",
    options: [
      {
        id: "a",
        text: "O ganho só se materializa com efeito de rede (as contrapartes precisam estar na mesma razão); restam riscos de interoperabilidade, finalidade jurídica e dependência da plataforma.",
        correct: true,
        feedback:
          "Liquidação atômica exige que ambas as pernas vivam na mesma infraestrutura; sem adoção das contrapartes, surgem “ilhas de liquidez” e o ganho não aparece.",
      },
      {
        id: "b",
        text: "Nenhum: basta o banco adotar.",
        correct: false,
        feedback: "Erro: precisa que as contrapartes também adotem (efeito de rede).",
      },
      {
        id: "c",
        text: "Só o risco de TI interno.",
        correct: false,
        feedback: "Erro: o risco central é de rede/interoperabilidade/finalidade jurídica.",
      },
      {
        id: "d",
        text: "O atômico elimina toda a necessidade de liquidez.",
        correct: false,
        feedback:
          "Erro: reduz o buffer de liquidação, não toda a gestão de liquidez da tesouraria.",
      },
    ],
  },
  maxScore: 85,
};

export const scenarios: Scenario[] = [s7_1, s7_2, s7_3, s7_4];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
