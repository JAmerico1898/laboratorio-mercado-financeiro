import type { Scenario } from "./types";

// Conteúdo integral dos 5 cenários (spec §10). Números internamente consistentes.
// A encruzilhada é decisão (0 pts). Pontuação: 3 etapas × 20 + reflexão 25 = 85.

export const scenarios: Scenario[] = [
  // ====================== S5.1 ======================
  {
    id: "s5-1",
    code: "S5.1",
    order: 1,
    title: "Credenciadora PagSeg: antecipação, cessão e a economia da subordinação",
    difficulty: "intermediario",
    estMinutes: 20,
    archetype: "mono cedente / multi sacado",
    blurb:
      "Quanto caixa uma credenciadora realmente recupera ao ceder recebíveis a um FIDC — e qual o efeito da subordinação retida.",
    context:
      "Você é analista de tesouraria da <strong>PagSeg Adquirência S.A.</strong>, credenciadora de cartões. A empresa antecipa recebíveis aos lojistas e financia essa operação cedendo os recebíveis a um <strong>FIDC mono cedente / multi sacado</strong>. O CFO quer entender quanto caixa a estrutura realmente devolve e qual o efeito da <em>subordinação</em> retida.",
    keyFacts: [
      { label: "Estrutura", value: "FIDC mono cedente / multi sacado" },
      { label: "Recebível (face, D+30)", value: "R$ 97,50 / unidade" },
      { label: "Antecipação paga ao lojista", value: "R$ 95,50" },
      { label: "Preço de cessão ao FIDC", value: "R$ 96,50" },
      { label: "Subordinação retida", value: "20%", tone: "warning" },
      { label: "Volume mensal antecipado", value: "R$ 800 M" },
      { label: "Devedor do recebível", value: "arranjo / emissores (pulverizado)", tone: "positive" },
      { label: "Retenção da subordinada", value: "pela própria PagSeg (cedente)" },
    ],
    statements: [
      {
        id: "fluxo",
        title: "Fluxo de uma operação (por recebível)",
        columns: ["Etapa do fluxo", "Valor (R$)"],
        rows: [
          { label: "Compra no crédito (face bruta)", values: ["100,00"] },
          { label: "MDR retido no arranjo", values: ["(2,50)"] },
          { label: "Recebível do lojista (face, D+30)", values: ["97,50"] },
          { label: "Antecipação paga ao lojista (hoje)", values: ["95,50"] },
          { label: "Preço de cessão ao FIDC (hoje)", values: ["96,50"], emphasis: true },
        ],
      },
      {
        id: "cotas",
        title: "Estrutura de cotas do FIDC (por R$ 96,50 de PL)",
        columns: ["Cota", "%", "Valor (R$)", "Detentor"],
        rows: [
          { label: "Sênior", values: ["80%", "77,20", "investidores"] },
          { label: "Subordinada", values: ["20%", "19,30", "PagSeg (cedente)"], emphasis: true },
        ],
      },
    ],
    etapas: [
      {
        id: "etapa-1",
        label: "Etapa 1 — Caixa novo na cessão",
        prompt:
          "Com subordinação de 20% e preço de cessão de R$ 96,50, quanto de <strong>caixa novo</strong> (de terceiros) a PagSeg recupera por recebível cedido?",
        points: 20,
        options: [
          {
            id: "a",
            text: "R$ 96,50 — o preço integral de cessão",
            correct: false,
            feedback:
              "Ignora que 20% é capital próprio retido: a subordinada (R$ 19,30) é dinheiro da PagSeg voltando ao fundo, não caixa de terceiros.",
          },
          {
            id: "b",
            text: "R$ 77,20 — apenas a fatia sênior",
            correct: true,
            feedback:
              "Dos R$ 96,50, só a <strong>cota sênior (80% × 96,50 = R$ 77,20)</strong> é caixa de terceiros. Os 20% (R$ 19,30) a PagSeg integraliza como <strong>cota subordinada retida</strong> — é dinheiro dela voltando ao fundo. <em>Caixa novo recuperado ≈ R$ 77,20, não os R$ 96,50 cheios.</em>",
          },
          {
            id: "c",
            text: "R$ 19,30 — apenas a subordinada",
            correct: false,
            feedback:
              "Confunde a parte retida com o caixa recebido: a subordinada é capital próprio, não o caixa de terceiros.",
          },
          {
            id: "d",
            text: "R$ 95,50 — o valor pago ao lojista",
            correct: false,
            feedback: "É o desembolso da antecipação ao lojista, não o caixa que a cessão devolve.",
          },
        ],
      },
      {
        id: "etapa-2",
        label: "Etapa 2 — Capital efetivamente comprometido",
        prompt:
          "A PagSeg pagou R$ 95,50 ao lojista e recuperou R$ 77,20 de caixa sênior. Qual o <strong>capital líquido</strong> que permanece comprometido na operação?",
        points: 20,
        options: [
          {
            id: "a",
            text: "R$ 19,30 — exatamente a subordinada",
            correct: false,
            feedback:
              "Quase: ignora a margem já realizada. O caixa líquido comprometido é 95,50 − 77,20 = R$ 18,30; a subordinada (R$ 19,30) excede isso em R$ 1,00 — a margem de cessão.",
          },
          {
            id: "b",
            text: "R$ 18,30 — caixa líquido comprometido (95,50 − 77,20)",
            correct: true,
            feedback:
              "Fluxo da operação: <strong>−95,50</strong> (lojista) <strong>+77,20</strong> (sênior) = <strong>−R$ 18,30</strong> de caixa comprometido, <em>mais</em> a cota subordinada de R$ 19,30 que ela carrega. A diferença (19,30 − 18,30 = R$ 1,00) é exatamente a <strong>margem de cessão já realizada</strong> (96,50 − 95,50). O capital preso por operação ≈ o tamanho da subordinação.",
          },
          {
            id: "c",
            text: "R$ 1,00 — apenas a margem",
            correct: false,
            feedback: "R$ 1,00 é a margem de cessão (96,50 − 95,50), não o capital comprometido.",
          },
          {
            id: "d",
            text: "R$ 0 — o capital girou integralmente",
            correct: false,
            feedback:
              "O capital não girou por inteiro: a fatia sênior voltou, mas a subordinada (≈ R$ 18,30 líquidos) segue presa.",
          },
        ],
      },
      {
        id: "etapa-3",
        label: "Etapa 3 — Os dois “R$ 1,00”",
        prompt:
          "A margem de cessão (96,50 − 95,50 = R$ 1,00) é repartida com a cota sênior?",
        points: 20,
        options: [
          {
            id: "a",
            text: "Sim — o sênior recebe parte dessa margem como remuneração",
            correct: false,
            feedback:
              "Não. O sênior é remunerado pelo <em>carrego</em> (face − preço = 97,50 − 96,50), não pela margem de cessão.",
          },
          {
            id: "b",
            text: "Não — essa margem é 100% da PagSeg; o sênior é pago pelo <em>carrego</em> (97,50 − 96,50), não por ela",
            correct: true,
            feedback:
              "São <strong>dois R$ 1,00 distintos</strong> que coincidem nos números: <strong>(A) margem de cessão</strong> = preço − custo = 96,50 − 95,50, realizada no t0, 100% da cedente; <strong>(B) carrego do fundo</strong> = face − preço = 97,50 − 96,50, ganho do t0 ao D+30, repartido — <strong>sênior (yield) primeiro, subordinada (residual) depois</strong>. O sênior é pago a partir de (B), nunca de (A).",
          },
          {
            id: "c",
            text: "Sim — é dela que sai todo o rendimento do fundo",
            correct: false,
            feedback: "O rendimento do fundo vem do carrego (B), não da margem de cessão (A).",
          },
          {
            id: "d",
            text: "Não — porque o sênior não tem remuneração",
            correct: false,
            feedback:
              "O sênior tem, sim, remuneração — paga pelo carrego (97,50 − 96,50), não pela margem de cessão.",
          },
        ],
      },
    ],
    encruzilhada: {
      prompt:
        "Defina o nível de subordinação. Cada nível equilibra giro de capital, custo do sênior e tratamento contábil de forma diferente.",
      branches: [
        {
          id: "A",
          title: "Subordinação 10%",
          summary:
            "Reter menos: cada R$ 1 de capital sustenta R$ 10 de carteira (alavancagem 10×). Mais giro, mais volume.",
          resultado: {
            headline: "Giro máximo, sênior mais caro e colchão fino",
            caption: "Caminho A — Subordinação 10%",
            metrics: [
              { label: "Alavancagem", value: "10×", tone: "positive" },
              { label: "Caixa recuperado/un.", value: "R$ 86,85", tone: "positive" },
              { label: "Custo do sênior", value: "↑ maior", tone: "risk" },
              { label: "Desreconhecimento", value: "provável OK", tone: "neutral" },
            ],
            explanation:
              "Mais volume, mas o sênior exige prêmio por colchão menor; estrutura sensível a um pico de perdas.",
          },
        },
        {
          id: "B",
          title: "Subordinação 20%",
          summary: "Equilíbrio: alavancagem 5×; colchão confortável para o sênior.",
          resultado: {
            headline: "Equilíbrio entre giro e proteção",
            caption: "Caminho B — Subordinação 20%",
            metrics: [
              { label: "Alavancagem", value: "5×", tone: "neutral" },
              { label: "Caixa recuperado/un.", value: "R$ 77,20", tone: "positive" },
              { label: "Custo do sênior", value: "médio", tone: "neutral" },
              { label: "Desreconhecimento", value: "OK", tone: "positive" },
            ],
            explanation: "Padrão de mercado para recebível de cartão pulverizado.",
          },
        },
        {
          id: "C",
          title: "Subordinação 35%",
          summary:
            "Reter mais: sênior muito seguro e barato, porém alavancagem ~2,9× e risco contábil.",
          resultado: {
            headline: "Sênior barato, mas capital travado e risco contábil",
            caption: "Caminho C — Subordinação 35%",
            metrics: [
              { label: "Alavancagem", value: "2,9×", tone: "negative" },
              { label: "Caixa recuperado/un.", value: "R$ 62,73", tone: "negative" },
              { label: "Custo do sênior", value: "baixo", tone: "positive" },
              { label: "Desreconhecimento", value: "em risco", tone: "risk" },
            ],
            explanation:
              "Reter risco demais pode impedir a transferência substancial e manter o ativo no balanço.",
          },
        },
      ],
    },
    reflexao: {
      prompt: "Qual o maior risco de reter subordinação alta demais (caminho C)?",
      points: 25,
      options: [
        {
          id: "a",
          text: "Impedir o desreconhecimento contábil — o ativo permanece no balanço e o alívio de capital desaparece",
          correct: true,
          feedback:
            "Subordinação muito alta significa <strong>reter substancialmente os riscos e benefícios</strong> — o que pode descaracterizar a venda definitiva (<em>true sale</em>), obrigando a manter o recebível no balanço. Some o alívio de capital que motivou a estrutura, além de travar mais caixa. Existe um ponto ótimo: subordinação suficiente para baratear o sênior, baixa o bastante para desreconhecer.",
        },
        {
          id: "b",
          text: "O sênior fica caro demais",
          correct: false,
          feedback:
            "Ao contrário — com mais subordinação o sênior fica <em>mais barato</em>. O problema é contábil, não o custo do sênior.",
        },
        {
          id: "c",
          text: "O lojista deixa de antecipar",
          correct: false,
          feedback: "A decisão de subordinação não afeta a antecipação ao lojista.",
        },
        {
          id: "d",
          text: "Nenhum — quanto mais subordinação, sempre melhor",
          correct: false,
          feedback:
            "Há, sim, um custo: mais subordinação trava caixa e ameaça o desreconhecimento contábil.",
        },
      ],
    },
    maxScore: 85,
  },

  // ====================== S5.2 ======================
  {
    id: "s5-2",
    code: "S5.2",
    order: 2,
    title: "Risco sacado: FIDC Fornecedores VarejoMax",
    difficulty: "intermediario",
    estMinutes: 22,
    archetype: "multi cedente / mono sacado",
    blurb:
      "120 fornecedores cedem recebíveis de uma única varejista. Diversificar cedentes dilui o risco de crédito? Onde ele realmente está?",
    context:
      "A <strong>VarejoMax S.A.</strong> é uma grande varejista (o <strong>sacado-âncora</strong>). Cerca de <strong>120 fornecedores</strong> cedem a um FIDC os recebíveis que têm a receber da VarejoMax — um arranjo de <em>reverse factoring</em>. Você analisa onde está, de fato, o risco do fundo.",
    keyFacts: [
      { label: "Estrutura", value: "multi cedente / mono sacado" },
      { label: "Sacado único", value: "VarejoMax S.A.", tone: "warning" },
      { label: "Rating do sacado", value: "AA− (escala nacional)", tone: "positive" },
      { label: "Nº de cedentes (fornecedores)", value: "~120" },
      { label: "Prazo médio", value: "60 dias" },
      { label: "Sênior", value: "CDI + 3%" },
      { label: "Subordinação", value: "8%" },
      { label: "Confirmação do sacado", value: "sim (reverse factoring confirmado)", tone: "positive" },
      { label: "Concentração de crédito", value: "100% no sacado", tone: "warning" },
    ],
    statements: [
      {
        id: "regulamento",
        title: "Regulamento (limites e gatilhos)",
        columns: ["Item", "Regra"],
        rows: [
          { label: "Limite por cedente", values: ["5%"] },
          { label: "Limite por sacado", values: ["sem limite (mono)"] },
          {
            label: "Gatilho de amortização antecipada",
            values: ["se o rating do sacado cair abaixo de A−"],
          },
        ],
      },
      {
        id: "carteira",
        title: "Carteira por cedente",
        columns: ["Item", "Detalhe"],
        rows: [
          {
            label: "Maiores fornecedores",
            values: ["todos abaixo do limite de 5% por cedente"],
          },
        ],
        note: "Concentração de originação dispersa; o devedor final, porém, é único.",
      },
      {
        id: "credito-sacado",
        title: "Perfil de crédito da VarejoMax",
        columns: ["Indicador", "Leitura"],
        rows: [
          { label: "Alavancagem / cobertura de juros", values: ["o verdadeiro lastro do fundo"] },
          { label: "Liquidez / rating", values: ["AA− (escala nacional)"] },
        ],
      },
    ],
    etapas: [
      {
        id: "etapa-1",
        label: "Etapa 1 — Onde está o risco de crédito?",
        prompt:
          "Com 120 cedentes e um único sacado, onde se concentra o risco de crédito da carteira?",
        points: 20,
        options: [
          {
            id: "a",
            text: "Concentrado no sacado único (VarejoMax) — diversificar cedentes <em>não</em> dilui crédito",
            correct: true,
            feedback:
              "Os recebíveis são todos <strong>devidos pela VarejoMax</strong>. Multiplicar cedentes dispersa a <em>originação</em>, mas o devedor final é o mesmo nome — a carteira vale o que vale o <strong>crédito do sacado-âncora</strong>. Não há diluição de crédito.",
          },
          {
            id: "b",
            text: "Diluído entre os 120 cedentes",
            correct: false,
            feedback:
              "Os cedentes apenas originam; quem paga é a VarejoMax. Diversificar cedentes não dilui o crédito de um devedor único.",
          },
          {
            id: "c",
            text: "Nos fornecedores, pois são quem origina",
            correct: false,
            feedback:
              "Originação ≠ crédito. O risco de pagamento está no sacado que deve honrar, não em quem cedeu.",
          },
          {
            id: "d",
            text: "É risco de mercado, não de crédito",
            correct: false,
            feedback:
              "Não há exposição a preço/taxa relevante aqui; é risco de o devedor (VarejoMax) pagar — risco de crédito.",
          },
        ],
      },
      {
        id: "etapa-2",
        label: "Etapa 2 — Efeito da confirmação (reverse factoring)",
        prompt:
          "O que muda quando a VarejoMax <strong>confirma</strong> formalmente as dívidas cedidas?",
        points: 20,
        options: [
          {
            id: "a",
            text: "Converte o recebível em quase-crédito direto do sacado, removendo risco comercial/disputa do fornecedor",
            correct: true,
            feedback:
              "Com a confirmação, some o risco de o fornecedor não ter entregue/haver disputa comercial — o crédito passa a ser, em essência, uma <strong>obrigação direta da VarejoMax</strong>. O risco do fundo converge para o <strong>balanço do sacado</strong>.",
          },
          {
            id: "b",
            text: "Elimina completamente o risco de crédito",
            correct: false,
            feedback:
              "Remove o risco comercial/de disputa, mas <em>não</em> o risco de a VarejoMax quebrar — esse permanece.",
          },
          {
            id: "c",
            text: "Transfere o risco de volta ao fornecedor",
            correct: false,
            feedback:
              "É o oposto: a confirmação afasta o fornecedor do risco e fixa a obrigação no sacado.",
          },
          {
            id: "d",
            text: "Não muda nada — confirmação é formalidade",
            correct: false,
            feedback:
              "Muda o caráter do crédito: de recebível comercial sujeito a disputa para obrigação direta do sacado.",
          },
        ],
      },
      {
        id: "etapa-3",
        label: "Etapa 3 — A subordinação protege contra o default do sacado?",
        prompt: "Os 8% de subordinação protegem o sênior contra a quebra da VarejoMax?",
        points: 20,
        options: [
          {
            id: "a",
            text: "Sim — absorve integralmente o default do sacado",
            correct: false,
            feedback:
              "Um default do sacado atinge toda a carteira de uma vez; 8% não cobrem um evento sistêmico — somem rapidamente.",
          },
          {
            id: "b",
            text: "Não contra o evento de crédito do sacado (sistêmico à carteira); só absorve atrasos/perdas parciais e risco dos cedentes",
            correct: true,
            feedback:
              "Se a VarejoMax dá <em>default</em>, a perda atinge <strong>toda</strong> a carteira de uma vez — os 8% somem rapidamente. A subordinação cobre <strong>perdas parciais, atrasos e risco dos cedentes</strong>; contra o evento de um único devedor, o que importa é o <strong>rating do sacado</strong>, não a espessura do colchão.",
          },
          {
            id: "c",
            text: "Sim, em até 8% do default",
            correct: false,
            feedback:
              "O default do sacado não é uma perda fracionada de 8%: é sistêmico à carteira inteira.",
          },
          {
            id: "d",
            text: "Sim, porque o rating é AA−",
            correct: false,
            feedback:
              "O rating alto reduz a probabilidade do evento, mas não faz a subordinação de 8% cobrir um default total.",
          },
        ],
      },
    ],
    encruzilhada: {
      prompt: "Como tratar o risco do sacado-âncora?",
      branches: [
        {
          id: "A",
          title: "Aumentar subordinação para 15%",
          summary: "Mais colchão; custa retorno do sênior; não ataca o risco mono-nome.",
          resultado: {
            headline: "Mais colchão, mesmo risco de nome",
            caption: "Caminho A — Subordinação 8% → 15%",
            metrics: [
              { label: "Subordinação", value: "8% → 15%", tone: "neutral" },
              { label: "Retorno do sênior", value: "↓", tone: "negative" },
              { label: "Proteção vs default do sacado", value: "~nenhuma", tone: "risk" },
              { label: "Custo de capital", value: "↑", tone: "negative" },
            ],
            explanation:
              "Subordinação absorve perdas parciais, não o evento sistêmico de um único devedor.",
          },
        },
        {
          id: "B",
          title: "Exigir confirmação + limite/cedente + gatilho de rating",
          summary: "Mitiga performance e cria porta de saída se o rating cair.",
          resultado: {
            headline: "Mitiga performance e cria porta de saída",
            caption: "Caminho B — Controles contratuais",
            metrics: [
              { label: "Risco de disputa", value: "↓", tone: "positive" },
              { label: "Limite/cedente", value: "5%", tone: "positive" },
              { label: "Gatilho de rating", value: "ativo", tone: "positive" },
              { label: "Risco mono-nome", value: "remanescente", tone: "risk" },
            ],
            explanation:
              "Melhora a qualidade e antecipa amortização se a VarejoMax for rebaixada — mas a exposição final continua sendo ao nome.",
          },
        },
        {
          id: "C",
          title: "Contratar seguro de crédito sobre o sacado",
          summary: "Transfere o evento de default a um terceiro, com custo.",
          resultado: {
            headline: "Transfere o risco mono-nome (com custo)",
            caption: "Caminho C — Seguro de crédito",
            metrics: [
              { label: "Risco de crédito", value: "transferido", tone: "positive" },
              { label: "Custo do seguro", value: "↓ retorno", tone: "negative" },
              { label: "Risco de contraparte do segurador", value: "presente", tone: "risk" },
              { label: "Spread líquido", value: "↓", tone: "negative" },
            ],
            explanation:
              "Única alavanca que ataca diretamente o <em>default</em> do sacado; o preço corrói o spread.",
          },
        },
      ],
    },
    reflexao: {
      prompt: "Qual é o maior risco residual deste fundo?",
      points: 25,
      options: [
        {
          id: "a",
          text: "Rebaixamento/default do sacado-âncora — a diversificação de cedentes não ajuda",
          correct: true,
          feedback:
            "É uma exposição <strong>mono-nome</strong>: tudo depende da VarejoMax honrar. Pulverizar cedentes só dispersa originação; o crédito é um só. O acompanhamento central é o <strong>rating/saúde do sacado</strong> e os gatilhos que dão saída antecipada.",
        },
        {
          id: "b",
          text: "Inadimplência simultânea dos 120 fornecedores",
          correct: false,
          feedback:
            "Os fornecedores não são os devedores do fundo; a inadimplência relevante é a do sacado.",
        },
        {
          id: "c",
          text: "Risco regulatório de limite de prazo",
          correct: false,
          feedback: "Não é o risco dominante; o prazo de 60 dias é curto e não é o ponto crítico.",
        },
        {
          id: "d",
          text: "Risco cambial",
          correct: false,
          feedback: "Não há exposição cambial na estrutura descrita.",
        },
      ],
    },
    maxScore: 85,
  },

  // ====================== S5.3 ======================
  {
    id: "s5-3",
    code: "S5.3",
    order: 3,
    title: "FIDC aberto: Securitiza Multicedente",
    difficulty: "avancado",
    estMinutes: 25,
    archetype: "multi cedente / multi sacado",
    blurb:
      "Crédito e originação diluídos em dois eixos. Se nem o devedor nem o cedente concentram risco, onde ele mora?",
    context:
      "Você é o gestor de risco de um <strong>FIDC aberto</strong> de uma securitizadora que compra duplicatas de <strong>~300 cedentes</strong>, cada um com <strong>milhares de clientes (sacados)</strong>. Os dois eixos são diversificados — então onde mora o risco?",
    keyFacts: [
      { label: "Estrutura", value: "multi cedente / multi sacado" },
      { label: "Nº de cedentes", value: "~300" },
      { label: "Nº de sacados", value: "~12.000", tone: "positive" },
      { label: "Limite por cedente", value: "3%" },
      { label: "Limite por sacado", value: "1,5%" },
      { label: "Coobrigação", value: "sim (recompra pelos cedentes)", tone: "positive" },
      { label: "Subordinação", value: "12%" },
      { label: "Sênior", value: "110% do CDI" },
      { label: "Perda histórica", value: "1,8% a.a." },
    ],
    statements: [
      {
        id: "regulamento",
        title: "Regulamento",
        columns: ["Item", "Regra"],
        rows: [
          { label: "Limite por cedente / sacado", values: ["3% / 1,5%"] },
          { label: "Gatilhos", values: ["eventos de avaliação e de amortização antecipada"] },
          { label: "Coobrigação", values: ["recompra pelos cedentes"] },
        ],
      },
      {
        id: "concentracao",
        title: "Concentração da carteira",
        columns: ["Recorte", "Detalhe"],
        rows: [
          { label: "Top-10 cedentes", values: ["dentro do limite de 3% cada"] },
          { label: "Top-20 sacados", values: ["dentro do limite de 1,5% cada"] },
        ],
      },
      {
        id: "perdas",
        title: "Histórico de perdas e recompras",
        columns: ["Série", "Leitura"],
        rows: [
          { label: "Inadimplência", values: ["~1,8% a.a."] },
          { label: "Recompras por coobrigação", values: ["recorrentes (cedentes solventes)"] },
        ],
      },
    ],
    etapas: [
      {
        id: "etapa-1",
        label: "Etapa 1 — Para onde migra o risco?",
        prompt: "Com crédito e originação diluídos, qual passa a ser o risco dominante?",
        points: 20,
        options: [
          {
            id: "a",
            text: "Risco operacional/originação — fraude de lastro (duplicata “fria”), cessão em duplicidade, validação heterogênea",
            correct: true,
            feedback:
              "Diluir os dois eixos atenua crédito e originador. O que sobra é <strong>integridade do lastro</strong>: recebível inexistente, duplicata fria, dupla cessão e qualidade desigual entre 300 cedentes. É risco <strong>operacional</strong>, não de crédito de devedor real.",
          },
          {
            id: "b",
            text: "Risco de crédito concentrado",
            correct: false,
            feedback: "Justamente o que a dupla diversificação dilui — não é o risco dominante aqui.",
          },
          {
            id: "c",
            text: "Risco de mercado (taxa de juros)",
            correct: false,
            feedback:
              "O sênior é pós-fixado (110% do CDI); não há descasamento de taxa relevante a destacar.",
          },
          {
            id: "d",
            text: "O risco simplesmente desaparece",
            correct: false,
            feedback:
              "Diversificar transforma o risco, não o elimina: ele migra para a integridade do lastro.",
          },
        ],
      },
      {
        id: "etapa-2",
        label: "Etapa 2 — Qual controle ataca a fraude de lastro?",
        prompt: "Que conjunto de controles endereça diretamente o risco dominante?",
        points: 20,
        options: [
          {
            id: "a",
            text: "Registro em registradora + verificação de lastro/custódia qualificada + limites por cedente + coobrigação",
            correct: true,
            feedback:
              "Fraude de lastro não se resolve com mais diversificação — recebível inexistente não “dilui”. O remédio é <strong>verificar o lastro</strong>, <strong>registrar</strong> (evita dupla cessão), <strong>limitar por cedente</strong> e ter <strong>coobrigação</strong>.",
          },
          {
            id: "b",
            text: "Aumentar a subordinação",
            correct: false,
            feedback:
              "Subordinação absorve perdas, mas não impede a fraude; ataca o sintoma, não a causa.",
          },
          {
            id: "c",
            text: "Diversificar ainda mais a carteira",
            correct: false,
            feedback:
              "Recebível inexistente não tem contraparte para diluir — diversificar não resolve fraude de lastro.",
          },
          {
            id: "d",
            text: "Contratar um swap de taxa",
            correct: false,
            feedback: "Swap trata risco de taxa, não a integridade do lastro.",
          },
        ],
      },
      {
        id: "etapa-3",
        label: "Etapa 3 — Um cedente no limite comete fraude total",
        prompt:
          "Um cedente no limite máximo (3%) tem todo o seu lastro fraudado. Com subordinação de 12% e perda esperada de 1,8%, o sênior é atingido?",
        points: 20,
        options: [
          {
            id: "a",
            text: "Não — 3% + 1,8% = 4,8% < 12% de subordinação; há folga (e ainda há coobrigação)",
            correct: true,
            feedback:
              "A perda do cedente fraudulento (≤ 3%) somada à perda esperada (1,8%) dá <strong>4,8%</strong>, dentro dos <strong>12% de subordinação</strong> — o sênior fica protegido. É exatamente para isso que servem o <strong>limite por cedente</strong> e a <strong>coobrigação</strong>.",
          },
          {
            id: "b",
            text: "Sim — 3% já consome o sênior",
            correct: false,
            feedback: "3% está bem abaixo dos 12% de subordinação; o sênior não é tocado.",
          },
          {
            id: "c",
            text: "Sim — a fraude zera o fundo",
            correct: false,
            feedback:
              "A fraude de um cedente é limitada a 3% da carteira pelo limite por cedente; não zera o fundo.",
          },
          {
            id: "d",
            text: "Não é possível calcular",
            correct: false,
            feedback: "É possível: 3% (limite) + 1,8% (perda esperada) = 4,8% < 12% de subordinação.",
          },
        ],
      },
    ],
    encruzilhada: {
      prompt: "Reforçar qual controle?",
      branches: [
        {
          id: "A",
          title: "Apertar limite por cedente (3% → 1,5%)",
          summary: "Reduz o tamanho de cada fraude; custa escala/receita.",
          resultado: {
            headline: "Mais diluição, menos escala",
            caption: "Caminho A — Limite por cedente",
            metrics: [
              { label: "Limite/cedente", value: "1,5%", tone: "positive" },
              { label: "Perda máx. por cedente", value: "↓", tone: "positive" },
              { label: "Receita/escala", value: "↓", tone: "negative" },
              { label: "Fraude de lastro", value: "não resolvida", tone: "risk" },
            ],
            explanation:
              "Diluir reduz o tamanho de uma fraude, mas não impede que ela ocorra.",
          },
        },
        {
          id: "B",
          title: "Reforçar verificação de lastro + custódia + registradora",
          summary: "Ataca a causa-raiz (duplicata fria, dupla cessão).",
          resultado: {
            headline: "Ataca a causa-raiz",
            caption: "Caminho B — Verificação e registro de lastro",
            metrics: [
              { label: "Risco de lastro", value: "↓↓", tone: "positive" },
              { label: "Cobertura por registradora", value: "ativa", tone: "positive" },
              { label: "Custo operacional", value: "↑", tone: "negative" },
              { label: "Risco residual", value: "solvência do cedente", tone: "neutral" },
            ],
            explanation:
              "Validação + registro elimina duplicata fria e dupla cessão — o risco dominante do quadrante.",
          },
        },
        {
          id: "C",
          title: "Exigir coobrigação reforçada/recompra",
          summary: "Devolve o risco ao cedente — depende da solvência dele.",
          resultado: {
            headline: "Devolve o risco ao cedente",
            caption: "Caminho C — Coobrigação reforçada",
            metrics: [
              { label: "Recompra obrigatória", value: "sim", tone: "positive" },
              { label: "Depende da solvência do cedente", value: "sim", tone: "risk" },
              { label: "Risco de crédito do cedente", value: "↑", tone: "negative" },
            ],
            explanation:
              "Coobrigação só vale o quanto o cedente puder honrar — pode falhar exatamente quando mais se precisa.",
          },
        },
      ],
    },
    reflexao: {
      prompt: "Por que diversificação não substitui controle de lastro?",
      points: 25,
      options: [
        {
          id: "a",
          text: "A diversificação dilui o crédito de devedores reais, mas não protege contra recebível inexistente/fraudado — esse risco é operacional",
          correct: true,
          feedback:
            "Pulverizar funciona para perdas de crédito de devedores que <em>existem</em>. Um recebível fraudado não tem contraparte para diluir — ele simplesmente não existe. Por isso o controle é <strong>verificação e registro de lastro</strong>, não diversificação.",
        },
        {
          id: "b",
          text: "Porque diversificar aumenta o risco",
          correct: false,
          feedback: "Diversificar reduz risco de crédito; o ponto é que não cobre fraude de lastro.",
        },
        {
          id: "c",
          text: "Porque a subordinação já cobre tudo",
          correct: false,
          feedback:
            "Subordinação absorve perdas até um teto, mas o controle de fraude é prevenção, não colchão.",
        },
        {
          id: "d",
          text: "Porque o CDI protege a carteira",
          correct: false,
          feedback: "O indexador do sênior não tem relação com o risco de lastro.",
        },
      ],
    },
    maxScore: 85,
  },

  // ====================== S5.4 ======================
  {
    id: "s5-4",
    code: "S5.4",
    order: 4,
    title: "Bilateral: FIDC Energia PPA Único",
    difficulty: "avancado",
    estMinutes: 22,
    archetype: "mono cedente / mono sacado",
    blurb:
      "Um cedente, um off-taker, um PPA de 15 anos. O quadrante da concentração máxima — e o que a subordinação realmente protege.",
    context:
      "A <strong>Geradora Helios</strong> (cedente único) vende toda a sua energia a um <strong>único off-taker</strong> via PPA de 15 anos e cede ao FIDC os recebíveis — todos devidos por esse mesmo off-taker. É o quadrante de <strong>concentração máxima</strong>.",
    keyFacts: [
      { label: "Estrutura", value: "mono cedente / mono sacado", tone: "warning" },
      { label: "Cedente único", value: "Geradora Helios" },
      { label: "Sacado único (off-taker)", value: "Distribuidora Sul", tone: "warning" },
      { label: "Rating do off-taker", value: "A (escala nacional)" },
      { label: "Prazo do PPA", value: "15 anos" },
      { label: "Sênior", value: "IPCA + 7%" },
      { label: "Subordinação", value: "10%" },
      { label: "Diversificação", value: "nenhuma (1 cedente, 1 sacado)", tone: "warning" },
    ],
    statements: [
      {
        id: "ppa",
        title: "Termos do PPA",
        columns: ["Item", "Detalhe"],
        rows: [
          { label: "Preço / volume / prazo", values: ["contratados (15 anos)"] },
          { label: "Cláusulas", values: ["garantia / step-in"] },
        ],
      },
      {
        id: "off-taker",
        title: "Demonstrações do off-taker",
        columns: ["Indicador", "Leitura"],
        rows: [
          { label: "Alavancagem / cobertura de juros", values: ["o verdadeiro lastro"] },
          { label: "Liquidez / rating", values: ["A (escala nacional)"] },
        ],
      },
      {
        id: "fundo",
        title: "Estrutura do fundo",
        columns: ["Item", "Detalhe"],
        rows: [
          { label: "Cotas", values: ["sênior + subordinada (10%)"] },
          { label: "Conta reserva / gatilhos", values: ["liquidez e amortização antecipada"] },
        ],
      },
    ],
    etapas: [
      {
        id: "etapa-1",
        label: "Etapa 1 — O FIDC equivale a quê?",
        prompt: "Em termos de risco, a que se assemelha esse fundo?",
        points: 20,
        options: [
          {
            id: "a",
            text: "A uma exposição de crédito praticamente direta ao off-taker único (≈ uma debênture do off-taker)",
            correct: true,
            feedback:
              "Com um cedente e um sacado, o fundo é, na prática, uma <strong>exposição mono-nome ao off-taker</strong>. Não há pool a diversificar — o risco do sênior é o risco de crédito daquele único devedor.",
          },
          {
            id: "b",
            text: "A uma carteira diversificada de recebíveis",
            correct: false,
            feedback: "Não há diversificação: um cedente, um sacado — exposição a um único nome.",
          },
          {
            id: "c",
            text: "Ao risco operacional da geradora",
            correct: false,
            feedback:
              "O risco dominante é de crédito do off-taker que paga, não a operação da geradora.",
          },
          {
            id: "d",
            text: "A um risco de mercado de energia",
            correct: false,
            feedback:
              "O PPA fixa preço/volume; o risco relevante é o off-taker honrar o contrato — crédito, não mercado.",
          },
        ],
      },
      {
        id: "etapa-2",
        label: "Etapa 2 — A subordinação protege contra o default do off-taker?",
        prompt: "Os 10% de subordinação protegem o sênior se o off-taker quebrar?",
        points: 20,
        options: [
          {
            id: "a",
            text: "Sim — protege integralmente",
            correct: false,
            feedback:
              "O default do único devedor é uma perda sistêmica à carteira inteira; estoura os 10% imediatamente.",
          },
          {
            id: "b",
            text: "Praticamente cosmética contra o evento mono-nome — se o off-taker quebra, a carteira falha de uma vez; só absorve atrasos/perdas parciais",
            correct: true,
            feedback:
              "O <em>default</em> do único devedor é uma perda <strong>sistêmica à carteira inteira</strong> — estoura os 10% imediatamente. A subordinação só ajuda em <strong>atrasos e perdas parciais</strong>. Contra o evento mono-nome, o remédio seria diversificação (que não existe aqui).",
          },
          {
            id: "c",
            text: "Sim, em até 10% do default",
            correct: false,
            feedback:
              "O default do off-taker não é fracionado em 10%: atinge toda a carteira de uma vez.",
          },
          {
            id: "d",
            text: "Sim, por causa do prazo de 15 anos",
            correct: false,
            feedback: "O prazo longo não protege contra a quebra do devedor — ao contrário, prolonga a exposição.",
          },
        ],
      },
      {
        id: "etapa-3",
        label: "Etapa 3 — Qual rating precifica o sênior?",
        prompt: "Que rating é o relevante para o spread do sênior?",
        points: 20,
        options: [
          {
            id: "a",
            text: "O do off-taker — não há diversificação que melhore; o sênior precifica perto do crédito dele",
            correct: true,
            feedback:
              "Como toda a carteira depende de um nome, o sênior tende a precificar <strong>próximo ao crédito do off-taker</strong>. Não há pulverização que “suba” a qualidade — é exposição direta a uma única contraparte.",
          },
          {
            id: "b",
            text: "O da geradora cedente",
            correct: false,
            feedback: "A geradora origina, mas quem paga o recebível é o off-taker; é o crédito dele que precifica.",
          },
          {
            id: "c",
            text: "Uma média ponderada cedente/sacado",
            correct: false,
            feedback: "Não há pool a ponderar: o pagamento depende exclusivamente do off-taker.",
          },
          {
            id: "d",
            text: "O rating do administrador do fundo",
            correct: false,
            feedback: "O administrador não é o devedor; não precifica o risco de crédito do sênior.",
          },
        ],
      },
    ],
    encruzilhada: {
      prompt: "Como mitigar a concentração?",
      branches: [
        {
          id: "A",
          title: "Conta reserva + step-in/garantia do off-taker",
          summary: "Mitiga liquidez/atraso e melhora recuperação; não cobre o default.",
          resultado: {
            headline: "Protege liquidez, não o evento de crédito",
            caption: "Caminho A — Conta reserva + step-in",
            metrics: [
              { label: "Conta reserva", value: "ativa", tone: "positive" },
              { label: "Cobre atrasos", value: "sim", tone: "positive" },
              { label: "Default do off-taker", value: "ainda exposto", tone: "risk" },
              { label: "Custo de carrego", value: "↑", tone: "negative" },
            ],
            explanation:
              "Melhora recuperação e fluxo, mas a perda final ainda depende do nome.",
          },
        },
        {
          id: "B",
          title: "Seguro de crédito sobre o off-taker",
          summary: "Transfere o evento de default, com custo e risco de contraparte.",
          resultado: {
            headline: "Transfere o default (com custo)",
            caption: "Caminho B — Seguro de crédito",
            metrics: [
              { label: "Evento de crédito coberto", value: "sim", tone: "positive" },
              { label: "Prêmio do seguro", value: "↓ retorno", tone: "negative" },
              { label: "Risco do segurador", value: "presente", tone: "risk" },
            ],
            explanation:
              "Única que ataca o evento mono-nome diretamente; preço relevante porque é concentrado.",
          },
        },
        {
          id: "C",
          title: "Reestruturar para multi-sacado (mercado livre)",
          summary: "Vender energia a vários off-takers — ataca a concentração na origem.",
          resultado: {
            headline: "Ataca a concentração na origem",
            caption: "Caminho C — Multi-sacado",
            metrics: [
              { label: "De mono → multi sacado", value: "sim", tone: "positive" },
              { label: "Risco de crédito", value: "diluído", tone: "positive" },
              { label: "Complexidade comercial/operacional", value: "↑", tone: "negative" },
              { label: "Prazo de implementação", value: "longo", tone: "neutral" },
            ],
            explanation:
              "Estruturalmente a melhor — transforma o quadrante; mas exige mudar o modelo de venda de energia.",
          },
        },
      ],
    },
    reflexao: {
      prompt: "Por que subordinação ≠ proteção contra risco mono-nome?",
      points: 25,
      options: [
        {
          id: "a",
          text: "A subordinação absorve perdas parciais até um limite; o default do único devedor é uma perda sistêmica que estoura o colchão de uma vez — o remédio seria diversificação",
          correct: true,
          feedback:
            "Subordinação e diversificação são alavancas distintas: a primeira absorve perdas até um teto; a segunda decide se a perda é idiossincrática (tolerável) ou sistêmica a um nome (fatal). Em mono-sacado, mais subordinação não resolve — falta o que diversificar.",
        },
        {
          id: "b",
          text: "Porque subordinação não existe em mono-sacado",
          correct: false,
          feedback: "Existe, sim — só não protege contra o evento de um único devedor.",
        },
        {
          id: "c",
          text: "Porque o rating A elimina o risco",
          correct: false,
          feedback: "O rating A reduz a probabilidade, mas não elimina o risco de default do nome.",
        },
        {
          id: "d",
          text: "Porque o PPA garante 15 anos de pagamento",
          correct: false,
          feedback: "O PPA contrata o fluxo, mas depende de o off-taker honrá-lo — risco de crédito permanece.",
        },
      ],
    },
    maxScore: 85,
  },

  // ====================== S5.5 ======================
  {
    id: "s5-5",
    code: "S5.5",
    order: 5,
    title: "Banco restrito por capital: Banco Direto",
    difficulty: "avancado",
    estMinutes: 25,
    archetype: "originate-to-distribute (descasamento PRÉ × CDI)",
    blurb:
      "Um banco com Basileia apertada cede carteira PRÉ a um FIDC com sênior em CDI. De onde vem o alívio de capital e quem absorve o descasamento?",
    context:
      "O <strong>Banco Direto</strong> origina crédito <strong>prefixado</strong> (consignado/CDC) mas tem <strong>PR baixo</strong> e índice de Basileia apertado. Para crescer, cede a carteira a um FIDC e libera capital. O <strong>sênior é remunerado em CDI + taxa</strong>. Você avalia o alívio de capital e como o <em>descasamento de indexador</em> é resolvido dentro do fundo.",
    keyFacts: [
      { label: "Estrutura", value: "originate-to-distribute (mono cedente / multi sacado)" },
      { label: "Carteira", value: "crédito PRÉ" },
      { label: "Rendimento do ativo (PRÉ)", value: "30% a.a. (fixo)", tone: "positive" },
      { label: "CDI atual", value: "12% a.a." },
      { label: "Sênior", value: "CDI + 4% (= 16% hoje)" },
      { label: "Custos + perdas", value: "6% a.a." },
      { label: "Excess spread", value: "8% a.a. (= 20% − CDI)", tone: "positive" },
      { label: "Subordinação (retida pelo banco)", value: "20%", tone: "warning" },
      { label: "Índice de Basileia", value: "11,2% (mínimo ~10,5%)", tone: "warning" },
    ],
    statements: [
      {
        id: "capital",
        title: "Balanço do banco (capital)",
        columns: ["Item", "Detalhe"],
        rows: [
          { label: "PR / RWA da carteira", values: ["base do índice de Basileia"] },
          { label: "Índice de Basileia", values: ["antes × depois da cessão"] },
        ],
      },
      {
        id: "rate-stack",
        title: "Composição de taxa (rate stack)",
        columns: ["Componente", "Taxa (a.a.)"],
        rows: [
          { label: "Rendimento do ativo (PRÉ)", values: ["30%"], emphasis: true },
          { label: "Sênior (CDI + 4%)", values: ["= 16% hoje"] },
          { label: "Custos + perdas", values: ["6%"] },
          { label: "Excess spread (residual)", values: ["8% (= 20% − CDI)"], emphasis: true },
        ],
      },
      {
        id: "cdi",
        title: "Projeção de CDI",
        columns: ["Cenário de CDI", "Impacto no excess spread"],
        rows: [
          { label: "CDI 12% (hoje)", values: ["colchão de 8%"] },
          { label: "CDI 20% (breakeven)", values: ["excess spread zera"] },
          { label: "CDI > 20%", values: ["consome a subordinação"] },
        ],
      },
      {
        id: "regulamento",
        title: "Regulamento do FIDC",
        columns: ["Item", "Detalhe"],
        rows: [
          { label: "Cotas", values: ["sênior + subordinada (20%, retida pelo banco)"] },
          { label: "Swap / gatilhos", values: ["possibilidade de swap; gatilhos de amortização"] },
        ],
      },
    ],
    etapas: [
      {
        id: "etapa-1",
        label: "Etapa 1 — De onde vem o alívio de capital?",
        prompt: "Qual parcela da estrutura efetivamente alivia o capital regulatório do banco?",
        points: 20,
        options: [
          {
            id: "a",
            text: "A parcela sênior colocada a investidores (o RWA sai); a subordinada retida é cara em capital e o alívio pleno exige transferência significativa de risco",
            correct: true,
            feedback:
              "O alívio vem de tirar o RWA do balanço — e isso só ocorre na <strong>fatia sênior</strong> financiada por terceiros. A <strong>subordinada retida</strong> carrega peso de risco alto (ou dedução) no arcabouço de securitização, e o desreconhecimento pleno depende de <strong>transferência substancial de risco</strong>.",
          },
          {
            id: "b",
            text: "A carteira inteira, automaticamente",
            correct: false,
            feedback:
              "Só sai o RWA da parte transferida (sênior); a subordinada retida continua consumindo capital.",
          },
          {
            id: "c",
            text: "A cota subordinada retida",
            correct: false,
            feedback:
              "A subordinada retida é o que <em>permanece</em> no balanço, cara em capital — não é fonte de alívio.",
          },
          {
            id: "d",
            text: "A redução de impostos sobre o lucro",
            correct: false,
            feedback: "Alívio de capital regulatório é sobre RWA/PR, não sobre tributação.",
          },
        ],
      },
      {
        id: "etapa-2",
        label: "Etapa 2 — Como o descasamento PRÉ × CDI é absorvido?",
        prompt:
          "O ativo rende fixo (30%) e o sênior cobra CDI + 4% (flutuante). Quem absorve essa diferença dentro do fundo?",
        points: 20,
        options: [
          {
            id: "a",
            text: "O excess spread / cota subordinada (retida pelo banco), que flutua inversamente ao CDI; dimensionado contra um estresse de CDI",
            correct: true,
            feedback:
              "O rendimento fixo é “fatiado” em sênior (flutuante) + custos/perdas + <strong>excess spread</strong>. Como o ativo é fixo e o sênior flutua, é o <strong>excess spread (da subordinada)</strong> que sobe e desce para fechar a conta: CDI sobe → sênior leva mais → sobra menos ao banco. A razão de subordinação é calibrada para suportar um CDI de estresse sem tocar o sênior.",
          },
          {
            id: "b",
            text: "O próprio sênior absorve",
            correct: false,
            feedback:
              "O sênior é flutuante e é pago primeiro — ele não absorve o descasamento, ele o causa.",
          },
          {
            id: "c",
            text: "O deságio de aquisição elimina o descasamento",
            correct: false,
            feedback: "O deságio afeta o preço de entrada, não o risco de base PRÉ × CDI ao longo do tempo.",
          },
          {
            id: "d",
            text: "O tomador do crédito absorve",
            correct: false,
            feedback: "O tomador paga taxa fixa contratada; não absorve a variação do CDI do fundo.",
          },
        ],
      },
      {
        id: "etapa-3",
        label: "Etapa 3 — CDI de breakeven",
        prompt:
          "Com ativo a 30%, custos/perdas de 6% e sênior = CDI + 4%, em que CDI o excess spread zera?",
        points: 20,
        options: [
          {
            id: "a",
            text: "CDI = 12%",
            correct: false,
            feedback: "A 12% (hoje) ainda há colchão de 8% (excess spread = 20 − 12). Não é o breakeven.",
          },
          {
            id: "b",
            text: "CDI = 16%",
            correct: false,
            feedback: "16% é o cupom do sênior hoje (CDI 12 + 4), não o ponto em que o excess spread zera.",
          },
          {
            id: "c",
            text: "CDI = 20%",
            correct: true,
            feedback:
              "Excess spread = 30 − (CDI + 4) − 6 = <strong>20 − CDI</strong>; zera em <strong>CDI = 20%</strong>. Acima disso, o rendimento PRÉ não cobre mais sênior + custos e a estrutura começa a <strong>consumir a subordinação</strong>. A 12% (hoje), o colchão é de 8%.",
          },
          {
            id: "d",
            text: "CDI = 26%",
            correct: false,
            feedback: "26% já estaria 6 p.p. além do breakeven, consumindo subordinação — não é o ponto de zerar.",
          },
        ],
      },
    ],
    encruzilhada: {
      prompt: "Como tratar o risco de base?",
      branches: [
        {
          id: "A",
          title: "Swap pré × DI (hedge explícito)",
          summary:
            "Converte o fluxo fixo em CDI; elimina a base; custo + risco de contraparte/margem.",
          resultado: {
            headline: "Elimina o risco de base (com custo)",
            caption: "Caminho A — Swap pré × DI",
            metrics: [
              { label: "Risco de base", value: "↓↓", tone: "positive" },
              { label: "Excess spread", value: "estabilizado", tone: "positive" },
              { label: "Custo do swap", value: "presente", tone: "negative" },
              { label: "Risco de contraparte/margem", value: "presente", tone: "risk" },
            ],
            explanation:
              "Converte o fluxo fixo em CDI, casando com o sênior; precisa estar previsto no regulamento.",
          },
        },
        {
          id: "B",
          title: "FIDC rotativo reprecificando a taxa de cessão",
          summary:
            "Repassa o CDI corrente às novas compras; o banco origina a taxas PRÉ mais altas.",
          resultado: {
            headline: "Reprecifica para frente",
            caption: "Caminho B — Cessão rotativa reprecificada",
            metrics: [
              { label: "Spread futuro", value: "protegido", tone: "positive" },
              { label: "Custo de hedge", value: "nenhum", tone: "positive" },
              { label: "Estoque atual", value: "ainda exposto", tone: "risk" },
              { label: "Originação a taxas", value: "↑", tone: "neutral" },
            ],
            explanation:
              "A cada compra o fundo exige rendimento PRÉ maior conforme o CDI sobe; o banco precisa originar mais caro para continuar cedendo.",
          },
        },
        {
          id: "C",
          title: "Aumentar subordinação + gatilhos de amortização",
          summary: "Mais colchão e proteção; mais capital travado e menos alívio.",
          resultado: {
            headline: "Mais proteção, menos alívio",
            caption: "Caminho C — Subordinação + gatilhos",
            metrics: [
              { label: "Subordinação", value: "↑", tone: "positive" },
              { label: "Gatilhos protegem o sênior", value: "sim", tone: "positive" },
              { label: "Capital travado", value: "↑", tone: "negative" },
              { label: "Alívio de RWA", value: "↓", tone: "negative" },
            ],
            explanation:
              "Reforça o colchão e antecipa amortização se o CDI disparar, mas consome o benefício de capital que motivou a estrutura.",
          },
        },
      ],
    },
    reflexao: {
      prompt: "O excess spread cobre o quê ao mesmo tempo?",
      points: 25,
      options: [
        {
          id: "a",
          text: "O risco de base (CDI) <em>e</em> as perdas de crédito — as duas brigam pelo mesmo colchão; o pior caso é CDI e inadimplência subindo juntos",
          correct: true,
          feedback:
            "A subordinada retida pelo banco acumula três papéis: <em>skin in the game</em> para a venda definitiva, absorção da <strong>inadimplência</strong> e absorção do <strong>descasamento de indexador</strong>. Como base e perdas consomem o mesmo excess spread, o estresse crítico é a <strong>alta simultânea</strong> de CDI e inadimplência.",
        },
        {
          id: "b",
          text: "Apenas o risco de base",
          correct: false,
          feedback: "Também absorve as perdas de crédito — os dois disputam o mesmo excess spread.",
        },
        {
          id: "c",
          text: "Apenas as perdas de crédito",
          correct: false,
          feedback: "Também absorve o risco de base PRÉ × CDI — não só inadimplência.",
        },
        {
          id: "d",
          text: "Nada — o sênior cobre tudo",
          correct: false,
          feedback: "O sênior é pago primeiro; quem cobre base e perdas é o excess spread da subordinada.",
        },
      ],
    },
    maxScore: 85,
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
