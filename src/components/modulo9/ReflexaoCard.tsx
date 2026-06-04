"use client";

import { useState } from "react";
import type { Option, Reflexao } from "@/data/baas-tokenizacao-cenarios/types";
import SafeHtml from "./SafeHtml";
import { seededShuffle } from "@/lib/seeded-shuffle";

function FeedbackBox({ option }: { option: Option }) {
  const correct = option.correct;
  return (
    <div
      className={`mt-3 rounded-xl border p-4 ${
        correct ? "border-[#bfe6d2] bg-[#e9f6ef]" : "border-[#f0d6cf] bg-[#fbf0ee]"
      }`}
    >
      <div className={`mb-1 text-sm font-bold ${correct ? "text-[#1c7a57]" : "text-[#b23a2e]"}`}>
        {correct ? "✓ Correto" : "✕ Tente novamente"}
      </div>
      <SafeHtml
        as="p"
        html={option.feedback}
        className={`text-sm leading-relaxed [&_em]:not-italic [&_em]:font-medium ${
          correct ? "text-[#15543d]" : "text-[#7a2a22]"
        }`}
      />
    </div>
  );
}

interface ReflexaoCardProps {
  reflexao: Reflexao;
  answeredOptionId?: string | null;
  onCorrect: (optionId: string) => void;
}

export default function ReflexaoCard({ reflexao, answeredOptionId, onCorrect }: ReflexaoCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const locked = !!answeredOptionId;
  const shownId = answeredOptionId ?? selected;
  const shownOption = reflexao.options.find((o) => o.id === shownId) ?? null;
  // Ordem embaralhada (determinística) para a correta não ficar sempre na 1ª posição.
  const options = seededShuffle(reflexao.options, "reflexao|" + reflexao.prompt);

  function handle(opt: Option) {
    if (locked) return;
    setSelected(opt.id);
    if (opt.correct) onCorrect(opt.id);
  }

  return (
    <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:p-7">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-secondary">
        Reflexão <span className="text-on-surface-variant">· {reflexao.points} pts</span>
      </div>
      <SafeHtml as="p" html={reflexao.prompt} className="mb-4 text-[15px] font-medium leading-relaxed text-on-surface" />

      <div role="radiogroup" aria-label="Reflexão" className="space-y-2.5">
        {options.map((opt) => {
          const isCorrectLocked = locked && opt.id === answeredOptionId;
          const isWrongSelected = !locked && opt.id === selected && !opt.correct;
          let cls = "border-outline-variant bg-surface-container-lowest hover:border-primary/40";
          if (isCorrectLocked) cls = "border-[#bfe6d2] bg-[#e9f6ef]";
          else if (isWrongSelected) cls = "border-[#f0d6cf] bg-[#fbf0ee]";

          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={opt.id === shownId}
              disabled={locked}
              onClick={() => handle(opt)}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default ${cls}`}
            >
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${
                  isCorrectLocked
                    ? "border-[#1c7a57] bg-[#1c7a57] text-white"
                    : isWrongSelected
                    ? "border-[#b23a2e] text-[#b23a2e]"
                    : "border-outline text-on-surface-variant"
                }`}
              >
                {isCorrectLocked ? "✓" : isWrongSelected ? "✕" : ""}
              </span>
              <SafeHtml html={opt.text} className="text-on-surface [&_em]:not-italic [&_em]:font-medium" />
            </button>
          );
        })}
      </div>

      {shownOption && <FeedbackBox option={shownOption} />}
    </section>
  );
}
