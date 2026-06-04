"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Difficulty, Scenario } from "@/data/regulacao-cenarios/types";
import { DIFFICULTY_LABEL } from "@/data/regulacao-cenarios/types";
import { readCompletion, type CompletionRecord } from "./useRegScenario";

function difficultyStyles(d: Difficulty) {
  if (d === "avancado") {
    return {
      card: "bg-surface-container-highest",
      badge: "bg-primary text-on-primary",
    };
  }
  return {
    card: "bg-surface-container-lowest",
    badge: "bg-secondary-container text-on-secondary-container",
  };
}

export default function ScenarioGrid({ scenarios }: { scenarios: Scenario[] }) {
  const [completions, setCompletions] = useState<Record<string, CompletionRecord | null>>({});

  useEffect(() => {
    const map: Record<string, CompletionRecord | null> = {};
    for (const s of scenarios) map[s.id] = readCompletion(s);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura client-only do localStorage (evita mismatch de SSR)
    setCompletions(map);
  }, [scenarios]);

  return (
    <div data-theme="light" className="min-h-screen bg-surface text-on-surface font-body">
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        {/* Header — hero de duas colunas (texto à esquerda, vídeo à direita) */}
        <header className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:opacity-70"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="text-xs uppercase tracking-widest">Voltar aos módulos</span>
          </Link>
          <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                Basileia e adequação de capital
              </p>
              <h1 className="mt-2 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-primary sm:text-5xl md:text-6xl">
                Regulação{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Bancária
                </span>
              </h1>
              <p className="mt-6 max-w-xl border-l-2 border-primary/30 pl-4 text-lg font-light leading-relaxed text-on-surface-variant">
                Quatro casos aplicados sobre o Índice de Basileia (IB = PR / RWA): como crescimento, perdas,
                estratégia de risco e migração de rating movem o capital de um banco.
              </p>
            </div>

            <div className="relative hidden aspect-video w-full overflow-hidden rounded-2xl border border-outline-variant/40 lg:col-span-3 lg:block">
              <video
                src="/videos/hero-regulacao-bancaria.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/40 via-transparent to-transparent" />
            </div>
          </div>
        </header>

        <div className="mb-8 flex items-center gap-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Cenários de Análise
          </h2>
          <div className="h-px flex-1 bg-outline-variant" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {scenarios.map((s) => {
            const styles = difficultyStyles(s.difficulty);
            const completion = completions[s.id];
            const isCompleted = !!completion?.completed;
            return (
              <Link
                key={s.id}
                href={`/modulo/8/${s.id}`}
                className={`group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant p-7 shadow-sm transition-all hover:shadow-md ${styles.card}`}
              >
                <div>
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
                    >
                      {DIFFICULTY_LABEL[s.difficulty]}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-[10px] font-bold text-on-secondary-container">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {completion!.score}/{completion!.maxScore}
                      </span>
                    )}
                  </div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    {s.code} · {s.bank} · ~{s.estMinutes} min
                  </p>
                  <h3 className="mb-3 font-heading text-2xl font-bold leading-snug text-primary">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{s.blurb}</p>
                </div>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors group-hover:bg-primary-container">
                  Iniciar cenário
                  <span className="material-symbols-outlined text-sm">trending_flat</span>
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
