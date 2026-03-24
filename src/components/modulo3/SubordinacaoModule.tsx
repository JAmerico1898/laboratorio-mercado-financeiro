"use client";

import { useState, useMemo } from "react";
import {
  calculateWaterfall,
  calculateSensitivityCurve,
  calculateRupturePoints,
} from "@/lib/fidc/subordinacao-calc";
import {
  SUB_INDEX_MIN,
  SUB_INDEX_MAX,
  SUB_INDEX_STEP,
  SUB_PL_MIN,
  SUB_PL_MAX,
  SUB_PL_STEP,
  SUB_LOSS_MAX_PERCENT,
} from "@/lib/fidc/constants";
import type { SubordinacaoParams } from "@/lib/fidc/types";
import CapitalStructureChart from "./charts/CapitalStructureChart";
import RuptureChart from "./charts/RuptureChart";

function fmtM(value: number, decimals = 1): string {
  return `R$ ${(value / 1_000_000).toFixed(decimals)}M`;
}

function fmtPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

const STATUS_STYLES = {
  success: {
    border: "border-secondary/40",
    bg: "bg-secondary/10",
    icon: "check_circle",
    iconColor: "text-secondary",
    titleColor: "text-secondary",
  },
  warning: {
    border: "border-yellow-500/40",
    bg: "bg-yellow-500/10",
    icon: "warning",
    iconColor: "text-yellow-400",
    titleColor: "text-yellow-400",
  },
  error: {
    border: "border-red-500/40",
    bg: "bg-red-500/10",
    icon: "error",
    iconColor: "text-red-400",
    titleColor: "text-red-400",
  },
} as const;

