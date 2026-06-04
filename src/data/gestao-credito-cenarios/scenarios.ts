// Conteúdo dos 4 cenários do Módulo 10 — Gestão de Crédito (spec §11–14).
// Fonte única, data-driven. Strings aceitam HTML inline restrito (<strong>, <em>, <br>).
// Motor único: PE = PD × LGD × EAD (spec §2). Sem regra/chip global.
// Unidades (spec §9): S8.1 no nível do empréstimo usa R$ mil; S8.2–S8.4 usam R$ mi.
import type { Scenario } from "./types";

// ===================================================================
// S8.1 — Crédito Alfa · Diferenciação de risco (template canônico)
// ===================================================================
const s8_1: Scenario = {
  id: "s8-1",
  code: "S8.1",
  order: 1,
  title: "Alto risco × baixo risco: preço e gestão diferenciados",
  protagonist: "Crédito Alfa",
  difficulty: "intermediario",
  estMinutes: 20,
  blurb:
    "Dois pedidos de empréstimo de mesmo valor, perfis de risco opostos. Como o risco muda a perda esperada, o preço e a forma de gerir cada um?",
  archetype: "Diferenciação de risco — perda esperada no nível do empréstimo",
  context:
    "Você é analista de crédito do <strong>Crédito Alfa</strong>. Chegam dois pedidos de <strong>R$ 1.000 mil</strong> " +
    "cada. O Empréstimo A é de um tomador sólido (<em>PD</em> baixa, com garantia); o B é de um tomador frágil " +
    "(<em>PD</em> alta, sem garantia). A <em>perda esperada</em> de cada um é <strong>PE = PD × LGD × EAD</strong> — " +
    "onde PD é a probabilidade de inadimplência, LGD a perda dado o default (a garantia reduz a LGD) e EAD a " +
    "exposição. Sua tarefa: medir a PE, entender por que alto risco exige preço <strong>e</strong> gestão diferentes, " +
    "e precificar cada operação.",
  keyFacts: [
    { label: "Empréstimo A — PD", value: "1%" },
    { label: "Empréstimo A — LGD", value: "30%" },
    { label: "Empréstimo B — PD", value: "8%" },
    { label: "Empréstimo B — LGD", value: "50%", tone: "warning" },
    { label: "EAD (cada)", value: "R$ 1.000 mil" },
    { label: "Funding (CDI)", value: "11% a.a." },
    { label: "Opex", value: "1%" },
    { label: "Margem-alvo", value: "2%" },
  ],
  detailBoxLabel: "Dados da operação",
  details: [
    {
      id: "params",
      title: "Parâmetros e perda esperada",
      columns: ["Parâmetro", "Empréstimo A", "Empréstimo B"],
      rows: [
        { label: "PD", values: ["1%", "8%"] },
        { label: "LGD", values: ["30%", "50%"] },
        { label: "EAD (R$ mil)", values: ["1.000", "1.000"] },
        { label: "Perda esperada PE (R$ mil)", values: ["3", "40"], emphasis: true },
        { label: "PE % (sobre EAD)", values: ["0,3%", "4,0%"] },
      ],
    },
    {
      id: "rate",
      title: "Composição da taxa",
      columns: ["Composição da taxa", "Empréstimo A", "Empréstimo B"],
      rows: [
        { label: "Funding", values: ["11,0%", "11,0%"] },
        { label: "+ PE %", values: ["0,3%", "4,0%"] },
        { label: "+ Opex", values: ["1,0%", "1,0%"] },
        { label: "+ Margem-alvo", values: ["2,0%", "2,0%"] },
        { label: "Taxa mínima", values: ["14,3%", "18,0%"], emphasis: true },
      ],
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Leitura — perda esperada",
      points: 20,
      prompt: "Qual a perda esperada (PE) do Empréstimo B?",
      options: [
        {
          id: "a",
          text: "R$ 40 mil",
          correct: true,
          feedback:
            "PE = PD × LGD × EAD = 8% × 50% × 1.000 = <strong>R$ 40 mil</strong> (PE% = 4,0% sobre a EAD).",
        },
        {
          id: "b",
          text: "R$ 80 mil",
          correct: false,
          feedback:
            "Erro: esqueceu a LGD (usou PD × EAD). PE = 8% × 50% × 1.000 = 40 (não 8% × 1.000 = 80).",
        },
        {
          id: "c",
          text: "R$ 5 mil",
          correct: false,
          feedback: "Erro: usou a PD do Empréstimo A (1%). Com a PD de B (8%): 8% × 50% × 1.000 = 40.",
        },
        {
          id: "d",
          text: "R$ 3 mil",
          correct: false,
          feedback: "Erro: essa é a PE do Empréstimo A (1% × 30% × 1.000). A de B é 40.",
        },
      ],
    },
    {
      id: "e2",
      label: "Mecanismo — por que preço E gestão diferentes",
      points: 20,
      prompt: "Por que um empréstimo de alto risco exige preço maior <strong>e</strong> gestão mais intensa?",
      options: [
        {
          id: "a",
          text: "O preço cobre a perda esperada (a média); a gestão (colateral, covenants, monitoramento) trata a perda inesperada (a cauda). PD e LGD são alavancas distintas.",
          correct: true,
          feedback:
            "Precificar a PE protege a média; o desvio acima dela (perda inesperada) é gerido com mitigantes e capital. O colateral ataca a LGD; o score/limite ataca a PD.",
        },
        {
          id: "b",
          text: "Basta cobrar mais; o preço resolve todo o risco.",
          correct: false,
          feedback:
            "Erro: o preço cobre só a perda esperada (média); a perda inesperada (cauda) exige capital e gestão.",
        },
        {
          id: "c",
          text: "Alto risco se gerencia só com mais provisão, não com preço.",
          correct: false,
          feedback:
            "Erro: a provisão cobre a PE, mas o preço também precisa remunerar capital e custos; e a gestão trata a cauda.",
        },
        {
          id: "d",
          text: "Colateral aumenta a PD.",
          correct: false,
          feedback: "Erro: o colateral reduz a LGD (perda dado o default), não a PD. São alavancas diferentes.",
        },
      ],
    },
    {
      id: "e3",
      label: "Síntese — taxa mínima",
      points: 20,
      prompt: "Quais as taxas mínimas dos Empréstimos A e B?",
      options: [
        {
          id: "a",
          text: "A = 14,3%; B = 18,0%",
          correct: true,
          feedback:
            "Taxa = funding + PE% + opex + margem. A = 11 + 0,3 + 1 + 2 = <strong>14,3%</strong>; " +
            "B = 11 + 4,0 + 1 + 2 = <strong>18,0%</strong>. O <em>wedge</em> de 3,7 p.p. é puro risco (ΔPE%).",
        },
        {
          id: "b",
          text: "A = 14,0%; B = 14,0% (igual)",
          correct: false,
          feedback: "Erro: ignorou a diferença de PE%. O risco entra via PE% (0,3% vs 4,0%): A = 14,3%, B = 18,0%.",
        },
        {
          id: "c",
          text: "A = 13,3%; B = 17,0%",
          correct: false,
          feedback: "Erro: esqueceu o opex (1%). A = 14,3%, B = 18,0%.",
        },
        {
          id: "d",
          text: "A = 12,3%; B = 16,0%",
          correct: false,
          feedback: "Erro: faltou a margem-alvo (2%). A = 14,3%, B = 18,0%.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Como tratar o Empréstimo B (alto risco)?",
    branches: [
      {
        id: "A",
        title: "Precificar alto e emprestar sem garantia",
        summary: "Captura a margem do risco, mas carrega a LGD cheia e a cauda.",
        resultado: {
          headline: "Margem alta, cauda exposta",
          caption: "O preço cobre a média, não o evento extremo.",
          metrics: [
            { label: "Taxa", value: "18%", tone: "positive" },
            { label: "LGD", value: "50%", tone: "risk" },
            { label: "Perda inesperada", value: "Alta", tone: "risk" },
          ],
          explanation:
            "Sem mitigantes, a perda inesperada fica por conta do capital — captura a margem do risco, mas fica exposto ao default acima do esperado.",
        },
      },
      {
        id: "B",
        title: "Exigir colateral (corta LGD para ~25%)",
        summary: "PE = 8% × 25% × 1.000 = 20 mil; taxa cai para 16%. Risco gerenciável.",
        resultado: {
          headline: "Risco gerenciável com garantia",
          caption: "Cortar a LGD reduz PE e taxa de uma só vez.",
          metrics: [
            { label: "PE", value: "40 → 20 mil", tone: "positive" },
            { label: "Taxa", value: "18% → 16%", tone: "positive" },
            { label: "Garantia", value: "Exigida", tone: "neutral" },
          ],
          explanation:
            "PE = 8% × 25% × 1.000 = 20 mil; taxa = 11 + 2 + 1 + 2 = 16%. Risco gerenciável, mas depende de garantia e de execução eficaz.",
        },
      },
      {
        id: "C",
        title: "Recusar / reduzir ticket",
        summary: "Elimina o risco, mas abre mão da receita e do relacionamento.",
        resultado: {
          headline: "Risco zero, receita zero",
          caption: "A prudência máxima também tem custo de oportunidade.",
          metrics: [
            { label: "Risco", value: "Zero", tone: "positive" },
            { label: "Receita", value: "Zero", tone: "negative" },
            { label: "Relação", value: "Perdida", tone: "negative" },
          ],
          explanation: "Elimina o risco, mas abre mão da receita e do relacionamento com o tomador.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Mesmo precificando a PE corretamente, qual risco residual permanece?",
    options: [
      {
        id: "a",
        text: "A PE é a perda média, já no preço; o perigo real é a perda inesperada (cauda), coberta por capital e monitoramento — não pelo preço.",
        correct: true,
        feedback:
          "Precificar a média não protege de um default acima do esperado; é para isso que existem capital, colateral e acompanhamento.",
      },
      {
        id: "b",
        text: "Nenhum: se a PE está no preço, o empréstimo está coberto.",
        correct: false,
        feedback: "Erro: o preço cobre a média; a perda inesperada (cauda) não.",
      },
      {
        id: "c",
        text: "O risco residual é só o funding subir.",
        correct: false,
        feedback: "Erro: o risco central é a perda inesperada do crédito, não o custo de funding.",
      },
      {
        id: "d",
        text: "Colateral elimina toda a perda.",
        correct: false,
        feedback:
          "Erro: o colateral reduz a LGD, não zera a perda (execução imperfeita, garantia desvaloriza no estresse).",
      },
    ],
  },
  maxScore: 85,
};

// ===================================================================
// S8.2 — Comitê de Crédito · Apetite de risco (forward)
// ===================================================================
const s8_2: Scenario = {
  id: "s8-2",
  code: "S8.2",
  order: 2,
  title: "Cenários macroeconômicos e apetite de risco",
  protagonist: "Comitê de Crédito",
  difficulty: "avancado",
  estMinutes: 24,
  blurb:
    "O comitê precisa definir quanto originar no segmento-alvo no próximo ano. A PD depende do cenário macro. Quanto a visão forward muda o apetite?",
  archetype: "Apetite de risco — PD esperada (ponderada) define o volume a originar",
  context:
    "O <strong>comitê de crédito</strong> vai definir o <em>apetite de risco</em> do ano para um segmento. A " +
    "<em>PD</em> do segmento depende do cenário macro: <strong>3%</strong> no cenário base, <strong>6%</strong> num " +
    "cenário adverso (recessão). O comitê estima <strong>60%</strong> de probabilidade para o base e " +
    "<strong>40%</strong> para o adverso. O crédito originado <em>agora</em> viverá esse futuro. Sua tarefa: " +
    "calcular a PD relevante (ponderada), traduzi-la em apetite (quanto se pode originar dentro do orçamento de " +
    "perda) e decidir a postura.",
  keyFacts: [
    { label: "PD — cenário base", value: "3%" },
    { label: "PD — cenário adverso", value: "6%", tone: "warning" },
    { label: "Probabilidade — base", value: "60%" },
    { label: "Probabilidade — adverso", value: "40%" },
    { label: "LGD", value: "45%" },
    { label: "Orçamento de PE do ano", value: "R$ 189 mi" },
  ],
  detailBoxLabel: "Cenários macro",
  details: [
    {
      id: "pd",
      title: "PD ponderada pela probabilidade dos cenários",
      columns: ["Cenário", "PD", "Probabilidade", "Contribuição (PD × prob)"],
      rows: [
        { label: "Base", values: ["3%", "60%", "1,8%"] },
        { label: "Adverso", values: ["6%", "40%", "2,4%"] },
        { label: "PD ponderada", values: ["", "", "4,2%"], emphasis: true },
      ],
    },
    {
      id: "apetite",
      title: "Apetite (EAD máx = orçamento ÷ (PD × LGD))",
      columns: ["Premissa de PD", "R$ mi"],
      rows: [
        { label: "Usando PD base (3%)", values: ["14.000"] },
        { label: "Usando PD ponderada (4,2%)", values: ["10.000"], emphasis: true },
        { label: "Usando PD adversa (6%)", values: ["7.000"] },
      ],
      note: "EAD = 189 / (PD × 0,45). A visão forward (4,2%) reduz o apetite de R$ 14 bi (base) para R$ 10 bi.",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Leitura — PD por cenário",
      points: 20,
      prompt: "Qual a PD em cada cenário?",
      options: [
        {
          id: "a",
          text: "Base 3%; adverso 6%",
          correct: true,
          feedback: "Leitura direta dos KeyFacts: cenário base 3%, cenário adverso (recessão) 6%.",
        },
        {
          id: "b",
          text: "Base 6%; adverso 3%",
          correct: false,
          feedback: "Erro: invertido. O cenário adverso tem a PD maior (6%); o base, 3%.",
        },
        {
          id: "c",
          text: "4,5% nos dois (média simples)",
          correct: false,
          feedback: "Erro: são duas PDs distintas (3% e 6%); a média simples ignora as probabilidades.",
        },
        {
          id: "d",
          text: "9% (soma dos cenários)",
          correct: false,
          feedback: "Erro: PDs não se somam; cada cenário tem a sua (3% e 6%).",
        },
      ],
    },
    {
      id: "e2",
      label: "Mecanismo — por que apetite forward",
      points: 20,
      prompt: "Sobre qual PD o apetite deve ser fixado, e por quê?",
      options: [
        {
          id: "a",
          text: "Sobre a PD ponderada pela probabilidade dos cenários — porque o crédito originado hoje viverá o futuro, não o presente benigno.",
          correct: true,
          feedback:
            "Usar só o cenário base superdimensiona o apetite. A PD relevante é a esperada (ponderada), pois a carteira nova atravessa o cenário futuro.",
        },
        {
          id: "b",
          text: "Sobre o melhor cenário (base), para não perder negócios.",
          correct: false,
          feedback: "Erro: isso superdimensiona o apetite e ignora o risco do cenário adverso.",
        },
        {
          id: "c",
          text: "Sobre a PD atual realizada, não cenários.",
          correct: false,
          feedback: "Erro: a PD realizada é olhar para trás; o apetite é forward — a carteira nova viverá o futuro.",
        },
        {
          id: "d",
          text: "Cenários não afetam o apetite, só o preço.",
          correct: false,
          feedback: "Erro: a PD esperada governa tanto preço quanto volume/apetite.",
        },
      ],
    },
    {
      id: "e3",
      label: "Síntese — PD ponderada e apetite",
      points: 20,
      prompt: "Qual a PD ponderada e o apetite (EAD máximo) correspondente?",
      options: [
        {
          id: "a",
          text: "PD 4,2%; apetite R$ 10.000 mi",
          correct: true,
          feedback:
            "PD = 0,6×3% + 0,4×6% = <strong>4,2%</strong>. Apetite = orçamento ÷ (PD × LGD) = " +
            "189 / (0,042 × 0,45) = <strong>R$ 10.000 mi</strong> (vs 14.000 no base).",
        },
        {
          id: "b",
          text: "PD 4,5%; apetite R$ 9.333 mi",
          correct: false,
          feedback: "Erro: usou média simples (4,5%), não a ponderada pelas probabilidades (4,2%).",
        },
        {
          id: "c",
          text: "PD 4,2%; apetite R$ 14.000 mi",
          correct: false,
          feedback:
            "Erro: aplicou a PD ponderada mas dividiu pela PD base. Apetite = 189 / (0,042 × 0,45) = 10.000.",
        },
        {
          id: "d",
          text: "PD 4,2%; apetite R$ 4.500 mi",
          correct: false,
          feedback: "Erro: esqueceu a LGD no denominador (189/0,042). Apetite = 189 / (0,042 × 0,45) = 10.000.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Em que cenário ancorar o apetite?",
    branches: [
      {
        id: "A",
        title: "Ancorar no base (3%) → crescer forte",
        summary: "Maximiza originação na fase boa, mas fica frágil se a recessão vier.",
        resultado: {
          headline: "Crescimento agressivo, balanço frágil",
          caption: "Aposta no cenário benigno persistir.",
          metrics: [
            { label: "Apetite", value: "R$ 14.000 mi", tone: "positive" },
            { label: "Se o adverso vier", value: "Exposto", tone: "risk" },
          ],
          explanation:
            "Maximiza a originação na fase boa, mas a carteira fica frágil se a recessão se materializar.",
        },
      },
      {
        id: "B",
        title: "Ancorar no ponderado (4,2%) → moderar",
        summary: "Alinha o apetite à visão forward; equilíbrio crescimento/prudência.",
        resultado: {
          headline: "Apetite alinhado à visão forward",
          caption: "Cresce menos que o otimista, mais que o pessimista.",
          metrics: [
            { label: "Apetite", value: "R$ 10.000 mi", tone: "neutral" },
            { label: "Crescimento/prudência", value: "Equilíbrio", tone: "positive" },
          ],
          explanation:
            "Alinha o apetite à PD esperada; cresce menos que o otimista e mais que o pessimista.",
        },
      },
      {
        id: "C",
        title: "Ancorar no adverso (6%) → conservador/contracíclico",
        summary: "Máxima resiliência e munição para a recessão, ao custo de volume.",
        resultado: {
          headline: "Resiliência máxima, volume sacrificado",
          caption: "Guarda munição para originar barato na recessão.",
          metrics: [
            { label: "Apetite", value: "R$ 7.000 mi", tone: "positive" },
            { label: "Resiliência", value: "Alta", tone: "positive" },
            { label: "Volume", value: "Abre mão", tone: "negative" },
          ],
          explanation:
            "Máxima resiliência (e munição para a recessão), ao custo de perder participação na fase boa.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual o limite/risco residual de definir apetite por cenários?",
    options: [
      {
        id: "a",
        text: "As probabilidades são estimativas subjetivas (risco de modelo); e há pró-ciclicidade — se todos apertam juntos na piora, aprofundam a recessão.",
        correct: true,
        feedback:
          "O método é tão bom quanto as probabilidades e PDs estimadas; e o comportamento agregado dos bancos amplifica o ciclo.",
      },
      {
        id: "b",
        text: "Nenhum: a ponderação é objetiva e precisa.",
        correct: false,
        feedback: "Erro: probabilidades de cenário são estimativas subjetivas.",
      },
      {
        id: "c",
        text: "O único risco é o adverso não acontecer.",
        correct: false,
        feedback: "Erro: há risco de modelo (probabilidades/PDs erradas) e pró-ciclicidade.",
      },
      {
        id: "d",
        text: "Cenários eliminam o risco da carteira.",
        correct: false,
        feedback: "Erro: ajudam a calibrar o apetite, não eliminam o risco realizado.",
      },
    ],
  },
  maxScore: 85,
};

// ===================================================================
// S8.3 — Banco Recesso · Recessão (damage control)
// ===================================================================
const s8_3: Scenario = {
  id: "s8-3",
  code: "S8.3",
  order: 3,
  title: "A recessão atinge a carteira: damage control",
  protagonist: "Banco Recesso",
  difficulty: "intermediario",
  estMinutes: 22,
  blurb:
    "A recessão chegou e a inadimplência da carteira mais que dobrou. Quanto de provisão adicional, e quais alavancas o banco tem para limitar o dano?",
  archetype: "Recessão — provisão por perda esperada e damage control da carteira",
  context:
    "O <strong>Banco Recesso</strong> tem uma carteira de <strong>R$ 20.000 mi</strong>. Com a recessão, a " +
    "<em>inadimplência</em> (NPL, créditos com 90+ dias de atraso) sobe de <strong>4% para 9%</strong>. A cobertura " +
    "de provisão (PDD ÷ NPL) é de <strong>60%</strong>. Sua tarefa: medir o aumento do crédito problemático, " +
    "entender por que a provisão dispara e calcular o reforço de PDD — para então escolher como controlar o dano.",
  keyFacts: [
    { label: "Carteira de crédito", value: "R$ 20.000 mi" },
    { label: "NPL antes", value: "4%" },
    { label: "NPL na recessão", value: "9%", tone: "warning" },
    { label: "Cobertura (PDD ÷ NPL)", value: "60%" },
  ],
  detailBoxLabel: "Carteira e provisões",
  details: [
    {
      id: "carteira",
      title: "Carteira e provisões (R$ mi)",
      columns: ["Item (R$ mi)", "Antes", "Recessão"],
      rows: [
        { label: "Carteira de crédito", values: ["20.000", "20.000"] },
        { label: "NPL (estoque)", values: ["800", "1.800"] },
        { label: "Provisão (cobertura 60%)", values: ["480", "1.080"] },
        { label: "Provisão adicional (PDD no resultado)", values: ["", "+600"], emphasis: true },
      ],
      note: "A PDD adicional bate no resultado e, por consequência, no capital (gancho com o módulo de regulação de capital).",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Leitura — crédito problemático",
      points: 20,
      prompt: "De quanto é o aumento do estoque de NPL com a recessão?",
      options: [
        {
          id: "a",
          text: "+R$ 1.000 mi",
          correct: true,
          feedback:
            "NPL antes = 4% × 20.000 = 800; na recessão = 9% × 20.000 = 1.800; " +
            "aumento = 1.800 − 800 = <strong>R$ 1.000 mi</strong>.",
        },
        {
          id: "b",
          text: "+R$ 1.800 mi",
          correct: false,
          feedback: "Erro: confundiu o estoque pós-recessão (1.800) com o aumento. Aumento = 1.800 − 800 = 1.000.",
        },
        {
          id: "c",
          text: "+R$ 500 mi",
          correct: false,
          feedback: "Erro: usou metade da variação. Δ = (9% − 4%) × 20.000 = 5% × 20.000 = 1.000.",
        },
        {
          id: "d",
          text: "+R$ 2.600 mi",
          correct: false,
          feedback: "Erro: somou as taxas (9% + 4%). Usar a diferença (5 p.p.): Δ = 1.000.",
        },
      ],
    },
    {
      id: "e2",
      label: "Mecanismo — por que a provisão dispara",
      points: 20,
      prompt: "Por que a recessão dispara a provisão?",
      options: [
        {
          id: "a",
          text: "Sobe a PD (mais defaults) e a LGD (garantias valem menos) → a perda esperada salta → a PDD bate no resultado e no capital.",
          correct: true,
          feedback:
            "A recessão move as duas alavancas da PE: mais inadimplência (PD) e menor recuperação das garantias (LGD).",
        },
        {
          id: "b",
          text: "Só a PD muda; a LGD é fixa.",
          correct: false,
          feedback: "Erro: na recessão o valor das garantias cai, elevando também a LGD.",
        },
        {
          id: "c",
          text: "A provisão sobe porque a carteira cresceu.",
          correct: false,
          feedback: "Erro: a carteira é estável (20.000); o que sobe é a inadimplência, não o tamanho.",
        },
        {
          id: "d",
          text: "A provisão não afeta o capital.",
          correct: false,
          feedback: "Erro: a PDD reduz o resultado e, por consequência, o capital.",
        },
      ],
    },
    {
      id: "e3",
      label: "Síntese — provisão adicional",
      points: 20,
      prompt: "Qual a provisão adicional necessária?",
      options: [
        {
          id: "a",
          text: "R$ 600 mi",
          correct: true,
          feedback:
            "ΔPDD = (NPL_pós − NPL_pré) × cobertura = (1.800 − 800) × 60% = 1.000 × 60% = <strong>R$ 600 mi</strong>.",
        },
        {
          id: "b",
          text: "R$ 1.000 mi",
          correct: false,
          feedback: "Erro: não aplicou a cobertura (60%). Provisão adicional = 1.000 × 60% = 600.",
        },
        {
          id: "c",
          text: "R$ 1.080 mi",
          correct: false,
          feedback: "Erro: 1.080 é o estoque de provisão pós-recessão; o adicional é 1.080 − 480 = 600.",
        },
        {
          id: "d",
          text: "R$ 480 mi",
          correct: false,
          feedback: "Erro: 480 é a provisão antes da recessão; o adicional é 600.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Qual alavanca de damage control acionar?",
    branches: [
      {
        id: "A",
        title: "Apertar originação + intensificar cobrança",
        summary: "Defende o balanço organicamente, mas o aperto excessivo é pró-cíclico.",
        resultado: {
          headline: "Defesa orgânica, risco pró-cíclico",
          caption: "Estancar o fluxo novo pode aprofundar a recessão.",
          metrics: [
            { label: "Fluxo novo", value: "Estancado", tone: "positive" },
            { label: "Recuperação", value: "Gradual", tone: "neutral" },
            { label: "Pró-ciclicidade", value: "Sufoca bons", tone: "risk" },
          ],
          explanation:
            "Defende o balanço organicamente, mas o aperto excessivo aprofunda a recessão e perde bons clientes.",
        },
      },
      {
        id: "B",
        title: "Reestruturar/renegociar em escala",
        summary: "Dá fôlego ao tomador e reduz a NPL, mas pode virar extend-and-pretend.",
        resultado: {
          headline: "Fôlego ao tomador, perda adiada?",
          caption: "Cura parte da NPL — ou só empurra a perda.",
          metrics: [
            { label: "NPL", value: "Cura parte", tone: "positive" },
            { label: "Provisão", value: "Alivia", tone: "positive" },
            { label: "Risco", value: "Adiar a perda", tone: "risk" },
          ],
          explanation:
            "Dá fôlego ao tomador e reduz a NPL, mas vira <em>extend-and-pretend</em> se ele não recupera.",
        },
      },
      {
        id: "C",
        title: "Vender a carteira de NPL (distressed / FIDC NPL)",
        summary: "Limpa o balanço já, mas realiza a perda a um forte desconto.",
        resultado: {
          headline: "Balanço limpo, perda realizada",
          caption: "Caixa imediato ao custo de um deságio pesado.",
          metrics: [
            { label: "Balanço", value: "Limpa já", tone: "positive" },
            { label: "Perda", value: "Realiza c/ desconto", tone: "negative" },
            { label: "Caixa", value: "Imediato", tone: "neutral" },
          ],
          explanation:
            "Tira o problema do balanço e libera gestão, mas vende a um forte desconto sobre o valor de face.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual o risco residual das alavancas de damage control?",
    options: [
      {
        id: "a",
        text: "Reestruturar pode virar extend-and-pretend se o tomador não recupera; vender NPL realiza a perda barata; e apertar demais a originação aprofunda a própria recessão.",
        correct: true,
        feedback: "Cada alavanca tem um custo escondido: adiamento, desconto na venda, ou pró-ciclicidade.",
      },
      {
        id: "b",
        text: "Nenhum: reestruturar resolve a inadimplência.",
        correct: false,
        feedback: "Erro: pode só adiar a perda se o tomador não recupera.",
      },
      {
        id: "c",
        text: "Vender NPL recupera o valor de face.",
        correct: false,
        feedback: "Erro: a venda é com forte desconto — realiza a perda.",
      },
      {
        id: "d",
        text: "Apertar a originação não tem efeito colateral.",
        correct: false,
        feedback: "Erro: aperto excessivo é pró-cíclico e sufoca bons tomadores.",
      },
    ],
  },
  maxScore: 85,
};

// ===================================================================
// S8.4 — Carteira Espelho · Concentração (perda inesperada)
// ===================================================================
const s8_4: Scenario = {
  id: "s8-4",
  code: "S8.4",
  order: 4,
  title: "Concentração: a perda que a PE não enxerga",
  protagonist: "Carteira Espelho",
  difficulty: "avancado",
  estMinutes: 24,
  blurb:
    "Duas carteiras, mesma perda esperada, riscos opostos. Por que a concentração torna uma delas muito mais perigosa — e o que fazer a respeito?",
  archetype: "Concentração — perda inesperada que a PE média não captura",
  context:
    "Você compara duas carteiras de <strong>R$ 5.000 mi</strong>, ambas com <em>PD</em> média <strong>4%</strong> e " +
    "<em>LGD</em> <strong>50%</strong> — logo, a mesma <em>perda esperada</em>. A <strong>Carteira " +
    "Diversificada</strong> tem 500 tomadores de R$ 10 mi; a <strong>Carteira Concentrada</strong> tem 10 tomadores " +
    "de R$ 500 mi. Sua tarefa: mostrar que a PE é idêntica, entender por que o risco não é, e quantificar o pior " +
    "caso de um único cliente — para então decidir a política de concentração.",
  keyFacts: [
    { label: "Tamanho (cada carteira)", value: "R$ 5.000 mi" },
    { label: "PD média", value: "4%" },
    { label: "LGD", value: "50%" },
    { label: "Diversificada", value: "500 × R$ 10 mi" },
    { label: "Concentrada", value: "10 × R$ 500 mi", tone: "warning" },
  ],
  detailBoxLabel: "Comparativo de carteiras",
  details: [
    {
      id: "comparativo",
      title: "Comparativo de carteiras",
      columns: ["Métrica", "Diversificada", "Concentrada"],
      rows: [
        { label: "Nº de tomadores", values: ["500", "10"] },
        { label: "Maior exposição", values: ["R$ 10 mi", "R$ 500 mi"] },
        { label: "Perda esperada PE", values: ["R$ 100 mi", "R$ 100 mi"] },
        { label: "Pior caso de 1 nome (exp × LGD)", values: ["R$ 5 mi", "R$ 250 mi"] },
        { label: "Pior caso ÷ PE", values: ["5%", "2,5×"], emphasis: true },
      ],
      note: "PE = 4% × 50% × 5.000 = 100 (igual nas duas). A diferença está na perda inesperada, que a PE não captura.",
    },
  ],
  etapas: [
    {
      id: "e1",
      label: "Leitura — perda esperada das carteiras",
      points: 20,
      prompt: "Qual a perda esperada de cada carteira?",
      options: [
        {
          id: "a",
          text: "R$ 100 mi nas duas (idêntica)",
          correct: true,
          feedback:
            "PE = PD × LGD × EAD = 4% × 50% × 5.000 = <strong>R$ 100 mi</strong> — igual nas duas, pois PD, LGD e tamanho são iguais.",
        },
        {
          id: "b",
          text: "Diversificada 100; Concentrada 250",
          correct: false,
          feedback:
            "Erro: confundiu PE com o pior caso. A PE é igual (100); 250 é a perda de um único grande nome na concentrada.",
        },
        {
          id: "c",
          text: "R$ 200 mi cada",
          correct: false,
          feedback: "Erro: esqueceu a LGD. PE = 4% × 50% × 5.000 = 100 (não 4% × 5.000 = 200).",
        },
        {
          id: "d",
          text: "Não dá para calcular a PE da concentrada",
          correct: false,
          feedback:
            "Erro: a PE calcula-se igual (PD × LGD × EAD) = 100; o que difere é a perda inesperada, não a PE.",
        },
      ],
    },
    {
      id: "e2",
      label: "Mecanismo — mesma PE, risco diferente",
      points: 20,
      prompt: "Por que carteiras com a mesma PE têm riscos diferentes?",
      options: [
        {
          id: "a",
          text: "A PE é a média; ignora correlação e granularidade. A concentração eleva a perda inesperada — um único default grande é catastrófico frente à PE.",
          correct: true,
          feedback:
            "A PE mede a média esperada; a dispersão em torno dela (perda inesperada) é muito maior quando poucos nomes concentram a exposição.",
        },
        {
          id: "b",
          text: "Não há diferença: PE igual = risco igual.",
          correct: false,
          feedback: "Erro: a PE é a média; a perda inesperada (dispersão) é muito maior na concentrada.",
        },
        {
          id: "c",
          text: "A concentrada é menos arriscada (menos nomes para monitorar).",
          correct: false,
          feedback: "Erro: menos nomes significa mais risco de concentração — cada default pesa muito mais.",
        },
        {
          id: "d",
          text: "A diferença é só a LGD.",
          correct: false,
          feedback: "Erro: a LGD é igual (50%); a diferença é a granularidade/concentração das exposições.",
        },
      ],
    },
    {
      id: "e3",
      label: "Síntese — pior caso de um nome",
      points: 20,
      prompt: "Qual a perda se o maior tomador de cada carteira der default?",
      options: [
        {
          id: "a",
          text: "Concentrada R$ 250 mi (2,5× a PE); Diversificada R$ 5 mi (5% da PE)",
          correct: true,
          feedback:
            "Concentrada: 500 × 50% = <strong>R$ 250 mi</strong> = 2,5× a PE total (100). " +
            "Diversificada: 10 × 50% = <strong>R$ 5 mi</strong> = 5% da PE.",
        },
        {
          id: "b",
          text: "Concentrada R$ 500 mi",
          correct: false,
          feedback: "Erro: esqueceu a LGD. Perda = exposição × LGD = 500 × 50% = 250.",
        },
        {
          id: "c",
          text: "Concentrada R$ 100 mi (= a PE)",
          correct: false,
          feedback: "Erro: o pior caso de um nome (250) excede a PE total (100) em 2,5×.",
        },
        {
          id: "d",
          text: "Diversificada R$ 250 mi",
          correct: false,
          feedback: "Erro: usou a exposição da concentrada. Na diversificada o maior nome é R$ 10 mi → perda 5 mi.",
        },
      ],
    },
  ],
  encruzilhada: {
    prompt: "Que política adotar para a Carteira Concentrada?",
    branches: [
      {
        id: "A",
        title: "Aceitar a concentração pela margem",
        summary: "Grandes clientes trazem margem, mas um único default ameaça o ano.",
        resultado: {
          headline: "Margem alta, cauda perigosa",
          caption: "Um único default pode levar o resultado do ano.",
          metrics: [
            { label: "Relação e receita", value: "Altas", tone: "positive" },
            { label: "Cauda", value: "Perigosa", tone: "risk" },
          ],
          explanation:
            "Grandes clientes trazem margem e relacionamento, mas um único default ameaça o resultado do ano.",
        },
      },
      {
        id: "B",
        title: "Impor limites e diversificar",
        summary: "Limites de single-name e setoriais cortam a cauda, mas podem afastar bons negócios.",
        resultado: {
          headline: "Cauda cortada, oportunidade perdida?",
          caption: "Granularidade protege, mas limites rígidos custam.",
          metrics: [
            { label: "Perda inesperada", value: "Cortada", tone: "positive" },
            { label: "Granularidade", value: "Maior", tone: "neutral" },
            { label: "Bons negócios", value: "Pode expulsar", tone: "negative" },
          ],
          explanation:
            "Limites de single-name e setoriais reduzem a cauda, mas podem afastar relações rentáveis.",
        },
      },
      {
        id: "C",
        title: "Transferir a concentração",
        summary: "Seguro de crédito, sindicalização ou securitização: divide a exposição sem perder a relação, ao custo do prêmio/deságio.",
        resultado: {
          headline: "Mantém o cliente, divide a cauda",
          caption: "Transfere o risco ao custo do hedge.",
          metrics: [
            { label: "Cliente", value: "Mantido", tone: "positive" },
            { label: "Cauda", value: "Reduzida", tone: "positive" },
            { label: "Hedge", value: "Tem custo", tone: "neutral" },
          ],
          explanation:
            "Divide ou segura a exposição sem perder a relação, ao custo do prêmio/deságio da transferência.",
        },
      },
    ],
  },
  reflexao: {
    points: 25,
    prompt: "Qual o limite da diversificação?",
    options: [
      {
        id: "a",
        text: "Diversificar elimina o risco idiossincrático, não o sistêmico — uma recessão ampla atinge todos juntos; e limites rígidos podem tirar o banco de bons negócios.",
        correct: true,
        feedback:
          "Granularidade protege de um default isolado, mas não de um choque correlacionado que eleva a PD de toda a carteira.",
      },
      {
        id: "b",
        text: "Nenhum: diversificar elimina todo o risco.",
        correct: false,
        feedback: "Erro: elimina o idiossincrático, não o sistêmico (recessão ampla).",
      },
      {
        id: "c",
        text: "Concentração não tem relação com recessão.",
        correct: false,
        feedback: "Erro: na recessão (risco sistêmico) até a diversificada sofre; a concentração agrava.",
      },
      {
        id: "d",
        text: "Limites de concentração não têm custo.",
        correct: false,
        feedback: "Erro: podem expulsar relações rentáveis (custo de oportunidade).",
      },
    ],
  },
  maxScore: 85,
};

export const scenarios: Scenario[] = [s8_1, s8_2, s8_3, s8_4];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
