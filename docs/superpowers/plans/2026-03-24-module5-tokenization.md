# Module 5: Tokenização de Ativos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the interactive tokenization education module (Module 5) as a Next.js page with 6 stepper-navigated steps covering blockchain fundamentals, fractionalization, lifecycle simulation, risk analysis, smart contracts, and assessment.

**Architecture:** Single page at `/modulo/5` with Opening Hero + 6-step StepperNav (adapted from Module 3 pattern). Each step is an independent client component with its own state. All computation is client-side — blockchain hashing via Web Crypto API, lifecycle simulation via seeded PRNG (mulberry32), charts via Plotly.js.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Plotly.js (react-plotly.js), Web Crypto API, Jest + ts-jest

**Spec:** `docs/superpowers/specs/2026-03-24-module5-tokenization-design.md`

---

## Task 1: Types & Constants

**Files:**
- Create: `src/lib/tokenization/types.ts`
- Create: `src/lib/tokenization/constants.ts`

- [ ] **Step 1: Create types.ts with all interfaces**

```typescript
// src/lib/tokenization/types.ts

export interface StepConfig {
  index: number;
  label: string;
  icon: string;
}

export interface Block {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
}

export interface MiningState {
  isMining: boolean;
  currentNonce: number;
  elapsedMs: number;
}

export interface TokenClassification {
  tipo: string;
  regulacao: string;
  fracionalizacao: string;
  padrao: string;
}

export interface MecanicaParams {
  assetName: string;
  valuation: number;
  fractionCount: number;
  standard: "ERC-20" | "ERC-721";
  custodyQuality:
    | "Baixa/Inexistente"
    | "Média (Auditoria Anual)"
    | "Alta (Banco Top-tier)";
}

export interface MecanicaResult {
  tokenPrice: number;
  marketCap: number;
  distribution: Array<{ stakeholder: string; quantidade: number }>;
  riskFlags: Array<{ level: "warning" | "error" | "success"; message: string }>;
}

export interface RealEstateResult {
  months: number[];
  prices: number[];
  dividends: number[];
  totalDividends: number;
  capitalGain: number;
  roi: number;
}

export interface BondResult {
  years: number[];
  cashFlows: number[];
  status: "Adimplente" | "Default (Calote)";
  defaultYear?: number;
}

export interface RiskImpactResult {
  categories: string[];
  impacts: number[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizState {
  answers: Record<number, number>;
  revealed: Record<number, boolean>;
  score: number;
}
```

- [ ] **Step 2: Create constants.ts with all static data**

```typescript
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

// Concept cards for Step 1
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

// Tokenization flow steps for diagram
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

// Smart contract code templates
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

// Case study content
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
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd C:/jose_americo/laboratorio-mercado-financeiro && npx tsc --noEmit src/lib/tokenization/types.ts src/lib/tokenization/constants.ts`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/tokenization/types.ts src/lib/tokenization/constants.ts
git commit -m "feat(mod5): add types and constants for tokenization module"
```

---

## Task 2: Blockchain Engine (TDD)

**Files:**
- Create: `src/lib/tokenization/blockchain.ts`
- Create: `src/lib/__tests__/blockchain.test.ts`

- [ ] **Step 1: Write failing tests for blockchain.ts**

```typescript
// src/lib/__tests__/blockchain.test.ts
import {
  calculateHash,
  mineBlock,
  createGenesisBlock,
  addBlock,
  isChainValid,
} from "../tokenization/blockchain";
import type { Block } from "../tokenization/types";

