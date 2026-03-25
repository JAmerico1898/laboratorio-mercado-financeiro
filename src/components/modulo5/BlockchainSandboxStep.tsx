"use client";

import { useState, useEffect, useRef } from "react";
import type { Block, MiningState } from "@/lib/tokenization/types";
import { createGenesisBlock, addBlock } from "@/lib/tokenization/blockchain";
import SliderField from "@/components/modulo5/SliderField";

interface BlockCardProps {
  block: Block;
  isGenesis: boolean;
  onClick: () => void;
}

function BlockCard({ block, isGenesis, onClick }: BlockCardProps) {
  const borderClass = isGenesis ? "border-yellow-500/30" : "border-primary-container/30";
  const headerBg = isGenesis ? "bg-yellow-500/10" : "bg-primary-container/10";
  const headerText = isGenesis ? "text-yellow-400" : "text-primary-container";

  const ariaLabel = `Bloco ${block.index}: dados "${block.data}", hash ${block.hash}, hash anterior ${block.previousHash}, nonce ${block.nonce}, timestamp ${block.timestamp}`;

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`min-w-[180px] rounded-2xl border bg-surface-container/60 backdrop-blur-sm cursor-pointer hover:bg-surface-container-high/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary-container ${borderClass}`}
    >
      <div className={`px-3 py-2 rounded-t-2xl ${headerBg}`}>
        <p className={`text-xs font-bold ${headerText}`}>
          {isGenesis ? "Gênese" : `Bloco #${block.index}`}
        </p>
      </div>
      <div className="px-3 py-3 space-y-1.5 text-left">
        <div className="flex justify-between gap-2">
          <span className="text-xs text-on-surface-variant">Data</span>
          <span className="text-xs text-on-surface font-medium truncate max-w-[100px]">
            {block.data.slice(0, 15)}{block.data.length > 15 ? "…" : ""}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-xs text-on-surface-variant">Hash</span>
          <span className="text-xs font-mono text-primary-container">
            {block.hash.slice(0, 8)}…
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-xs text-on-surface-variant">Anterior</span>
          <span className="text-xs font-mono text-on-surface-variant">
            {block.previousHash === "0" ? "0" : `${block.previousHash.slice(0, 8)}…`}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-xs text-on-surface-variant">Nonce</span>
          <span className="text-xs font-medium text-on-surface tabular-nums">{block.nonce}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-xs text-on-surface-variant">Hora</span>
          <span className="text-xs text-on-surface-variant">
            {new Date(block.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </div>
    </button>
  );
}

interface BlockDetailModalProps {
  block: Block;
  onClose: () => void;
}

