"use client";

import { useState } from "react";
import type { Etapa, Option } from "@/data/baas-tokenizacao-cenarios/types";
import SafeHtml from "./SafeHtml";
import { seededShuffle } from "@/lib/seeded-shuffle";

function FeedbackBox({ option }: { option: Option }) {
  if (option.correct) {
    return (
      <div className="mt-3 rounded-xl border border-[#bfe6d2] bg-[#e9f6ef] p-4">
        <div className="mb-1 text-sm font-bold text-[#1c7a57]">✓ Correto</div>
        <SafeHtml
          as="p"
          html={option.feedback}
          className="text-sm leading-relaxed text-[#15543d] [&_em]:not-italic [&_em]:font-medium"
        />
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-xl border border-[#f0d6cf] bg-[#fbf0ee] p-4">
      <div className="mb-1 text-sm font-bold text-[#b23a2e]">✕ Tente novamente</div>
      <SafeHtml
        as="p"
        html={option.feedback}
        className="text-sm leading-relaxed text-[#7a2a22] [&_em]:not-italic [&_em]:font-medium"
      />
    </div>
  );
}

interface EtapaCardProps {
  etapa: Etapa;
  index: number;
  answeredOptionId?: string;
  onCorrect: (optionId: string) => void;
}

export default function EtapaCard({ etapa, index, answeredOptionId, onCorrect }: EtapaCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const locked = !!answeredOptionId;
  // opção cuja memória de cálculo está visível
  const shownId = answeredOptionId ?? selected;
  const shownOption = etapa.options.find((o) => o.id === shownId) ?? null;
  // Ordem embaralhada (determinística) para a correta não ficar sempre na 1ª posição.
  const options = seededShuffle(etapa.options, etapa.id + "|" + etapa.prompt);

  function handle(opt: Option) {
    if (locked) return;
    setSelected(opt.id);
    if (opt.correct) onCorrect(opt.id);
  }

  return (
    <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:p-7">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-secondary">
        {etapa.label} <span className="text-on-surface-variant">· {etapa.points} pts</span>
      </div>
      <SafeHtml as="p" html={etapa.prompt} className="mb-4 text-[15px] font-medium leading-relaxed text-on-surface" />

      <div role="radiogroup" aria-label={etapa.label} className="space-y-2.5">
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

      <span className="sr-only" aria-live="polite">
        {locked ? `Etapa ${index + 1} respondida corretamente.` : ""}
      </span>
    </section>
  );
}
