"use client";

import { useState, useMemo } from "react";
import { calculateRiskImpacts } from "@/lib/tokenization/risk-calc";
import { CASE_STUDIES } from "@/lib/tokenization/constants";
import RiskHeatmap from "@/components/modulo5/charts/RiskHeatmap";
import SliderField from "@/components/modulo5/SliderField";

/** Render inline markdown: **bold** → <strong> */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-on-surface font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

/** Render content string as paragraphs with bullet support */
function CaseContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/);
  return (
    <div className="flex flex-col gap-3">
      {paragraphs.map((para, i) => {
        // Bullet list paragraph
        if (para.trim().startsWith("*")) {
          const items = para.split(/\n/).filter((l) => l.trim().startsWith("*"));
          return (
            <ul key={i} className="flex flex-col gap-1.5 pl-1">
              {items.map((item, j) => (
                <li key={j} className="flex gap-2 text-sm text-on-surface-variant leading-relaxed">
                  <span className="text-primary-container mt-0.5 shrink-0">•</span>
                  <span>{renderInlineMarkdown(item.replace(/^\*\s*/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm text-on-surface-variant leading-relaxed">
            {renderInlineMarkdown(para)}
          </p>
        );
      })}
    </div>
  );
}

interface CalloutProps {
  text: string;
  type: "info" | "warning";
}

function Callout({ text, type }: CalloutProps) {
  const isWarning = type === "warning";
  return (
    <div
      className={`flex items-start gap-3 rounded-xl p-4 border ${
        isWarning
          ? "bg-yellow-500/5 border-yellow-500/30"
          : "bg-sky-500/5 border-sky-500/30"
      }`}
    >
      <span
        className={`material-symbols-outlined text-lg shrink-0 mt-0.5 ${
          isWarning ? "text-yellow-400" : "text-sky-400"
        }`}
      >
        {isWarning ? "warning" : "info"}
      </span>
      <p className="text-sm text-on-surface-variant leading-relaxed">{text}</p>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="bg-surface-container-highest/60 rounded-xl p-4 border border-outline-variant/20 flex flex-col gap-1">
      <p className="text-xs text-on-surface-variant uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-primary-container tabular-nums">{value}</p>
    </div>
  );
}

export default function RiscosCasosStep() {
  const [marketShock, setMarketShock] = useState(20);
  const [techFail, setTechFail] = useState(false);
  const [regChange, setRegChange] = useState(false);
  const [activeCase, setActiveCase] = useState("fidc");

  const riskResult = useMemo(
    () => calculateRiskImpacts(marketShock, techFail, regChange),
    [marketShock, techFail, regChange]
  );

  const activeCaseData = CASE_STUDIES.find((c) => c.id === activeCase) ?? CASE_STUDIES[0];

  return (
    <div className="flex flex-col gap-12">
      {/* ── TOP HALF: Stress Test ────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-xl text-yellow-400">warning</span>
          <h2 className="text-lg font-semibold text-on-surface uppercase tracking-wide">
            Matriz de Risco Multidimensional
          </h2>
        </div>
        <p className="text-sm text-on-surface-variant mb-6 max-w-2xl">
          Tokenização não elimina riscos, ela adiciona novas camadas tecnológicas.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Left: Controls */}
          <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/15 flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary-container">tune</span>
              Teste de Estresse
            </h3>

            <SliderField
              label="Choque de Mercado"
              value={marketShock}
              min={0}
              max={100}
              step={1}
              displayValue={`${marketShock}%`}
              onChange={setMarketShock}
            />

            <div className="flex flex-col gap-3 pt-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="accent-primary-container w-4 h-4 rounded"
                  checked={techFail}
                  onChange={(e) => setTechFail(e.target.checked)}
                />
                <span className="text-sm text-on-surface-variant">
                  Falha no Smart Contract (Hack)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="accent-primary-container w-4 h-4 rounded"
                  checked={regChange}
                  onChange={(e) => setRegChange(e.target.checked)}
                />
                <span className="text-sm text-on-surface-variant">
                  Mudança Regulatória Adversa
                </span>
              </label>
            </div>
          </div>

          {/* Right: Heatmap */}
          <div className="flex flex-col gap-3">
            <div className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-hidden">
              <RiskHeatmap result={riskResult} />
            </div>
            <p className="text-xs text-outline-variant text-center">
              Verde = Seguro | Vermelho = Crítico
            </p>

            {/* Screen reader summary */}
            <p className="sr-only">
              Resumo dos impactos de risco:{" "}
              {riskResult.categories.map((cat, i) => `${cat}: ${riskResult.impacts[i]}`).join(", ")}.
            </p>
          </div>
        </div>
      </section>

      {/* ── BOTTOM HALF: Case Studies ────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-xl text-primary-container">menu_book</span>
          <h2 className="text-lg font-semibold text-on-surface uppercase tracking-wide">
            Estudos de Caso
          </h2>
        </div>

        {/* DESKTOP: Tab buttons (hidden on mobile) */}
        <div className="hidden md:flex gap-2 mb-4 flex-wrap">
          {CASE_STUDIES.map((cs) => (
            <button
              key={cs.id}
              onClick={() => setActiveCase(cs.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                activeCase === cs.id
                  ? "bg-primary-container/15 text-primary-container border-primary-container/30"
                  : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-highest/50"
              }`}
            >
              {cs.tab}
            </button>
          ))}
        </div>

        {/* DESKTOP: Active case panel */}
        <div className="hidden md:block bg-surface-container rounded-2xl p-6 border border-outline-variant/15">
          <CasePanelContent cs={activeCaseData} />
        </div>

        {/* MOBILE: Accordion (hidden on desktop) */}
        <div className="md:hidden flex flex-col gap-2">
          {CASE_STUDIES.map((cs) => (
            <details
              key={cs.id}
              className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-hidden group"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-on-surface hover:bg-surface-container-highest/40 transition-colors list-none">
                <span>{cs.tab}</span>
                <span className="material-symbols-outlined text-base text-on-surface-variant transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-5 pb-5 border-t border-outline-variant/10 pt-4">
                <CasePanelContent cs={cs} />
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

interface CasePanelContentProps {
  cs: (typeof CASE_STUDIES)[number];
}

function CasePanelContent({ cs }: CasePanelContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-on-surface">{cs.title}</h3>
      <CaseContent content={cs.content} />
      {"metric" in cs && cs.metric && (
        <MetricCard label={cs.metric.label} value={cs.metric.value} />
      )}
      {"callout" in cs && cs.callout && (
        <Callout text={cs.callout} type={cs.calloutType} />
      )}
    </div>
  );
}
