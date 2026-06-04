"use client";

import { useCallback, useEffect, useState } from "react";
import type { Scenario } from "@/data/fidc-v2/types";

export type Phase = "etapas" | "encruzilhada" | "resultado" | "reflexao" | "conclusao";

interface PersistedState {
  revealedEtapas: number;
  etapaAnswers: Record<string, string>; // etapaId -> optionId (correto, travado)
  branch: "A" | "B" | "C" | null;
  showReflexao: boolean;
  reflexaoAnswer: string | null; // optionId correto, travado
  completed: boolean;
}

const storageKey = (scenarioId: string) => `fidc:progress:${scenarioId}`;

function initialState(): PersistedState {
  return {
    revealedEtapas: 1,
    etapaAnswers: {},
    branch: null,
    showReflexao: false,
    reflexaoAnswer: null,
    completed: false,
  };
}

export interface CompletionRecord {
  completed: boolean;
  score: number;
  maxScore: number;
}

/** Lê o registro de conclusão de um cenário (para a grade). SSR-safe. */
export function readCompletion(scenario: { id: string; maxScore: number }): CompletionRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(scenario.id));
    if (!raw) return null;
    const s = JSON.parse(raw) as PersistedState;
    const score =
      Object.keys(s.etapaAnswers ?? {}).length * 20 + (s.reflexaoAnswer ? 25 : 0);
    return { completed: !!s.completed, score, maxScore: scenario.maxScore };
  } catch {
    return null;
  }
}

export function useFidcScenario(scenario: Scenario) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hidrata do localStorage no mount (client-only para evitar mismatch de SSR).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(scenario.id));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação client-only do localStorage (evita mismatch de SSR)
      if (raw) setState(JSON.parse(raw) as PersistedState);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [scenario.id]);

  // Persiste a cada mudança (após hidratar).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey(scenario.id), JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, scenario.id, hydrated]);

  const totalEtapas = scenario.etapas.length;

  const score =
    Object.entries(state.etapaAnswers).reduce((acc, [etapaId]) => {
      const e = scenario.etapas.find((x) => x.id === etapaId);
      return acc + (e?.points ?? 0);
    }, 0) + (state.reflexaoAnswer ? scenario.reflexao.points : 0);

  const allEtapasDone = Object.keys(state.etapaAnswers).length === totalEtapas;

  const phase: Phase = state.completed
    ? "conclusao"
    : state.showReflexao
    ? "reflexao"
    : state.branch
    ? "resultado"
    : allEtapasDone
    ? "encruzilhada"
    : "etapas";

  /** Trava a resposta correta de uma etapa e revela a próxima. */
  const answerEtapa = useCallback(
    (etapaIndex: number, optionId: string) => {
      const etapa = scenario.etapas[etapaIndex];
      if (!etapa || state.etapaAnswers[etapa.id]) return;
      setState((prev) => {
        const etapaAnswers = { ...prev.etapaAnswers, [etapa.id]: optionId };
        const revealedEtapas =
          etapaIndex === prev.revealedEtapas - 1 && prev.revealedEtapas < totalEtapas
            ? prev.revealedEtapas + 1
            : prev.revealedEtapas;
        return { ...prev, etapaAnswers, revealedEtapas };
      });
    },
    [scenario.etapas, state.etapaAnswers, totalEtapas]
  );

  const chooseBranch = useCallback((id: "A" | "B" | "C") => {
    setState((prev) => ({ ...prev, branch: id }));
  }, []);

  const continueToReflexao = useCallback(() => {
    setState((prev) => ({ ...prev, showReflexao: true }));
  }, []);

  const answerReflexao = useCallback((optionId: string) => {
    setState((prev) =>
      prev.reflexaoAnswer
        ? prev
        : { ...prev, reflexaoAnswer: optionId, completed: true }
    );
  }, []);

  /** Volta uma etapa: remove a última etapa respondida e permite refazê-la. */
  const backStep = useCallback(() => {
    setState((prev) => {
      const answeredIds = Object.keys(prev.etapaAnswers);
      if (answeredIds.length === 0) return prev;
      // índice mais alto respondido
      const lastIndex = scenario.etapas.reduce(
        (max, e, i) => (prev.etapaAnswers[e.id] ? Math.max(max, i) : max),
        -1
      );
      if (lastIndex < 0) return prev;
      const lastId = scenario.etapas[lastIndex].id;
      const etapaAnswers = { ...prev.etapaAnswers };
      delete etapaAnswers[lastId];
      return {
        ...prev,
        etapaAnswers,
        revealedEtapas: Math.max(1, lastIndex + 1),
      };
    });
  }, [scenario.etapas]);

  /** Permite trocar de caminho antes de concluir a reflexão. */
  const resetBranch = useCallback(() => {
    setState((prev) =>
      prev.completed ? prev : { ...prev, branch: null, showReflexao: false }
    );
  }, []);

  const reset = useCallback(() => {
    setState(initialState());
    try {
      window.localStorage.removeItem(storageKey(scenario.id));
    } catch {
      /* ignore */
    }
  }, [scenario.id]);

  return {
    hydrated,
    phase,
    score,
    revealedEtapas: state.revealedEtapas,
    etapaAnswers: state.etapaAnswers,
    branch: state.branch,
    showReflexao: state.showReflexao,
    reflexaoAnswer: state.reflexaoAnswer,
    completed: state.completed,
    allEtapasDone,
    answerEtapa,
    chooseBranch,
    continueToReflexao,
    answerReflexao,
    backStep,
    resetBranch,
    reset,
  };
}
