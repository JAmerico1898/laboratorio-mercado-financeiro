// src/lib/tokenization/constants.ts
import type { StepConfig, TokenClassification, QuizQuestion } from "./types";

export const STEPS: StepConfig[] = [
  { index: 0, label: "Fundamentos", icon: "school" },
  { index: 1, label: "Mecânica", icon: "precision_manufacturing" },
  { index: 2, label: "Blockchain", icon: "link" },
  { index: 3, label: "Ciclo de Vida", icon: "autorenew" },
  { index: 4, label: "Riscos & Casos", icon: "warning" },
  { index: 5, label: "Contratos & Quiz", icon: "gavel" },
];

export const TOKEN_CLASSIFICATIONS: Record<string, TokenClassification> = {
  "Títulos Públicos": {
    tipo: "Security Token (RWA)",
    regulacao: "Alta (Tesouro/CVM)",
    fracionalizacao: "Alta",
    padrao: "ERC-20 / DREX",
  },
  "Cotas de FIDC": {
    tipo: "Security Token",
    regulacao: "CVM 175",
    fracionalizacao: "Média",
    padrao: "ERC-20 com Whitelist",
  },
  "Imóvel Real": {
    tipo: "Security/Utility Híbrido",
    regulacao: "Cartório + CVM",
    fracionalizacao: "Baixa (SPV necessário)",
    padrao: "ERC-1400 (Security)",
  },
  "Obra de Arte": {
    tipo: "NFT (Non-Fungible)",
    regulacao: "Baixa/Média",
    fracionalizacao: "Possível (Sharding)",
    padrao: "ERC-721",
  },
  "Crédito de Carbono": {
    tipo: "Utility/Commodity",
    regulacao: "Emergente",
    fracionalizacao: "Alta (Toneladas)",
    padrao: "Token Climático",
  },
};

export const TOKEN_DISTRIBUTION = [
  { stakeholder: "Investidores Varejo", percentage: 0.6 },
  { stakeholder: "Emissor (Retido)", percentage: 0.2 },
  { stakeholder: "Taxa Plataforma", percentage: 0.05 },
  { stakeholder: "Reserva de Liquidez", percentage: 0.15 },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      "1. Qual a principal diferença entre Tokenização e Securitização tradicional?",
    options: [
      "Não há diferença.",
      "A tokenização permite fracionalização granular e liquidação programável (D+0).",
      "A tokenização dispensa advogados.",
    ],
    correctIndex: 1,
    explanation:
      "A tokenização permite fracionamento fino (ex: 1 milhão de tokens para um único imóvel) e liquidação instantânea (D+0) via smart contracts, eliminando intermediários no settlement.",
  },
  {
    id: 2,
    question:
      "2. Se um hacker altera um registro em um bloco antigo de uma blockchain, o que acontece?",
    options: [
      "Nada, o sistema aceita a mudança.",
      "O hash do bloco muda, invalidando toda a cadeia subsequente.",
      "O hacker ganha todos os tokens.",
    ],
    correctIndex: 1,
    explanation:
      "Cada bloco contém o hash do bloco anterior. Alterar dados em um bloco muda seu hash, o que invalida a referência do próximo bloco, criando um efeito cascata que torna a adulteração detectável.",
  },
  {
    id: 3,
    question: "3. O que é um 'Security Token'?",
    options: [
      "Um token usado apenas para pagar taxas de rede.",
      "Um avatar digital em jogos.",
      "Uma representação digital de um valor mobiliário regulado (investimento).",
    ],
    correctIndex: 2,
    explanation:
      "Security Tokens representam valores mobiliários (ações, debêntures, cotas de fundo) na blockchain, estando sujeitos à regulação da CVM no Brasil e da SEC nos EUA.",
  },
];

export const CONCEPT_CARDS = [
  {
    id: "token",
    title: "O que é um Token?",
    content:
      "Um token é a **representação digital** de um ativo ou utilidade em uma blockchain. Não é o arquivo PDF do contrato, mas o registro programável de propriedade.",
    defaultExpanded: true,
  },
  {
    id: "fungible",
    title: "Fungível vs. Não Fungível (NFT)",
    content:
      "**Fungível:** Dinheiro, ações (uma nota de R$10 vale o mesmo que outra).\n\n**Não Fungível:** Obras de arte, Imóveis (cada unidade é única e insubstituível).",
    defaultExpanded: false,
  },
  {
    id: "ledger",
    title: "Ledger vs. Blockchain",
    content:
      "**Ledger:** Livro razão (registro contábil).\n\n**Blockchain:** Um tipo de DLT (Distributed Ledger Technology) onde os registros são agrupados em blocos encadeados criptograficamente.",
    defaultExpanded: false,
  },
  {
    id: "custody",
    title: "Custódia (On-chain vs. Off-chain)",
    content:
      "O grande desafio. Se tokenizo um prédio (Off-chain), quem garante que o dono do token é dono do prédio? É necessário um **Custodiante Jurídico** e oráculos.",
    defaultExpanded: false,
  },
];

