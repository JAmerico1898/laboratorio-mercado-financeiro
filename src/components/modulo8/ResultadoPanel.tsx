import type { DeltaMetric, DeltaTone, Resultado } from "@/data/regulacao-cenarios/types";
import SafeHtml from "./SafeHtml";

const deltaStyles: Record<DeltaTone, string> = {
  positive: "border-[#bfe6d2] bg-[#e9f6ef] text-[#1c7a57]",
  negative: "border-[#f0d6cf] bg-[#fbf0ee] text-[#b23a2e]",
  risk: "border-[#f0d6cf] bg-[#fbf0ee] text-[#b23a2e]",
  neutral: "border-outline-variant bg-surface-container text-on-surface",
};

function DeltaTile({ metric }: { metric: DeltaMetric }) {
  return (
    <div className={`rounded-xl border p-4 ${deltaStyles[metric.tone]}`}>
      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] opacity-70">
        {metric.label}
      </div>
      <div className="text-lg font-bold leading-snug">{metric.value}</div>
    </div>
  );
}

interface ResultadoPanelProps {
  resultado: Resultado;
  onContinue: () => void;
  onChangePath: () => void;
  reflexaoVisible: boolean;
}

export default function ResultadoPanel({
  resultado,
  onContinue,
  onChangePath,
  reflexaoVisible,
}: ResultadoPanelProps) {
  return (
    <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:p-7">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">Resultado</h2>
      <h3 className="mt-1 font-heading text-2xl font-bold text-primary">{resultado.headline}</h3>
      <p className="mb-5 text-sm font-medium text-on-surface-variant">{resultado.caption}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {resultado.metrics.map((m, i) => (
          <DeltaTile key={i} metric={m} />
        ))}
      </div>

      <SafeHtml
        as="p"
        html={resultado.explanation}
        className="mt-5 text-[15px] leading-relaxed text-on-surface [&_em]:text-secondary [&_em]:not-italic [&_em]:font-medium"
      />

      {!reflexaoVisible && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-95"
          >
            Continuar para reflexão
            <span className="material-symbols-outlined text-sm">trending_flat</span>
          </button>
          <button
            type="button"
            onClick={onChangePath}
            className="inline-flex items-center gap-2 rounded-xl border border-outline-variant px-5 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary/40"
          >
            <span className="material-symbols-outlined text-sm">alt_route</span>
            Trocar de caminho
          </button>
        </div>
      )}
    </section>
  );
}
