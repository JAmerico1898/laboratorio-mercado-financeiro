// src/lib/tokenization/blockchain.ts
import type { Block } from "./types";

const getCrypto = (): Pick<Crypto, "subtle"> => {
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    return globalThis.crypto;
  }
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
    if (current.previousHash !== previous.hash) return false;
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
