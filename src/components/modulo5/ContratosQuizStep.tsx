"use client";

import { useState } from "react";
import { ERC20_TEMPLATE, WHITELIST_TEMPLATE, QUIZ_QUESTIONS } from "@/lib/tokenization/constants";
import type { QuizState } from "@/lib/tokenization/types";

const SOLIDITY_KEYWORDS = [
  "contract", "function", "public", "returns", "require", "event",
  "mapping", "uint256", "address", "string", "bool", "uint8", "modifier",
];

function highlightCode(code: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, lineIdx) => {
    // Handle comment lines
    const commentIdx = line.indexOf("//");
    let codePart = line;
    let commentPart: string | null = null;

    if (commentIdx !== -1) {
      codePart = line.slice(0, commentIdx);
      commentPart = line.slice(commentIdx);
    }

    // Split code part into tokens to highlight keywords and strings
    const parts: React.ReactNode[] = [];
    const remaining = codePart;
    let partIdx = 0;

    // Build a regex that matches keywords, string literals, or non-matching chunks
    const tokenRegex = new RegExp(
      `("(?:[^"\\\\]|\\\\.)*")|\\b(${SOLIDITY_KEYWORDS.join("|")})\\b`,
      "g"
    );

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = tokenRegex.exec(remaining)) !== null) {
      // Text before this match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`${lineIdx}-plain-${partIdx++}`}>
            {remaining.slice(lastIndex, match.index)}
          </span>
        );
      }
      if (match[1]) {
        // String literal
        parts.push(
          <span key={`${lineIdx}-str-${partIdx++}`} className="text-secondary">
            {match[1]}
          </span>
        );
      } else if (match[2]) {
        // Keyword
        parts.push(
          <span key={`${lineIdx}-kw-${partIdx++}`} className="text-primary-container">
            {match[2]}
          </span>
        );
      }
      lastIndex = match.index + match[0].length;
    }
    // Remaining text after last match
    if (lastIndex < remaining.length) {
      parts.push(
        <span key={`${lineIdx}-tail-${partIdx++}`}>
          {remaining.slice(lastIndex)}
        </span>
      );
    }

    return (
      <span key={lineIdx}>
        {parts}
        {commentPart !== null && (
          <span className="text-outline-variant">{commentPart}</span>
        )}
        {"\n"}
      </span>
    );
  });
}