export const FLOW_STEPS = [
  {
    id: "asset",
    label: "Ativo Real",
    sublabel: "(Imóvel, Recebível)",
    icon: "apartment",
    color: "#ef4444",
  },
  {
    id: "spv",
    label: "SPV / Veículo Legal",
    sublabel: "(Auditoria & Custódia)",
    icon: "verified",
    color: "#8b5cf6",
  },
  {
    id: "mint",
    label: "Smart Contract",
    sublabel: "(Minting)",
    icon: "code",
    color: "#00f2ff",
  },
  {
    id: "dist",
    label: "Distribuição",
    sublabel: "(Carteira do Investidor)",
    icon: "account_balance_wallet",
    color: "#4edea3",
  },
];

export const FLOW_EDGES = ["Formalização", "Oraculização", "Venda Primária"];

export const ERC20_TEMPLATE = (symbol: string, supply: number) => `// Contrato Simplificado ERC-20
contract ${symbol} {
    string public name = "Meu Token MBA";
    string public symbol = "${symbol}";
    uint8 public decimals = 18;
    uint256 public totalSupply = ${supply} * (10 ** uint256(decimals));

    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        // O criador do contrato recebe todos os tokens inicialmente
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value, "Saldo insuficiente");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }
}`;

export const WHITELIST_TEMPLATE = `contract ComplianceToken {
    mapping(address => bool) public whitelist;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    // Apenas investidores aprovados (KYC) podem receber tokens
    modifier onlyWhitelisted(address _addr) {
        require(whitelist[_addr] == true, "Investidor nao autorizado (KYC Pendente)");
        _;
    }

    function addToWhitelist(address _investor) public {
        require(msg.sender == admin, "Apenas admin");
        whitelist[_investor] = true;
    }

    function transfer(address to, uint256 value) public onlyWhitelisted(to) {
        // Lógica de transferência...
        // A transferência falhará se o destinatário não estiver na whitelist
    }
}`;

export const CASE_STUDIES = [
  {
    id: "fidc",
    tab: "🇧🇷 FIDC Tokenizado",
    title: "FIDC e Recebíveis no Brasil",
    content: `**O Cenário:** O Brasil é pioneiro na tokenização de recebíveis (FIDC).

* **Como funciona:** Uma empresa (ex: varejista) tem notas fiscais a receber em 90 dias.
* **Tokenização:** Essas notas são empacotadas, validadas e transformadas em tokens.
* **Investidor:** Compra o token com desconto (ex: paga 95 para receber 100).
* **Regulação:** CVM Resolução 175 e Sandbox Regulatório.

**Vantagem:** Redução de intermediários bancários e custo de captação menor para a empresa.`,
    callout: "Empresas envolvidas no ecossistema: Liqi, Vórtx, MB.",
    calloutType: "info" as const,
  },
  {
    id: "buidl",
    tab: "🇺🇸 Títulos do Tesouro (BUIDL)",
    title: "BlackRock BUIDL & Franklin Templeton",
    content: `**O Cenário:** Grandes gestoras trazendo Títulos do Tesouro Americano (Treasuries) para a blockchain.

* **Produto:** Fundo de liquidez tokenizado.
* **Mecânica:** Cada token vale $1. O rendimento é pago diariamente via *rebasing* ou dividendo mensal.
* **Blockchain:** Ethereum (ERC-20).
* **Sucesso:** O fundo BUIDL da BlackRock atingiu >$500 milhões em ativos em tempo recorde.`,
    metric: { label: "TVL estimado no Setor RWA", value: "$ 12 Bilhões+" },
    calloutType: "info" as const,
  },
  {
    id: "carbon",
    tab: "🌍 Créditos de Carbono",
    title: "Toucan Protocol & Klima DAO",
    content: `**O Cenário:** Tokenização de créditos de carbono 'zumbis' (antigos).

* **O Problema:** Créditos antigos de baixa qualidade foram tokenizados e vendidos como offsets "premium".
* **A Lição:** A Blockchain garante que o token é único, mas não garante a **qualidade do ativo subjacente**.
* **Consequência:** A certificadora Verra suspendeu a tokenização direta para criar regras mais rígidas.`,
    callout:
      "Lição aprendida: 'Garbage In, Garbage Out'. A tecnologia não conserta um ativo ruim.",
    calloutType: "warning" as const,
  },
];
