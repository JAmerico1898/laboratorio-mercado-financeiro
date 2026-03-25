"use client";

import { useState } from "react";
import {
  CONCEPT_CARDS,
  FLOW_STEPS,
  FLOW_EDGES,
  TOKEN_CLASSIFICATIONS,
} from "@/lib/tokenization/constants";

function renderBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-on-surface font-semibold">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function FundamentosStep() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(
    new Set(["token"])
  );
  const [selectedAsset, setSelectedAsset] = useState<string>("Títulos Públicos");

  function toggleCard(id: string) {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const classification = TOKEN_CLASSIFICATIONS[selectedAsset];

  return (
    <div className="space-y-10">
      {/* ── Section 1: Concept Cards ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-base text-primary-container">
            school
          </span>
          <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wider">
            Conceitos Fundamentais
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONCEPT_CARDS.map((card) => {
            const isExpanded = expandedCards.has(card.id);
            return (
              <div
                key={card.id}
                className="glass-panel rounded-xl border border-outline-variant/15 overflow-hidden"
              >
                {/* Card header */}
                <button
                  onClick={() => toggleCard(card.id)}
                  className="w-full px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-surface-container-highest/30 transition-colors text-left"
                >
                  <span className="text-sm font-semibold text-on-surface">
                    {card.title}
                  </span>
                  <span
                    className="material-symbols-outlined text-base text-on-surface-variant transition-transform duration-200 shrink-0"
                    style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    expand_more
                  </span>
                </button>

                {/* Card content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-outline-variant/10 space-y-3">
                    {card.content.split("\n\n").map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-sm text-on-surface-variant leading-relaxed"
                      >
                        {renderBoldText(paragraph)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 2: Tokenization Flow ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-primary-container">
            swap_horiz
          </span>
          <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wider">
            Fluxo de Tokenização
          </h2>
        </div>
        <p className="text-sm text-on-surface-variant -mt-2">
          Como um ativo sai do mundo real e vai para a Blockchain.
        </p>

        <div className="bg-surface-container rounded-xl border border-outline-variant/15 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
            {FLOW_STEPS.map((step, idx) => (
              <div key={step.id} className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
                {/* Step box */}
                <div
                  className="flex items-center gap-3 rounded-lg px-4 py-3 border bg-surface-container-highest/40 flex-1 min-w-0"
                  style={{ borderLeftColor: step.color, borderLeftWidth: "3px" }}
                >
                  <span
                    className="material-symbols-outlined text-xl shrink-0"
                    style={{ color: step.color }}
                  >
                    {step.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {step.label}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {step.sublabel}
                    </p>
                  </div>
                </div>

                {/* Edge between steps */}
                {idx < FLOW_STEPS.length - 1 && (
                  <div className="flex sm:flex-col items-center gap-1 shrink-0">
                    <div className="h-px w-6 sm:h-6 sm:w-px bg-gradient-to-r sm:bg-gradient-to-b from-outline-variant/30 to-outline-variant/60" />
                    <span className="text-xs text-on-surface-variant/70 font-medium px-1 text-center whitespace-nowrap">
                      {FLOW_EDGES[idx]}
                    </span>
                    <div className="h-px w-6 sm:h-6 sm:w-px bg-gradient-to-r sm:bg-gradient-to-b from-outline-variant/60 to-outline-variant/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Token Classifier ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-primary-container">
            category
          </span>
          <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wider">
            Explorador de Classificação de Tokens
          </h2>
        </div>

        {/* Asset selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label
            htmlFor="asset-select"
            className="text-sm text-on-surface-variant shrink-0"
          >
            Selecione o ativo:
          </label>
          <select
            id="asset-select"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container/60 transition-colors cursor-pointer"
          >
            {Object.keys(TOKEN_CLASSIFICATIONS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Metric cards */}
        {classification && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/15">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Tipo de Token
              </p>
              <p className="text-sm font-semibold text-on-surface">
                {classification.tipo}
              </p>
            </div>
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/15">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Regulação
              </p>
              <p className="text-sm font-semibold text-on-surface">
                {classification.regulacao}
              </p>
            </div>
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/15">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Fracionamento
              </p>
              <p className="text-sm font-semibold text-on-surface">
                {classification.fracionalizacao}
              </p>
            </div>
            <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/15">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                Padrão Técnico
              </p>
              <p className="text-sm font-semibold text-on-surface">
                {classification.padrao}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