export default function ContratosQuizStep() {
  const [contractType, setContractType] = useState<"erc20" | "whitelist">("erc20");
  const [supply, setSupply] = useState(1000000);
  const [symbol, setSymbol] = useState("MTOKEN");

  const [quizState, setQuizState] = useState<QuizState>({
    answers: {},
    revealed: {},
    score: 0,
  });

  const codeContent =
    contractType === "erc20"
      ? ERC20_TEMPLATE(symbol || "TOKEN", supply)
      : WHITELIST_TEMPLATE;

  return (
    <div className="flex flex-col gap-10">
      {/* ── Smart Contract Viewer ── */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary-container">code</span>
            Explorador de Smart Contracts
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Veja como a lógica é programada (Pseudo-Solidity).
          </p>
        </div>

        {/* Contract type toggle */}
        <div className="flex gap-3 flex-wrap">
          {(
            [
              { value: "erc20", label: "Token Simples (ERC-20)" },
              { value: "whitelist", label: "Restrição de Compliance (Whitelist)" },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setContractType(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                contractType === value
                  ? "bg-primary-container/15 text-primary-container border-primary-container/30"
                  : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-high"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ERC-20 inputs */}
        {contractType === "erc20" && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Supply Total
              </label>
              <input
                type="number"
                value={supply}
                min={1}
                onChange={(e) => setSupply(Number(e.target.value))}
                className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container/60 tabular-nums"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Símbolo
              </label>
              <input
                type="text"
                value={symbol}
                maxLength={10}
                pattern="[A-Z0-9]*"
                onChange={(e) =>
                  setSymbol(e.target.value.replace(/[^A-Z0-9]/g, "").toUpperCase())
                }
                className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container/60 font-mono uppercase"
              />
            </div>
          </div>
        )}

        {/* Code block */}
        <pre className="bg-surface-container-lowest rounded-xl p-4 overflow-x-auto text-sm font-mono text-on-surface leading-relaxed border border-outline-variant/15">
          <code>{highlightCode(codeContent)}</code>
        </pre>

        {/* Caption */}
        <p className="text-xs text-on-surface-variant">
          {contractType === "erc20"
            ? "Este código define um mapa de saldos. A função transfer subtrai de um endereço e soma em outro."
            : "Adicionamos um Modificador. Antes de transferir, o código checa se o destino está numa lista aprovada (KYC/AML)."}
        </p>
      </section>

      {/* ── Quiz ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary-container">quiz</span>
            Avaliação de Conhecimento
          </h2>
          <div
            aria-live="polite"
            className="text-sm font-semibold text-primary-container tabular-nums"
          >
            {Object.keys(quizState.revealed).length > 0
              ? `${quizState.score}/3 corretas`
              : ""}
          </div>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-6">
          {QUIZ_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="bg-surface-container rounded-2xl p-6 border border-outline-variant/15"
            >
              <p className="text-on-surface font-medium mb-4">{q.question}</p>

              <div
                role="radiogroup"
                aria-label={q.question}
                className="flex flex-col gap-2"
              >
                {q.options.map((option, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-all ${
                      quizState.revealed[q.id]
                        ? i === q.correctIndex
                          ? "border-green-500/50 bg-green-500/10"
                          : quizState.answers[q.id] === i
                          ? "border-red-500/50 bg-red-500/10"
                          : "border-outline-variant/15"
                        : quizState.answers[q.id] === i
                        ? "border-primary-container/50 bg-primary-container/10"
                        : "border-outline-variant/15 hover:bg-surface-container-high"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={i}
                      checked={quizState.answers[q.id] === i}
                      disabled={!!quizState.revealed[q.id]}
                      onChange={() =>
                        setQuizState((s) => ({
                          ...s,
                          answers: { ...s.answers, [q.id]: i },
                        }))
                      }
                      className="accent-primary-container"
                    />
                    <span className="text-sm text-on-surface">{option}</span>
                  </label>
                ))}
              </div>

              {/* Verify button */}
              {!quizState.revealed[q.id] && (
                <button
                  disabled={quizState.answers[q.id] === undefined}
                  onClick={() => {
                    const isCorrect = quizState.answers[q.id] === q.correctIndex;
                    setQuizState((s) => ({
                      ...s,
                      revealed: { ...s.revealed, [q.id]: true },
                      score: isCorrect ? s.score + 1 : s.score,
                    }));
                  }}
                  className="mt-4 px-6 py-2 rounded-lg bg-primary-container/15 text-primary-container font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-container/25 transition-colors"
                >
                  Verificar
                </button>
              )}

              {/* Explanation */}
              {quizState.revealed[q.id] && (
                <div
                  id={`explanation-${q.id}`}
                  className="mt-4 p-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/15"
                >
                  <p className="text-sm text-on-surface-variant">{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary card */}
        {Object.keys(quizState.revealed).length === 3 && (
          <div
            className={`p-6 rounded-2xl border ${
              quizState.score === 3
                ? "border-green-500/30 bg-green-500/10"
                : quizState.score === 2
                ? "border-yellow-500/30 bg-yellow-500/10"
                : "border-red-500/30 bg-red-500/10"
            }`}
          >
            <p className="text-lg font-bold text-on-surface">
              {quizState.score === 3
                ? "Parabéns! Você é um Mestre da Tokenização!"
                : quizState.score === 2
                ? "Bom trabalho!"
                : `Sua pontuação: ${quizState.score}/3. Revise os módulos anteriores.`}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