function BlockDetailModal({ block, onClose }: BlockDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-container rounded-2xl border border-outline-variant/30 p-6 max-w-lg w-full space-y-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes do Bloco #${block.index}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary-container">dataset</span>
            {block.index === 0 ? "Bloco Gênese" : `Bloco #${block.index}`}
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-3 divide-y divide-outline-variant/10">
          <div className="pb-2">
            <p className="text-xs text-on-surface-variant mb-1">Índice</p>
            <p className="text-sm font-medium text-on-surface">{block.index}</p>
          </div>
          <div className="py-2">
            <p className="text-xs text-on-surface-variant mb-1">Dados</p>
            <p className="text-sm text-on-surface break-words">{block.data}</p>
          </div>
          <div className="py-2">
            <p className="text-xs text-on-surface-variant mb-1">Hash</p>
            <p className="text-xs font-mono text-primary-container break-all">{block.hash}</p>
          </div>
          <div className="py-2">
            <p className="text-xs text-on-surface-variant mb-1">Hash Anterior</p>
            <p className="text-xs font-mono text-on-surface-variant break-all">{block.previousHash}</p>
          </div>
          <div className="py-2">
            <p className="text-xs text-on-surface-variant mb-1">Nonce</p>
            <p className="text-sm font-medium text-on-surface tabular-nums">{block.nonce}</p>
          </div>
          <div className="pt-2">
            <p className="text-xs text-on-surface-variant mb-1">Timestamp</p>
            <p className="text-sm text-on-surface">{new Date(block.timestamp).toLocaleString("pt-BR")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlockchainSandboxStep() {
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [miningState, setMiningState] = useState<MiningState>({ isMining: false, currentNonce: 0, elapsedMs: 0 });
  const [txData, setTxData] = useState("Transação Inicial");
  const [difficulty, setDifficulty] = useState(2);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [miningError, setMiningError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    createGenesisBlock().then((genesis) => setBlockchain([genesis]));
  }, []);

  const handleMine = async () => {
    const controller = new AbortController();
    abortRef.current = controller;
    setMiningError(null);
    setMiningState({ isMining: true, currentNonce: 0, elapsedMs: 0 });
    try {
      const newChain = await addBlock(
        blockchain,
        txData,
        difficulty,
        (nonce) => setMiningState((s) => ({ ...s, currentNonce: nonce })),
        controller.signal
      );
      setBlockchain(newChain);
    } catch (e) {
      if (e instanceof Error && e.message.includes("timeout")) {
        setMiningError("Mineração cancelada — tente reduzir a dificuldade");
      }
    } finally {
      setMiningState({ isMining: false, currentNonce: 0, elapsedMs: 0 });
      abortRef.current = null;
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    createGenesisBlock().then((genesis) => setBlockchain([genesis]));
    setSelectedBlock(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Controls Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary-container">link</span>
            Sandbox: Construa sua Blockchain
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Entenda como a imutabilidade funciona na prática visualizando hashs e blocos.
          </p>
        </div>

        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/40 p-5 space-y-5">
          {/* Transaction input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="txData" className="text-sm text-on-surface-variant font-medium">
              Dados da Transação
            </label>
            <input
              id="txData"
              type="text"
              value={txData}
              onChange={(e) => setTxData(e.target.value)}
              placeholder="Ex: Alice envia 10 BTC para Bob"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container/60 transition-colors"
            />
          </div>

          {/* Difficulty slider */}
          <SliderField
            label="Dificuldade de Mineração"
            value={difficulty}
            min={1}
            max={4}
            step={1}
            displayValue={`${difficulty} zero${difficulty !== 1 ? "s" : ""}`}
            onChange={setDifficulty}
          />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleMine}
              disabled={miningState.isMining}
              aria-busy={miningState.isMining}
              className={`px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold flex items-center gap-2 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed ${miningState.isMining ? "ring-2 ring-primary-container" : ""}`}
            >
              {miningState.isMining ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Minerando... (Nonce: {miningState.currentNonce})
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">memory</span>
                  Minerar Bloco
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface-variant font-medium border border-outline-variant/20 hover:bg-surface-container-high transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              Reiniciar
            </button>
          </div>

          {miningError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              <span className="material-symbols-outlined text-base">error</span>
              <span className="flex-1">{miningError}</span>
              <button onClick={() => setMiningError(null)} className="text-red-400 hover:text-red-300">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chain Explorer Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-primary-container">hub</span>
          Explorador da Cadeia
          <span className="ml-auto text-xs font-normal text-on-surface-variant normal-case">
            {blockchain.length} bloco{blockchain.length !== 1 ? "s" : ""}
          </span>
        </h3>

        {blockchain.length > 0 ? (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 items-center min-w-max">
              {blockchain.map((block, idx) => (
                <div key={block.index} className="flex items-center gap-4">
                  <BlockCard
                    block={block}
                    isGenesis={idx === 0}
                    onClick={() => setSelectedBlock(block)}
                  />
                  {idx < blockchain.length - 1 && (
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-primary-container/60 to-primary/60 rounded" />
                      <span className="material-symbols-outlined text-xs text-primary-container/60">arrow_forward</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-on-surface-variant text-sm">
            Inicializando blockchain...
          </div>
        )}

        {/* Screen reader fallback table */}
        <table className="sr-only" role="table" aria-label="Dados completos da blockchain">
          <caption>Cadeia de blocos</caption>
          <thead>
            <tr>
              <th scope="col">Índice</th>
              <th scope="col">Dados</th>
              <th scope="col">Hash</th>
              <th scope="col">Hash Anterior</th>
              <th scope="col">Nonce</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {blockchain.map((block) => (
              <tr key={block.index}>
                <td>{block.index}</td>
                <td>{block.data}</td>
                <td>{block.hash}</td>
                <td>{block.previousHash}</td>
                <td>{block.nonce}</td>
                <td>{block.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attack Lab Section */}
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary-container hover:text-primary-container/80 transition-colors">
          <span className="material-symbols-outlined text-lg group-open:rotate-90 transition-transform">chevron_right</span>
          <span className="material-symbols-outlined text-base">security</span>
          Laboratório de Ataques — Entenda a Imutabilidade
        </summary>
        <div className="mt-3 p-4 rounded-xl glass-panel border border-outline-variant/15 text-sm text-on-surface-variant leading-relaxed space-y-3">
          <p>
            A imutabilidade de uma blockchain deriva diretamente do encadeamento criptográfico de hashes. Cada bloco contém o hash do bloco anterior — formando uma corrente em que qualquer alteração é imediatamente detectável.
          </p>
          <p>
            <strong className="text-on-surface">Experimento mental:</strong> Tente alterar os dados de um bloco do meio da cadeia. O hash desse bloco mudaria completamente (efeito avalanche do SHA-256). O próximo bloco, que contém o hash antigo como &quot;Hash Anterior&quot;, ficaria inconsistente. E assim por diante até o último bloco.
          </p>
          <p>
            <strong className="text-on-surface">Por que o ataque 51% existe?</strong> Em redes reais como o Bitcoin, para alterar um bloco histórico o atacante precisaria re-minerar todos os blocos subsequentes — e fazê-lo mais rápido do que os nós honestos da rede adicionam novos blocos. Com mais de 50% do poder computacional da rede isso seria teoricamente possível, mas praticamente inviável em redes grandes (custo estimado em bilhões de dólares).
          </p>
          <p>
            <strong className="text-on-surface">Dificuldade como proteção:</strong> Observe como aumentar a dificuldade no sandbox eleva drasticamente o tempo de mineração. Em redes reais, a dificuldade é ajustada automaticamente para manter um intervalo de ~10 minutos entre blocos no Bitcoin, tornando qualquer ataque computacionalmente proibitivo.
          </p>
        </div>
      </details>

      {/* Block Detail Modal */}
      {selectedBlock !== null && (
        <BlockDetailModal
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
        />
      )}
    </div>
  );
}
