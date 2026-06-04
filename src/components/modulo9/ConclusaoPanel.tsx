import Link from "next/link";

interface ConclusaoPanelProps {
  score: number;
  maxScore: number;
  onRetry: () => void;
}

export default function ConclusaoPanel({ score, maxScore, onRetry }: ConclusaoPanelProps) {
  return (
    <section className="rounded-2xl border border-[#bfe6d2] bg-[#e9f6ef] p-8 text-center shadow-sm">
      <span className="material-symbols-outlined mb-2 text-4xl text-[#1c7a57]">verified</span>
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1c7a57]">
        Cenário concluído
      </h2>
      <p className="mt-3 font-heading text-4xl font-extrabold text-primary">
        Pontuação final {score} / {maxScore}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#15543d]">
        Você percorreu o ciclo completo: diagnóstico, decisão e reflexão sobre o trade-off escolhido.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-6 py-3 text-sm font-bold text-primary transition-colors hover:border-primary/40 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Tentar outro cenário
        </button>
        <Link
          href="/modulo/9"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-95"
        >
          Finalizar e voltar
          <span className="material-symbols-outlined text-sm">trending_flat</span>
        </Link>
      </div>
    </section>
  );
}
