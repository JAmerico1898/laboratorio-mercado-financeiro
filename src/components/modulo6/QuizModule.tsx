"use client";

import { useState } from "react";
import { QUIZ_QUESTIONS } from "@/lib/financial-regulation/constants";

export default function QuizModule() {
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? QUIZ_QUESTIONS.filter((q) => answers[q.id] === q.correctAnswer).length
    : 0;
  const total = QUIZ_QUESTIONS.length;

  const scoreColor =
    score === total
      ? "text-[#4edea3]"
      : score > 0
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="material-symbols-outlined text-4xl text-primary-container mb-2 block">
          psychology
        </span>
        <h2 className="text-2xl font-bold text-on-surface">
          Quiz Final &amp; Recursos
        </h2>
        <p className="text-on-surface-variant mt-2">
          Parabens por chegar ate aqui! Teste seu conhecimento:
        </p>
      </div>

      {/* Quiz Form */}
      <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 space-y-6">
        {QUIZ_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="space-y-2">
            {q.type === "radio" ? (
              <fieldset>
                <legend className="text-on-surface font-semibold mb-3">
                  {idx + 1}. {q.question}
                </legend>
                {q.options?.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                      }
                      disabled={submitted}
                      className="accent-[#00f2ff]"
                    />
                    <span className="text-on-surface-variant">{opt}</span>
                    {submitted && opt === q.correctAnswer && (
                      <span className="material-symbols-outlined text-[#4edea3] text-sm ml-auto">
                        check_circle
                      </span>
                    )}
                    {submitted &&
                      answers[q.id] === opt &&
                      opt !== q.correctAnswer && (
                        <span className="material-symbols-outlined text-red-400 text-sm ml-auto">
                          cancel
                        </span>
                      )}
                  </label>
                ))}
              </fieldset>
            ) : (
              <div>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container cursor-pointer">
                  <input
                    type="checkbox"
                    checked={answers[q.id] === true}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.id]: !prev[q.id],
                      }))
                    }
                    disabled={submitted}
                    className="accent-[#00f2ff] w-5 h-5"
                  />
                  <span className="text-on-surface font-semibold">
                    {idx + 1}. {q.question}
                  </span>
                  {submitted && answers[q.id] === q.correctAnswer && (
                    <span className="material-symbols-outlined text-[#4edea3] text-sm ml-auto">
                      check_circle
                    </span>
                  )}
                  {submitted && answers[q.id] !== q.correctAnswer && (
                    <span className="material-symbols-outlined text-red-400 text-sm ml-auto">
                      cancel
                    </span>
                  )}
                </label>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => setSubmitted(true)}
          disabled={submitted}
          className="px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ver resultado
        </button>
      </div>

      {/* Results */}
      {submitted && (
        <div
          className={`glass-panel p-6 rounded-2xl border border-outline-variant/10 text-center`}
        >
          <span
            className={`material-symbols-outlined text-5xl ${scoreColor} mb-2 block`}
          >
            {score === total ? "emoji_events" : score > 0 ? "trending_up" : "sentiment_dissatisfied"}
          </span>
          <p className={`text-2xl font-bold ${scoreColor}`}>
            Voce acertou {score}/{total}!
          </p>
        </div>
      )}

      {/* Resources Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container">
            menu_book
          </span>
          <h3 className="text-xl font-bold text-on-surface">
            Recursos Adicionais
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://www.bis.org/bcbs/basel3.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-4 rounded-xl border border-outline-variant/10 hover:border-primary-container/30 transition-colors block"
          >
            <span className="text-primary-container font-semibold">
              Site oficial do BIS
            </span>
            <span className="text-on-surface-variant text-sm block mt-1">
              Documentacao oficial dos Acordos de Basileia
            </span>
          </a>

          <a
            href="https://www.bcb.gov.br/estabilidadefinanceira/basileia3"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-4 rounded-xl border border-outline-variant/10 hover:border-primary-container/30 transition-colors block"
          >
            <span className="text-primary-container font-semibold">
              Resumo Basel III - BCB
            </span>
            <span className="text-on-surface-variant text-sm block mt-1">
              Implementacao brasileira pelo Banco Central
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
