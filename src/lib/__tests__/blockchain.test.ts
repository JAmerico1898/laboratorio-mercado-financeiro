// src/lib/__tests__/blockchain.test.ts
import {
  calculateHash,
  mineBlock,
  createGenesisBlock,
  addBlock,
  isChainValid,
} from "../tokenization/blockchain";


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
