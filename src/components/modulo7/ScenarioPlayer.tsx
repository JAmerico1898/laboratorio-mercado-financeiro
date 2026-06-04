"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Scenario } from "@/data/fidc-v2/types";
import { DIFFICULTY_LABEL } from "@/data/fidc-v2/types";
import { useFidcScenario } from "./useFidcScenario";
import ScoreHeader from "./ScoreHeader";
import StepProgress from "./StepProgress";
import ContextPanel from "./ContextPanel";
import KeyFactsGrid from "./KeyFactsGrid";
import CollapsibleStatements from "./CollapsibleStatements";
import EtapaCard from "./EtapaCard";
import EncruzilhadaPanel from "./EncruzilhadaPanel";
import ResultadoPanel from "./ResultadoPanel";
import ReflexaoCard from "./ReflexaoCard";
import ConclusaoPanel from "./ConclusaoPanel";

export default function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const router = useRouter();
  const p = useFidcScenario(scenario);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Revelação progressiva: rola até o conteúdo recém-revelado.
  useEffect(() => {
    if (!p.hydrated) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    bottomRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.revealedEtapas, p.branch, p.showReflexao, p.completed]);

  const chosenBranch = p.branch
    ? scenario.encruzilhada.branches.find((b) => b.id === p.branch) ?? null
    : null;

  const someAnswered = Object.keys(p.etapaAnswers).length > 0;
  const canGoBack = someAnswered && !p.allEtapasDone && !p.completed;

  const steps = [
    ...scenario.etapas.map((e, i) => ({
      label: `Etapa ${i + 1}`,
      done: !!p.etapaAnswers[e.id],
      active: !p.etapaAnswers[e.id] && i < p.revealedEtapas,
    })),
    {
      label: "Reflexão",
      done: !!p.reflexaoAnswer,
      active: p.showReflexao && !p.reflexaoAnswer,
    },
  ];

  function handleRetry() {
    p.reset();
    router.push("/modulo/7");
  }

  return (
    <div data-theme="light" className="min-h-screen bg-surface text-on-surface font-body">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-outline-variant bg-surface/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/modulo/7"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:opacity-70"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="text-xs uppercase tracking-widest">Início</span>
            </Link>
            <ScoreHeader score={p.score} maxScore={scenario.maxScore} />
          </div>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            {scenario.code} · {scenario.title} · {DIFFICULTY_LABEL[scenario.difficulty]}
          </p>
          <div className="mt-2">
            <StepProgress steps={steps} />
          </div>
        </div>
      </div>

      {/* Corpo — revelação progressiva, conteúdo anterior permanece visível */}
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <h1 className="font-heading text-3xl font-extrabold leading-tight text-primary">
          {scenario.title}
        </h1>

        <ContextPanel context={scenario.context} />
        <KeyFactsGrid facts={scenario.keyFacts} />
        <CollapsibleStatements statements={scenario.statements} />

        {/* Etapas reveladas */}
        {scenario.etapas.slice(0, p.revealedEtapas).map((etapa, i) => (
          <EtapaCard
            key={etapa.id}
            etapa={etapa}
            index={i}
            answeredOptionId={p.etapaAnswers[etapa.id]}
            onCorrect={(optId) => p.answerEtapa(i, optId)}
          />
        ))}

        {canGoBack && (
          <button
            type="button"
            onClick={p.backStep}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-sm">undo</span>
            Etapa anterior
          </button>
        )}

        {/* Encruzilhada */}
        {p.allEtapasDone && (
          <EncruzilhadaPanel
            prompt={scenario.encruzilhada.prompt}
            branches={scenario.encruzilhada.branches}
            chosen={p.branch}
            onChoose={p.chooseBranch}
          />
        )}

        {/* Resultado do caminho escolhido */}
        {chosenBranch && (
          <ResultadoPanel
            resultado={chosenBranch.resultado}
            onContinue={p.continueToReflexao}
            onChangePath={p.resetBranch}
            reflexaoVisible={p.showReflexao}
          />
        )}

        {/* Reflexão */}
        {p.showReflexao && (
          <ReflexaoCard
            reflexao={scenario.reflexao}
            answeredOptionId={p.reflexaoAnswer}
            onCorrect={p.answerReflexao}
          />
        )}

        {/* Conclusão */}
        {p.completed && (
          <ConclusaoPanel score={p.score} maxScore={scenario.maxScore} onRetry={handleRetry} />
        )}

        <div ref={bottomRef} />
      </main>
    </div>
  );
}