export default function SubordinacaoModule() {
  // Raw state
  const [pl, setPl] = useState(100);
  const [subordinationIndex, setSubordinationIndex] = useState(20);
  const [includeMezanino, setIncludeMezanino] = useState(false);
  const [lossSliderPercent, setLossSliderPercent] = useState(0);

  // Convert slider % → absolute R$
  const simulatedLoss = pl * 1_000_000 * (lossSliderPercent / 100);

  const params: SubordinacaoParams = useMemo(
    () => ({ pl, subordinationIndex, includeMezanino, simulatedLoss }),
    [pl, subordinationIndex, includeMezanino, simulatedLoss]
  );

  const result = useMemo(() => calculateWaterfall(params), [params]);
  const sensitivityData = useMemo(() => calculateSensitivityCurve(params), [params]);
  const rupturePoints = useMemo(() => calculateRupturePoints(params), [params]);

  const statusStyle = STATUS_STYLES[result.status];

  // Loss as % of PL for color coding
  const lossAsPctOfPl = lossSliderPercent;
  const lossExceedsSub = lossAsPctOfPl > subordinationIndex;

  // Summary table rows
  const tableRows = [
    {
      label: "Sênior",
      color: "#4edea3",
      initial: result.senior.initial,
      loss: result.senior.loss,
      final: result.senior.final,
      lossPct: result.senior.lossPercent,
    },
    ...(result.mezanino
      ? [
          {
            label: "Mezanino",
            color: "#ffb74d",
            initial: result.mezanino.initial,
            loss: result.mezanino.loss,
            final: result.mezanino.final,
            lossPct: result.mezanino.lossPercent,
          },
        ]
      : []),
    {
      label: "Junior",
      color: "#ff4444",
      initial: result.junior.initial,
      loss: result.junior.loss,
      final: result.junior.final,
      lossPct: result.junior.lossPercent,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
      {/* ── Left column: Controls ── */}
      <aside className="flex flex-col gap-5">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container p-5 flex flex-col gap-5">
          <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary-container">tune</span>
            Parâmetros
          </h2>

          {/* PL Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
              Patrimônio Líquido (R$ M)
            </label>
            <input
              type="number"
              min={SUB_PL_MIN}
              max={SUB_PL_MAX}
              step={SUB_PL_STEP}
              value={pl}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= SUB_PL_MIN && v <= SUB_PL_MAX) setPl(v);
              }}
              className="w-full rounded-lg bg-surface-container-highest border border-outline-variant/30 px-3 py-2 text-on-surface text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary-container/60"
            />
            <span className="text-[10px] text-on-surface-variant">
              Mín: R$ {SUB_PL_MIN}M — Máx: R$ {SUB_PL_MAX}M
            </span>
          </div>

          {/* Subordination Index Slider */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
              Índice de Subordinação
            </label>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-on-surface-variant">{SUB_INDEX_MIN}%</span>
              <span className="text-base font-bold text-primary-container">{subordinationIndex}%</span>
              <span className="text-xs text-on-surface-variant">{SUB_INDEX_MAX}%</span>
            </div>
            <input
              type="range"
              min={SUB_INDEX_MIN}
              max={SUB_INDEX_MAX}
              step={SUB_INDEX_STEP}
              value={subordinationIndex}
              onChange={(e) => setSubordinationIndex(Number(e.target.value))}
              className="w-full accent-primary-container cursor-pointer"
            />
            <span className="text-[10px] text-on-surface-variant">
              Junior protege {fmtM(result.junior.initial)} do total do fundo
            </span>
          </div>

          {/* Include Mezanino */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={includeMezanino}
                onChange={(e) => setIncludeMezanino(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  includeMezanino ? "bg-primary-container" : "bg-surface-container-highest"
                } border border-outline-variant/30`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    includeMezanino ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </div>
            <span className="text-sm text-on-surface group-hover:text-primary-container transition-colors">
              Incluir Cota Mezanino
            </span>
          </label>

          {/* Simulated Loss Slider */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
              Perda Simulada
            </label>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-on-surface-variant">0%</span>
              <span
                className={`text-base font-bold ${
                  lossExceedsSub ? "text-red-400" : "text-on-surface"
                }`}
              >
                {lossSliderPercent.toFixed(0)}%
              </span>
              <span className="text-xs text-on-surface-variant">{SUB_LOSS_MAX_PERCENT}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={SUB_LOSS_MAX_PERCENT}
              step={1}
              value={lossSliderPercent}
              onChange={(e) => setLossSliderPercent(Number(e.target.value))}
              className="w-full accent-red-400 cursor-pointer"
            />
            <span className="text-[10px] text-on-surface-variant">
              {fmtM(simulatedLoss)} em valor absoluto
            </span>
          </div>
        </div>

        {/* Metric card: Loss % of PL */}
        <div
          className={`rounded-xl border p-4 flex flex-col gap-1 transition-colors ${
            lossExceedsSub
              ? "border-red-500/40 bg-red-500/10"
              : "border-outline-variant/20 bg-surface-container"
          }`}
        >
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            Perda como % do PL
          </span>
          <span
            className={`text-3xl font-extrabold tracking-tighter ${
              lossExceedsSub ? "text-red-400" : "text-secondary"
            }`}
          >
            {fmtPct(lossAsPctOfPl)}
          </span>
          <span className="text-xs text-on-surface-variant">
            Subordinação contratual: <strong className="text-on-surface">{fmtPct(subordinationIndex)}</strong>
          </span>
          {lossExceedsSub ? (
            <span className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">warning</span>
              Perda excede a subordinação
            </span>
          ) : (
            <span className="text-xs text-secondary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">shield</span>
              Dentro da proteção
            </span>
          )}
        </div>
      </aside>

      {/* ── Right column: Results ── */}
      <div className="flex flex-col gap-6">
        {/* Status box */}
        <div
          className={`rounded-xl border ${statusStyle.border} ${statusStyle.bg} px-5 py-4 flex items-center gap-3`}
        >
          <span
            className={`material-symbols-outlined text-2xl ${statusStyle.iconColor}`}
          >
            {statusStyle.icon}
          </span>
          <div>
            <p className={`text-sm font-bold ${statusStyle.titleColor}`}>
              {result.statusMessage}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Subordinação efetiva após perda:{" "}
              <strong className="text-on-surface">{fmtPct(result.effectiveSubordination)}</strong>
              {result.isDrawdown && (
                <span className="ml-2 text-yellow-400">(drawdown ativo)</span>
              )}
            </p>
          </div>
        </div>

        {/* Capital Structure Chart */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container overflow-hidden">
          <CapitalStructureChart result={result} />
        </div>

        {/* Summary table */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container overflow-hidden">
          <div className="px-5 py-3 border-b border-outline-variant/15">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary-container">table_chart</span>
              Resumo por Classe
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/15">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Classe
                  </th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Inicial
                  </th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Perda (R$ M)
                  </th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Final
                  </th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Perda (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-highest/40 transition-colors"
                  >
                    <td className="px-4 py-2.5 flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="font-medium text-on-surface">{row.label}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-on-surface-variant font-mono text-xs">
                      {fmtM(row.initial)}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-mono text-xs ${
                        row.loss > 0 ? "text-red-400" : "text-on-surface-variant"
                      }`}
                    >
                      {row.loss > 0 ? `-${fmtM(row.loss)}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right text-on-surface font-mono text-xs font-semibold">
                      {fmtM(row.final)}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-mono text-xs ${
                        row.lossPct > 0 ? "text-red-400" : "text-secondary"
                      }`}
                    >
                      {row.lossPct > 0 ? `-${fmtPct(row.lossPct)}` : "0.0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drawdown Analysis */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container p-5">
          <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary-container">analytics</span>
            Análise de Drawdown
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-surface-container-highest/50 p-3">
              <p className="text-xs text-on-surface-variant mb-1">Subordinação Contratual</p>
              <p className="text-xl font-bold text-primary-container">
                {fmtPct(result.contractualSubordination)}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {fmtM(result.junior.initial + (result.mezanino?.initial ?? 0))} protegido
              </p>
            </div>
            <div
              className={`rounded-lg p-3 ${
                result.isDrawdown
                  ? "bg-yellow-500/10"
                  : "bg-surface-container-highest/50"
              }`}
            >
              <p className="text-xs text-on-surface-variant mb-1">Subordinação Efetiva</p>
              <p
                className={`text-xl font-bold ${
                  result.isDrawdown ? "text-yellow-400" : "text-secondary"
                }`}
              >
                {fmtPct(result.effectiveSubordination)}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {result.isDrawdown ? (
                  <span className="text-yellow-400">
                    Δ {fmtPct(result.contractualSubordination - result.effectiveSubordination)} abaixo do contratual
                  </span>
                ) : (
                  "Dentro do limite"
                )}
              </p>
            </div>
          </div>

          {result.isDrawdown && (
            <div className="mt-4 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 text-xs text-yellow-300 leading-relaxed">
              <strong>Atenção (Drawdown):</strong> A subordinação efetiva caiu abaixo da subordinação contratual.
              Isso ocorre porque as cotas subordinadas absorveram perdas e seu saldo residual representa
              uma fatia menor do PL remanescente. Em fundos reais, isso pode acionar obrigações de
              recomposição ou gatilhos de proteção.
            </div>
          )}
        </div>

        {/* Rupture Chart */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container overflow-hidden">
          <RuptureChart
            data={sensitivityData}
            currentLossPercent={lossSliderPercent}
            rupturePoints={rupturePoints}
          />
        </div>

        {/* Educational sections */}
        <div className="space-y-3">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary-container hover:text-primary-container/80 transition-colors">
              <span className="material-symbols-outlined text-lg group-open:rotate-90 transition-transform">chevron_right</span>
              Por que a subordinação é essencial?
            </summary>
            <div className="mt-3 p-4 rounded-xl glass-panel border border-outline-variant/15 text-sm text-on-surface-variant leading-relaxed space-y-3">
              <p>
                A subordinação é o principal mecanismo de credit enhancement em FIDCs. Funciona como uma apólice de seguro: a cota Junior absorve perdas antes que elas atinjam os investidores Sênior. Isso torna as cotas Sênior atraentes para investidores conservadores (fundos de pensão, bancos), enquanto as cotas Junior — de maior risco — atraem investidores sofisticados em busca de retornos mais elevados.
              </p>
              <p>
                O índice de subordinação determina quanto de perda o fundo consegue absorver antes que os investidores Sênior sejam afetados. Um índice de 20% significa que o fundo pode perder até 20% do seu PL sem que as cotas Sênior sofram qualquer impacto.
              </p>
            </div>
          </details>

          <details className="group mt-2">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary-container hover:text-primary-container/80 transition-colors">
              <span className="material-symbols-outlined text-lg group-open:rotate-90 transition-transform">chevron_right</span>
              Recomposição da Subordinação
            </summary>
            <div className="mt-3 p-4 rounded-xl glass-panel border border-outline-variant/15 text-sm text-on-surface-variant leading-relaxed space-y-3">
              <p>
                Quando perdas reduzem o nível de subordinação abaixo do mínimo contratual (drawdown), o fundo precisa recompor. As opções incluem:
              </p>
              <p>
                <strong className="text-on-surface">(1) Retenção automática de receita</strong> — o excesso de spread é retido em vez de distribuído, reconstruindo gradualmente a subordinação;{" "}
                <strong className="text-on-surface">(2) Aporte de capital</strong> — o originador ou os detentores Junior injetam novo capital;{" "}
                <strong className="text-on-surface">(3) Aceleração de amortização</strong> — pagamento antecipado de cotas Sênior para restaurar o índice;{" "}
                <strong className="text-on-surface">(4) Substituição de ativos</strong> — troca de recebíveis com baixo desempenho por ativos de melhor qualidade.
              </p>
            </div>
          </details>

          <details className="group mt-2">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary-container hover:text-primary-container/80 transition-colors">
              <span className="material-symbols-outlined text-lg group-open:rotate-90 transition-transform">chevron_right</span>
              Remuneração: Por que o Junior ganha mais?
            </summary>
            <div className="mt-3 p-4 rounded-xl glass-panel border border-outline-variant/15 text-sm text-on-surface-variant leading-relaxed space-y-3">
              <p>
                Estrutura típica de retornos: cotas Sênior rendem CDI + 1–3% (baixo risco, pagamento prioritário); Mezanino rende CDI + 4–7% (risco médio); Junior rende CDI + 8–15%+ (maior risco, absorve perdas primeiro, mas fica com o excesso de spread).
              </p>
              <p>
                O detentor Junior — geralmente o próprio originador — tem incentivo direto para manter a qualidade de crédito da carteira, pois é o primeiro a perder dinheiro se a inadimplência disparar. Esse alinhamento de interesses é um dos pilares que tornam a estrutura FIDC robusta para os demais cotistas.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