describe("calculateHash", () => {
  it("returns a 64-character hex string", async () => {
    const hash = await calculateHash({
      index: 0,
      timestamp: "2026-01-01T00:00:00.000Z",
      data: "test",
      previousHash: "0",
      nonce: 0,
    });
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("returns different hashes for different data", async () => {
    const base = {
      index: 0,
      timestamp: "2026-01-01T00:00:00.000Z",
      previousHash: "0",
      nonce: 0,
    };
    const hash1 = await calculateHash({ ...base, data: "Alice paga Bob" });
    const hash2 = await calculateHash({ ...base, data: "Bob paga Alice" });
    expect(hash1).not.toBe(hash2);
  });

  it("is deterministic for same inputs", async () => {
    const input = {
      index: 1,
      timestamp: "2026-01-01T00:00:00.000Z",
      data: "test",
      previousHash: "abc",
      nonce: 42,
    };
    const hash1 = await calculateHash(input);
    const hash2 = await calculateHash(input);
    expect(hash1).toBe(hash2);
  });
});

describe("createGenesisBlock", () => {
  it("creates a block with index 0", async () => {
    const genesis = await createGenesisBlock();
    expect(genesis.index).toBe(0);
    expect(genesis.previousHash).toBe("0");
    expect(genesis.data).toBe("Bloco Gênese");
    expect(genesis.hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("addBlock", () => {
  it("creates a new block linked to the last block", async () => {
    const genesis = await createGenesisBlock();
    const chain = await addBlock([genesis], "Transação 1", 1);
    expect(chain).toHaveLength(2);
    expect(chain[1].index).toBe(1);
    expect(chain[1].previousHash).toBe(genesis.hash);
    expect(chain[1].data).toBe("Transação 1");
  });

  it("mines with difficulty (hash starts with zeros)", async () => {
    const genesis = await createGenesisBlock();
    const chain = await addBlock([genesis], "Transação 1", 2);
    expect(chain[1].hash.startsWith("00")).toBe(true);
  });
});

describe("isChainValid", () => {
  it("validates a correct chain", async () => {
    const genesis = await createGenesisBlock();
    const chain = await addBlock([genesis], "Tx1", 1);
    expect(await isChainValid(chain)).toBe(true);
  });

  it("detects tampered data", async () => {
    const genesis = await createGenesisBlock();
    const chain = await addBlock([genesis], "Tx1", 1);
    // Tamper with data
    chain[1] = { ...chain[1], data: "HACKED" };
    expect(await isChainValid(chain)).toBe(false);
  });
});

describe("mineBlock", () => {
  it("throws AbortError when signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const block = {
      index: 1,
      timestamp: "2026-01-01T00:00:00.000Z",
      data: "test",
      previousHash: "abc",
      nonce: 0,
    };
    await expect(
      mineBlock(block, 1, undefined, controller.signal)
    ).rejects.toThrow("Mining aborted");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/__tests__/blockchain.test.ts --no-cache`
Expected: FAIL — module not found

- [ ] **Step 3: Implement blockchain.ts**

```typescript
// src/lib/tokenization/blockchain.ts
import type { Block } from "./types";

// Web Crypto polyfill for Node.js test environment
const getCrypto = (): Pick<Crypto, "subtle"> => {
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    return globalThis.crypto;
  }
  // Node.js environment (Jest tests)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { webcrypto } = require("crypto");
  return webcrypto as Crypto;
};

export async function calculateHash(
  block: Omit<Block, "hash">
): Promise<string> {
  const crypto = getCrypto();
  const message =
    String(block.index) +
    block.timestamp +
    block.data +
    block.previousHash +
    String(block.nonce);
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function mineBlock(
  block: Omit<Block, "hash"> & { hash?: string },
  difficulty: number,
  onProgress?: (nonce: number) => void,
  signal?: AbortSignal
): Promise<Block> {
  const prefix = "0".repeat(difficulty);
  let nonce = 0;
  const BATCH_SIZE = 1000;
  const TIMEOUT_MS = 10_000;
  const start = Date.now();

  while (true) {
    if (signal?.aborted) {
      throw new DOMException("Mining aborted", "AbortError");
    }
    if (Date.now() - start > TIMEOUT_MS) {
      throw new Error("Mining timeout — tente reduzir a dificuldade");
    }

    const candidate = { ...block, nonce };
    const hash = await calculateHash(candidate);
    if (hash.startsWith(prefix)) {
      return { ...candidate, hash };
    }

    nonce++;
    if (nonce % BATCH_SIZE === 0) {
      onProgress?.(nonce);
      // Yield to UI thread in browser
      if (typeof requestAnimationFrame !== "undefined") {
        await new Promise((r) => requestAnimationFrame(r));
      }
    }
  }
}

export async function createGenesisBlock(): Promise<Block> {
  const block = {
    index: 0,
    timestamp: new Date().toISOString(),
    data: "Bloco Gênese",
    previousHash: "0",
    nonce: 0,
  };
  const hash = await calculateHash(block);
  return { ...block, hash };
}

export async function addBlock(
  chain: Block[],
  data: string,
  difficulty: number,
  onProgress?: (nonce: number) => void,
  signal?: AbortSignal
): Promise<Block[]> {
  const lastBlock = chain[chain.length - 1];
  const newBlock = {
    index: lastBlock.index + 1,
    timestamp: new Date().toISOString(),
    data,
    previousHash: lastBlock.hash,
    nonce: 0,
  };
  const minedBlock = await mineBlock(newBlock, difficulty, onProgress, signal);
  return [...chain, minedBlock];
}

export async function isChainValid(chain: Block[]): Promise<boolean> {
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const previous = chain[i - 1];

    // Check hash linkage
    if (current.previousHash !== previous.hash) return false;

    // Verify current block's hash
    const recalculated = await calculateHash({
      index: current.index,
      timestamp: current.timestamp,
      data: current.data,
      previousHash: current.previousHash,
      nonce: current.nonce,
    });
    if (recalculated !== current.hash) return false;
  }
  return true;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/__tests__/blockchain.test.ts --no-cache`
Expected: all 9 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tokenization/blockchain.ts src/lib/__tests__/blockchain.test.ts
git commit -m "feat(mod5): add blockchain engine with SHA-256 mining and chain validation"
```

---

## Task 3: Lifecycle Simulation Engine (TDD)

**Files:**
- Create: `src/lib/tokenization/lifecycle-sim.ts`
- Create: `src/lib/__tests__/lifecycle-sim.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/lib/__tests__/lifecycle-sim.test.ts
import {
  simulateRealEstate,
  simulateBond,
  mulberry32,
} from "../tokenization/lifecycle-sim";

describe("mulberry32", () => {
  it("produces deterministic output for same seed", () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it("produces values between 0 and 1", () => {
    const rng = mulberry32(42);
    const values = Array.from({ length: 1000 }, () => rng());
    values.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    });
  });
});

describe("simulateRealEstate", () => {
  it("returns correct number of months", () => {
    const result = simulateRealEstate(5);
    expect(result.months).toHaveLength(60);
    expect(result.prices).toHaveLength(60);
    expect(result.dividends).toHaveLength(60);
  });

  it("starts at base value", () => {
    const result = simulateRealEstate(1, 100);
    expect(result.prices[0]).toBe(100);
  });

  it("calculates ROI correctly", () => {
    const result = simulateRealEstate(1, 100, 0, 0.01); // zero volatility, 1% yield
    // With zero volatility, price stays at 100. dividends[0]=0, months 1-11 each = 1.0 → total = 11
    expect(result.totalDividends).toBeCloseTo(11, 0);
    expect(result.capitalGain).toBeCloseTo(0, 0);
    expect(result.roi).toBeCloseTo(11, 0);
  });

  it("is deterministic with same seed", () => {
    const r1 = simulateRealEstate(3, 100, 0.02, 0.005, 42);
    const r2 = simulateRealEstate(3, 100, 0.02, 0.005, 42);
    expect(r1.prices).toEqual(r2.prices);
    expect(r1.roi).toBe(r2.roi);
  });
});

describe("simulateBond", () => {
  it("returns adimplente with 0% default probability", () => {
    const result = simulateBond(5, 1000, 0.10, 0, 42);
    expect(result.status).toBe("Adimplente");
    expect(result.cashFlows).toHaveLength(5);
    // Last year includes principal
    expect(result.cashFlows[4]).toBe(1100); // 100 coupon + 1000 principal
  });

  it("returns correct coupon payments when no default", () => {
    const result = simulateBond(3, 1000, 0.10, 0, 42);
    expect(result.cashFlows[0]).toBe(100);
    expect(result.cashFlows[1]).toBe(100);
    expect(result.cashFlows[2]).toBe(1100);
  });

  it("handles year-1 default", () => {
    // Use seed that triggers default on year 1 with high default prob
    const result = simulateBond(5, 1000, 0.10, 1.0, 42); // 100% default
    expect(result.status).toBe("Default (Calote)");
    expect(result.defaultYear).toBe(1);
    expect(result.cashFlows[0]).toBe(0);
  });

  it("stops cash flows after default", () => {
    const result = simulateBond(10, 1000, 0.10, 1.0, 42);
    expect(result.cashFlows).toHaveLength(1); // only default year
  });

  it("handles default on final year", () => {
    // With 100% default prob, default always occurs on year 1.
    // To test last-year default, use a seed where rng() < defaultProb on last year only.
    // Easier: test with years=1 and 100% default — default IS the final year
    const result = simulateBond(1, 1000, 0.10, 1.0, 42);
    expect(result.status).toBe("Default (Calote)");
    expect(result.defaultYear).toBe(1);
    expect(result.cashFlows).toEqual([0]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/__tests__/lifecycle-sim.test.ts --no-cache`
Expected: FAIL — module not found

- [ ] **Step 3: Implement lifecycle-sim.ts**

```typescript
// src/lib/tokenization/lifecycle-sim.ts
import type { RealEstateResult, BondResult } from "./types";

export function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller transform for normal distribution
function normalRandom(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
}

export function simulateRealEstate(
  years: number,
  baseValue = 100,
  volatility = 0.02,
  yieldRate = 0.005,
  seed = 42
): RealEstateResult {
  const rng = mulberry32(seed);
  const totalMonths = years * 12;
  const months: number[] = [];
  const prices: number[] = [baseValue];
  const dividends: number[] = [0];

  for (let m = 1; m < totalMonths; m++) {
    const change = normalRandom(rng) * volatility;
    const newPrice = prices[m - 1] * (1 + change);
    prices.push(newPrice);
    dividends.push(newPrice * yieldRate);
  }

  months.push(...Array.from({ length: totalMonths }, (_, i) => i + 1));

  const totalDividends = dividends.reduce((sum, d) => sum + d, 0);
  const capitalGain = prices[prices.length - 1] - prices[0];
  const roi = ((totalDividends + capitalGain) / prices[0]) * 100;

  return { months, prices, dividends, totalDividends, capitalGain, roi };
}

export function simulateBond(
  years: number,
  parValue = 1000,
  couponRate = 0.1,
  defaultProb = 0.02,
  seed = 42
): BondResult {
  const rng = mulberry32(seed);
  const cashFlows: number[] = [];
  const yearsArr: number[] = [];
  let status: BondResult["status"] = "Adimplente";
  let defaultYear: number | undefined;

  for (let y = 1; y <= years; y++) {
    if (rng() < defaultProb) {
      status = "Default (Calote)";
      defaultYear = y;
      cashFlows.push(0);
      yearsArr.push(y);
      break;
    }
    const coupon = parValue * couponRate;
    cashFlows.push(y === years ? coupon + parValue : coupon);
    yearsArr.push(y);
  }

  return { years: yearsArr, cashFlows, status, defaultYear };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/__tests__/lifecycle-sim.test.ts --no-cache`
Expected: all 11 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tokenization/lifecycle-sim.ts src/lib/__tests__/lifecycle-sim.test.ts
git commit -m "feat(mod5): add lifecycle simulation engine with seeded PRNG"
```

---

## Task 4: Risk Calculation Engine (TDD)

**Files:**
- Create: `src/lib/tokenization/risk-calc.ts`
- Create: `src/lib/__tests__/risk-calc.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/lib/__tests__/risk-calc.test.ts
import { calculateRiskImpacts } from "../tokenization/risk-calc";

describe("calculateRiskImpacts", () => {
  it("returns 6 risk categories", () => {
    const result = calculateRiskImpacts(0, false, false);
    expect(result.categories).toHaveLength(6);
    expect(result.impacts).toHaveLength(6);
    expect(result.categories).toEqual([
      "Mercado",
      "Operacional",
      "Cibernético",
      "Regulatório",
      "Liquidez",
      "Custódia",
    ]);
  });

  it("returns base impacts with no stress", () => {
    const result = calculateRiskImpacts(0, false, false);
    expect(result.impacts).toEqual([30, 20, 50, 40, 25, 35]);
  });

  it("increases market + liquidity risk on high market shock", () => {
    const result = calculateRiskImpacts(60, false, false);
    expect(result.impacts[0]).toBe(70); // Mercado: 30 + 40
    expect(result.impacts[4]).toBe(55); // Liquidez: 25 + 30
  });

  it("increases moderate market risk on medium shock", () => {
    const result = calculateRiskImpacts(30, false, false);
    expect(result.impacts[0]).toBe(50); // Mercado: 30 + 20
  });

  it("maxes cyber risk on tech failure", () => {
    const result = calculateRiskImpacts(0, true, false);
    expect(result.impacts[2]).toBe(100); // Cibernético
    expect(result.impacts[1]).toBe(70); // Operacional: 20 + 50
  });

  it("increases regulatory + liquidity on reg change", () => {
    const result = calculateRiskImpacts(0, false, true);
    expect(result.impacts[3]).toBe(90); // Regulatório
    expect(result.impacts[4]).toBe(65); // Liquidez: 25 + 40
  });

  it("combines all stresses", () => {
    const result = calculateRiskImpacts(60, true, true);
    expect(result.impacts[0]).toBe(70); // Mercado
    expect(result.impacts[1]).toBe(70); // Operacional
    expect(result.impacts[2]).toBe(100); // Cibernético (capped)
    expect(result.impacts[3]).toBe(90); // Regulatório
    expect(result.impacts[4]).toBeGreaterThanOrEqual(95); // Liquidez: 25+30+40=95
    expect(result.impacts[5]).toBe(35); // Custódia unchanged
  });

  it("caps all impacts at 100", () => {
    const result = calculateRiskImpacts(100, true, true);
    result.impacts.forEach((impact) => {
      expect(impact).toBeLessThanOrEqual(100);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/__tests__/risk-calc.test.ts --no-cache`
Expected: FAIL

- [ ] **Step 3: Implement risk-calc.ts**

```typescript
// src/lib/tokenization/risk-calc.ts
import type { RiskImpactResult } from "./types";

export function calculateRiskImpacts(
  marketShock: number,
  techFail: boolean,
  regChange: boolean
): RiskImpactResult {
  const categories = [
    "Mercado",
    "Operacional",
    "Cibernético",
    "Regulatório",
    "Liquidez",
    "Custódia",
  ];
  // Base impacts (matching Python source)
  const impacts = [30, 20, 50, 40, 25, 35];

  // Market shock stress
  if (marketShock > 50) {
    impacts[0] += 40; // Mercado
    impacts[4] += 30; // Liquidez
  } else if (marketShock > 20) {
    impacts[0] += 20; // Mercado
  }

  // Tech failure stress
  if (techFail) {
    impacts[2] = 100; // Cibernético max
    impacts[1] += 50; // Operacional
  }

  // Regulatory change stress
  if (regChange) {
    impacts[3] = 90; // Regulatório
    impacts[4] += 40; // Liquidez
  }

  // Cap at 100
  return {
    categories,
    impacts: impacts.map((v) => Math.min(v, 100)),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/__tests__/risk-calc.test.ts --no-cache`
Expected: all 8 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tokenization/risk-calc.ts src/lib/__tests__/risk-calc.test.ts
git commit -m "feat(mod5): add risk calculation engine with stress test logic"
```

---

## Task 5: Barrel Export

**Files:**
- Create: `src/lib/tokenization/index.ts`

- [ ] **Step 1: Create barrel export**

```typescript
// src/lib/tokenization/index.ts
export * from "./types";
export * from "./constants";
export {
  calculateHash,
  mineBlock,
  createGenesisBlock,
  addBlock,
  isChainValid,
} from "./blockchain";
export {
  mulberry32,
  simulateRealEstate,
  simulateBond,
} from "./lifecycle-sim";
export { calculateRiskImpacts } from "./risk-calc";
```

- [ ] **Step 2: Run all tests to verify nothing broke**

Run: `npx jest src/lib/__tests__/ --no-cache`
Expected: all tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/tokenization/index.ts
git commit -m "feat(mod5): add barrel export for tokenization lib"
```

---

## Task 6: Page Scaffolding + StepperNav + OpeningHero

**Files:**
- Create: `src/app/modulo/5/page.tsx`
- Create: `src/components/modulo5/StepperNav.tsx`
- Create: `src/components/modulo5/OpeningHero.tsx`
- Create: `src/components/modulo5/TokenKinetic.tsx`

**Reference:** Module 3 patterns at `src/app/modulo/3/page.tsx`, `src/components/modulo3/OpeningHero.tsx`, `src/components/modulo3/StepperNav.tsx`, `src/components/modulo3/FidcKinetic.tsx`

- [ ] **Step 1: Create StepperNav.tsx**

Adapt from `src/components/modulo3/StepperNav.tsx` — same structure but import STEPS from `@/lib/tokenization/constants` and update the `aria-label` to "Etapas da jornada de Tokenização". Use 6 steps instead of 5. Mobile stepper shows current step with prev/next chevrons.

- [ ] **Step 2: Create TokenKinetic.tsx**

Animated tokenization flow visual for the hero. Shows: building icon → smart contract icon → 3 token coins spreading out. Uses CSS animations (`@keyframes`), gradient lines connecting elements, and a pulsing dot on the connecting lines. Styled with glass-panel, hidden on mobile (`hidden lg:block`). Follow the `FidcKinetic.tsx` pattern for structure.

- [ ] **Step 3: Create OpeningHero.tsx**

Adapt from `src/components/modulo3/OpeningHero.tsx`:
- Badge: "Módulo 5" + "Tokenização" (same two-part badge pattern)
- Headline: `Tokenização de <gradient>Ativos</gradient>`
- Subtitle: "Exploração da tecnologia blockchain..."
- CTA: "Iniciar Jornada" with `rocket_launch` icon
- Right column: `<TokenKinetic />`
- Gradient blur blobs for background effect

- [ ] **Step 4: Create page.tsx with step routing**

Adapt from `src/app/modulo/3/page.tsx`:
- Suspense wrapper
- `useSearchParams` + `useRouter` for `?step=N`
- `handleStepChange` callback
- `handleStartJourney` callback
- Conditional rendering: `{activeStep >= 0 && <StepperNav ... />}`
- Step router: `{activeStep === 0 && <FundamentosStep />}` etc. (all 6 steps, initially render placeholder `<div>` for steps 1-5)
- Prev/Next buttons at bottom (same pattern as Module 3)
- Import STEPS from `@/lib/tokenization/constants`

- [ ] **Step 5: Verify — start dev server and check /modulo/5**

Run: `npm run dev`
Check: http://localhost:3000/modulo/5
Expected: Hero renders with badge, headline, kinetic visual, CTA. Clicking CTA shows stepper with 6 steps. Prev/Next navigate. URL updates to `?step=N`. Placeholder divs show for each step.

- [ ] **Step 6: Commit**

```bash
git add src/app/modulo/5/page.tsx src/components/modulo5/
git commit -m "feat(mod5): add page scaffolding with hero, stepper, and step routing"
```

---

## Task 7: Step 1 — Fundamentos

**Files:**
- Create: `src/components/modulo5/FundamentosStep.tsx`

**Reference:** Uses `CONCEPT_CARDS`, `TOKEN_CLASSIFICATIONS`, `FLOW_STEPS`, `FLOW_EDGES` from constants.

- [ ] **Step 1: Implement FundamentosStep.tsx**

Three vertical sections:

1. **Concept Cards:** `useState` for `expandedCards: Set<string>`. Render 4 cards in 2×2 grid (`grid-cols-1 md:grid-cols-2`). Each card is a glass-panel with click-to-expand (toggle card ID in set). First card expanded by default. Content renders markdown-like bold text.

2. **Tokenization Flow Diagram:** Horizontal flex layout with `FLOW_STEPS` as styled boxes (each with Material icon, label, sublabel, colored left border) connected by gradient lines with `FLOW_EDGES` labels. Wraps on mobile.

3. **Token Classifier:** `useState` for `selectedAsset` (default first key). `<select>` dropdown styled with dark theme. Below it, 4 metric cards in 2×2 grid showing the classification values from `TOKEN_CLASSIFICATIONS[selectedAsset]`.

Follow `ViabilidadeModule.tsx` patterns for card styling, section headers with Material icons, and metric display.

- [ ] **Step 2: Wire into page.tsx**

Replace the placeholder for `activeStep === 0` with `<FundamentosStep />`.

- [ ] **Step 3: Verify in dev server**

Check: http://localhost:3000/modulo/5?step=0
Expected: Cards expand/collapse, flow diagram renders horizontally, classifier dropdown updates metrics reactively.

- [ ] **Step 4: Commit**

```bash
git add src/components/modulo5/FundamentosStep.tsx src/app/modulo/5/page.tsx
git commit -m "feat(mod5): add Step 1 Fundamentos with concept cards, flow diagram, and classifier"
```

---

## Task 8: Step 2 — Mecânica da Tokenização + Chart

**Files:**
- Create: `src/components/modulo5/MecanicaStep.tsx`
- Create: `src/components/modulo5/charts/TokenDistributionChart.tsx`

**Reference:** `ViabilidadeModule.tsx` for two-column layout, `WaterfallChart.tsx` for Plotly pattern.

- [ ] **Step 1: Create TokenDistributionChart.tsx**

Plotly donut chart. Props: `distribution: Array<{ stakeholder: string; quantidade: number }>`, `assetName: string`. Use `dynamic(() => import("react-plotly.js"), { ssr: false })`. Trace type: `"pie"` with `hole: 0.4`. Colors: `["#00f2ff", "#4edea3", "#8b5cf6", "#ef4444"]`. Dark theme layout matching `WaterfallChart.tsx` pattern.

- [ ] **Step 2: Create MecanicaStep.tsx**

State: `MecanicaParams` with defaults. `useMemo` computes `MecanicaResult` from params.

Computation logic (inline, no separate file needed):
```typescript
const result = useMemo((): MecanicaResult => {
  const tokenPrice = params.valuation / params.fractionCount;
  const distribution = TOKEN_DISTRIBUTION.map((d) => ({
    stakeholder: d.stakeholder,
    quantidade: params.fractionCount * d.percentage,
  }));
  const riskFlags: MecanicaResult["riskFlags"] = [];
  if (tokenPrice < 10) {
    riskFlags.push({ level: "warning", message: "Risco de Pulverização: Preço muito baixo pode atrair especulação excessiva." });
  }
  if (params.custodyQuality === "Baixa/Inexistente") {
    riskFlags.push({ level: "error", message: "Risco Crítico: Sem custódia robusta, o token não tem lastro real." });
  } else if (params.custodyQuality === "Média (Auditoria Anual)") {
    riskFlags.push({ level: "warning", message: "Atenção: Auditoria anual pode não capturar fraudes em tempo real." });
  } else {
    riskFlags.push({ level: "success", message: "Estrutura Robusta: Custódia de alta qualidade mitiga risco de contraparte." });
  }
  return { tokenPrice, marketCap: params.valuation, distribution, riskFlags };
}, [params]);
```

Layout: `grid-cols-1 lg:grid-cols-2`. Left column: inputs (text input, number input, range slider, select, 3-level slider). Right column: metric cards + TokenDistributionChart + risk flags. Use `SliderField` sub-component pattern from `ViabilidadeModule.tsx`.

**Accessibility & responsive:** Risk flag cards must include Material Symbol icons alongside text (not color alone): `warning` for warning, `error` for error, `check_circle` for success. Two-column layout stacks vertically on mobile. Symbol input should be restricted to alphanumeric characters (regex `[A-Z0-9]`) to prevent invalid Solidity contract names downstream.

- [ ] **Step 3: Wire into page.tsx**

Replace placeholder for `activeStep === 1`.

- [ ] **Step 4: Verify in dev server**

Check: http://localhost:3000/modulo/5?step=1
Expected: All inputs drive output updates reactively. Donut chart renders. Risk flags change based on custody quality and token price.

- [ ] **Step 5: Commit**

```bash
git add src/components/modulo5/MecanicaStep.tsx src/components/modulo5/charts/TokenDistributionChart.tsx src/app/modulo/5/page.tsx
git commit -m "feat(mod5): add Step 2 Mecânica with fractionalization simulator and donut chart"
```

---

## Task 9: Step 3 — Blockchain Sandbox

**Files:**
- Create: `src/components/modulo5/BlockchainSandboxStep.tsx`

**Reference:** Uses `blockchain.ts` engine. Custom SVG/CSS chain visualization.

- [ ] **Step 1: Implement BlockchainSandboxStep.tsx**

State:
- `blockchain: Block[]` — initialized with genesis block via `useEffect` (async `createGenesisBlock`)
- `miningState: MiningState` — tracks mining progress
- `txData: string` — text input
- `difficulty: number` — slider 1-4
- `selectedBlock: Block | null` — for detail popover
- `abortRef: React.MutableRefObject<AbortController | null>`

Mining handler:
```typescript
const handleMine = async () => {
  const controller = new AbortController();
  abortRef.current = controller;
  setMiningState({ isMining: true, currentNonce: 0, elapsedMs: 0 });
  try {
    const newChain = await addBlock(blockchain, txData, difficulty,
      (nonce) => setMiningState((s) => ({ ...s, currentNonce: nonce })),
      controller.signal
    );
    setBlockchain(newChain);
  } catch (e) {
    if (e instanceof Error && e.message.includes("timeout")) {
      // Show timeout message
    }
  } finally {
    setMiningState({ isMining: false, currentNonce: 0, elapsedMs: 0 });
    abortRef.current = null;
  }
};
```

Chain Explorer: Horizontal scrollable container (`overflow-x-auto`). Each block rendered as a glass-panel card (150px wide) showing:
- Block index (header, colored)
- Data (truncated to 15 chars)
- Hash (truncated to 8 chars with monospace)
- Prev Hash (truncated)
- Nonce
- Click → sets `selectedBlock` for full details modal

Blocks connected by gradient lines (absolute positioned divs between cards). Genesis block has yellow-ish border, others cyan.

Attack Lab: Educational `<details>` section below the chain with explanation about immutability.

**Accessibility & responsive:** Each block card includes `aria-label` with full block summary (e.g., "Bloco #1, Dados: Transação 1, Hash: abc123..., Nonce: 42"). Add a `sr-only` fallback `<table>` rendering the chain data for screen readers. Mining button shows visible focus ring during operation (`ring-2 ring-primary-container`). Mining button disabled during active mine. On mobile, chain scrolls horizontally with `overflow-x-auto` and a subtle gradient fade on the right edge as scroll indicator. Controls stack vertically on mobile.

- [ ] **Step 2: Wire into page.tsx**

Replace placeholder for `activeStep === 2`.

- [ ] **Step 3: Verify in dev server**

Check: http://localhost:3000/modulo/5?step=2
Expected: Genesis block shows on load. Mining adds blocks with spinner + nonce counter. Chain visualizes horizontally. Difficulty affects mining time. Reset clears to genesis. Block click shows details.

- [ ] **Step 4: Commit**

```bash
git add src/components/modulo5/BlockchainSandboxStep.tsx src/app/modulo/5/page.tsx
git commit -m "feat(mod5): add Step 3 Blockchain Sandbox with mining and chain explorer"
```

---

## Task 10: Step 4 — Ciclo de Vida + Charts + Animation Embed

**Files:**
- Create: `src/components/modulo5/CicloVidaStep.tsx`
- Create: `src/components/modulo5/charts/LifecycleChart.tsx`
- Create: `src/components/modulo5/charts/CashFlowChart.tsx`
- Create: `src/components/modulo5/AnimacaoEmbed.tsx`
- Create: `public/animations/tokenization-journey.html`

**Reference:** `AnimacaoModule.tsx` for iframe pattern, `WaterfallChart.tsx` / `SensitivityChart.tsx` for Plotly patterns.

- [ ] **Step 1: Extract animation HTML**

Copy the animation HTML from `python-code/module_05_tokenization.py` lines 607-1515 (the full `tokenization_animation_html` string). Save to `public/animations/tokenization-journey.html`. This is the complete standalone HTML document with embedded React/Babel. No modifications needed — it runs as-is in an iframe.

- [ ] **Step 2: Create AnimacaoEmbed.tsx**

Follow `src/components/modulo3/AnimacaoModule.tsx` pattern:
- `useState` for `loaded` boolean
- Loading spinner overlay
- iframe with `src="/animations/tokenization-journey.html"`, `sandbox="allow-scripts allow-same-origin"`, `loading="lazy"`, `title="Jornada da Tokenização — Animação Interativa"`, `onLoad` callback
- `min-h-[700px]`
- Include `<noscript><p>Animação interativa mostrando as 8 etapas da jornada de tokenização de ativos.</p></noscript>` as fallback inside the iframe container

- [ ] **Step 3: Create LifecycleChart.tsx**

Plotly line chart. Props: `result: RealEstateResult`. Two traces: "Preço do Token (R$)" and "Dividendos Pagos (R$)". X-axis: months. Colors: cyan for price, green for dividends. Dark theme layout.

- [ ] **Step 4: Create CashFlowChart.tsx**

Plotly bar chart. Props: `result: BondResult`. Single trace: "Fluxo de Caixa". X-axis: years. Bar color: green for positive, red for 0. Dark theme layout.

- [ ] **Step 5: Create CicloVidaStep.tsx**

State:
- `scenario: "imovel" | "debenture"`
- `years: number` (slider 1-10, default 5)
- `defaultProb: number` (slider 0-0.20, default 0.02, only for debênture)
- `seed: number` (default 42)

`useMemo` for simulation results based on scenario + params + seed.

Layout:
- Scenario toggle buttons (styled like tab buttons)
- Parameter sliders
- Chart (LifecycleChart or CashFlowChart based on scenario)
- Metrics panel (3 metric cards for imóvel; status badge + narrative for debênture)
- "Re-simular" button (sets seed to `Date.now()`)
- Year-1 default edge case: red callout card with educational note
- Divider + AnimacaoEmbed section below

- [ ] **Step 6: Wire into page.tsx**

Replace placeholder for `activeStep === 3`.

- [ ] **Step 7: Verify in dev server**

Check: http://localhost:3000/modulo/5?step=3
Expected: Toggle between imóvel/debênture. Charts render and update with slider changes. Re-simular gives new results. Animation iframe loads below. Year-1 default shows red callout (set default prob to 100% to test).

- [ ] **Step 8: Commit**

```bash
git add src/components/modulo5/CicloVidaStep.tsx src/components/modulo5/charts/LifecycleChart.tsx src/components/modulo5/charts/CashFlowChart.tsx src/components/modulo5/AnimacaoEmbed.tsx public/animations/tokenization-journey.html src/app/modulo/5/page.tsx
git commit -m "feat(mod5): add Step 4 Ciclo de Vida with lifecycle sim, charts, and animation embed"
```

---

## Task 11: Step 5 — Riscos & Casos Reais + Heatmap

**Files:**
- Create: `src/components/modulo5/RiscosCasosStep.tsx`
- Create: `src/components/modulo5/charts/RiskHeatmap.tsx`

**Reference:** `CASE_STUDIES` from constants. `risk-calc.ts` engine.

- [ ] **Step 1: Create RiskHeatmap.tsx**

Plotly heatmap. Props: `result: RiskImpactResult`. Single-row heatmap with `type: "heatmap"`, `z: [result.impacts]`, `x: result.categories`, `y: ["Impacto"]`. Color scale: `"RdYlGn_r"` (red=high, green=low). Range: `[0, 100]`. Text overlays showing values. Dark theme layout. Height: 200px.

- [ ] **Step 2: Create RiscosCasosStep.tsx**

State:
- `marketShock: number` (slider 0-100, default 20)
- `techFail: boolean` (checkbox)
- `regChange: boolean` (checkbox)
- `activeCase: string` (default "fidc")

`useMemo` for risk results via `calculateRiskImpacts`.

Layout:
- **Top section (Stress Test):** Left column: sliders/checkboxes. Right: RiskHeatmap. Caption below.
- **Bottom section (Casos Reais):** 3 tab buttons (from `CASE_STUDIES`). Active tab shows title, content (rendered as markdown-like text with bold), metric card if present, callout card (info blue or warning yellow).

Follow `ViabilidadeModule.tsx` pattern for slider components. Tabs follow the same pattern as Module 3's `ChecklistModule` section toggles.

**Accessibility & responsive:** RiskHeatmap gets `aria-label` describing current risk levels (e.g., "Matriz de risco: Mercado 70, Operacional 20..."). Add a text summary below the chart for screen readers: a `sr-only` paragraph listing each category and its impact value. On mobile (< 768px), case study tabs transform into an accordion (`<details>/<summary>`) pattern — each case study becomes a collapsible section instead of a tab. Heatmap takes full width.

- [ ] **Step 3: Wire into page.tsx**

Replace placeholder for `activeStep === 4`.

- [ ] **Step 4: Verify in dev server**

Check: http://localhost:3000/modulo/5?step=4
Expected: Heatmap updates reactively with slider/checkbox changes. All 3 case studies render with correct content. Callouts show correct types (info/warning).

- [ ] **Step 5: Commit**

```bash
git add src/components/modulo5/RiscosCasosStep.tsx src/components/modulo5/charts/RiskHeatmap.tsx src/app/modulo/5/page.tsx
git commit -m "feat(mod5): add Step 5 Riscos & Casos with stress test heatmap and case studies"
```

---

## Task 12: Step 6 — Smart Contracts & Quiz

**Files:**
- Create: `src/components/modulo5/ContratosQuizStep.tsx`

**Reference:** `ERC20_TEMPLATE`, `WHITELIST_TEMPLATE`, `QUIZ_QUESTIONS` from constants.

- [ ] **Step 1: Implement ContratosQuizStep.tsx**

State:
- `contractType: "erc20" | "whitelist"` (default "erc20")
- `supply: number` (default 1000000)
- `symbol: string` (default "MTOKEN")
- `quizState: QuizState` (answers: {}, revealed: {}, score: 0)

**Smart Contract section:**
- Contract type toggle buttons
- ERC-20: supply number input + symbol text input. Code block shows `ERC20_TEMPLATE(symbol, supply)`. Dynamic — updates as user types.
- Whitelist: static code block shows `WHITELIST_TEMPLATE`
- Code block: `<pre>` with monospace font, dark background (`bg-surface-container-lowest`), rounded corners, overflow-x-auto, padding. Syntax highlighting via simple regex-based coloring (keywords in cyan, strings in green, comments in grey) or just plain monospace text.
- Caption below each variant

**Quiz section:**
- Section header: "Avaliação de Conhecimento"
- Score counter: `aria-live="polite"` div showing `${score}/3 corretas`
- 3 questions rendered vertically (all visible):
  - Question text
  - Radio group (`role="radiogroup"`) with options
  - "Verificar" button (disabled if no option selected, disabled after revealed)
  - On reveal: correct option → green border, selected wrong → red border, explanation card appears
  - Radios disabled after reveal
- After all 3 revealed: summary card
  - 3/3: green, "Parabéns! Você é um Mestre da Tokenização!"
  - 2/3: yellow, "Bom trabalho!"
  - ≤1: red, "Revise os módulos anteriores."

- [ ] **Step 2: Wire into page.tsx**

Replace placeholder for `activeStep === 5`.

- [ ] **Step 3: Verify in dev server**

Check: http://localhost:3000/modulo/5?step=5
Expected: Contract code updates dynamically for ERC-20. Whitelist shows static code. Quiz radios work, verify locks answers, explanations show, score updates, summary appears after all 3.

- [ ] **Step 4: Commit**

```bash
git add src/components/modulo5/ContratosQuizStep.tsx src/app/modulo/5/page.tsx
git commit -m "feat(mod5): add Step 6 Smart Contracts viewer and enhanced quiz"
```

---

## Task 13: Production Build Verification

- [ ] **Step 1: Run linter**

Run: `npm run lint`
Expected: No errors. Fix any warnings if present.

- [ ] **Step 2: Run all tests**

Run: `npm test`
Expected: All tests pass (blockchain, lifecycle-sim, risk-calc).

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors. Check for any TypeScript or Next.js compilation issues.

- [ ] **Step 4: Verify all 6 steps in dev server**

Walk through http://localhost:3000/modulo/5 end-to-end:
1. Hero renders → click CTA
2. Step 1: expand/collapse cards, change classifier
3. Step 2: adjust sliders, verify chart updates
4. Step 3: mine blocks, check chain visualization
5. Step 4: toggle scenarios, check charts, verify animation iframe
6. Step 5: stress test heatmap, browse case studies
7. Step 6: switch contracts, complete quiz

- [ ] **Step 5: Final commit if any lint/build fixes were needed**

```bash
git add -A
git commit -m "fix(mod5): address lint and build issues"
```
