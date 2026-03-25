"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  calculateRwa,
  ASSET_LABELS,
  RISK_WEIGHTS,
  REGULATORY_CAPITAL,
  CAR_MINIMUM,
} from "@/lib/financial-regulation";
import type { AssetAllocation } from "@/lib/financial-regulation";

const PortfolioCharts = dynamic(() => import("./charts/PortfolioCharts"), { ssr: false });
const CarGauge = dynamic(() => import("./charts/CarGauge"), { ssr: false });

const ASSET_KEYS: (keyof AssetAllocation)[] = [
  "cash",
  "govBonds",
  "mortgages",
  "corpLoans",
  "highYield",
  "unrated",
];

export default function RwaModule() {
  const [allocation, setAllocation] = useState<AssetAllocation>({
    cash: 20,
    govBonds: 15,
    mortgages: 30,
    corpLoans: 20,
    highYield: 10,
    unrated: 5,
  });

  const [showObjectives, setShowObjectives] = useState(false);

  const total = useMemo(
    () => Object.values(allocation).reduce((s, v) => s + v, 0),
    [allocation]
  );

  const rwaResult = useMemo(
    () => (total === 100 ? calculateRwa(allocation) : null),
    [allocation, total]
  );

  const handleSlider = (key: keyof AssetAllocation, value: number) => {
    setAllocation((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-1">
          Ativos Ponderados por Risco (RWA)
        </h2>
        <button
          onClick={() => setShowObjectives(!showObjectives)}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">
            {showObjectives ? "expand_less" : "expand_more"}
          </span>
          Objetivos de aprendizagem
        </button>
        {showObjectives && (
          <div className="glass-panel rounded-xl p-4 mt-2 border border-outline-variant/10 text-sm text-on-surface-variant space-y-1">
            <p>- Entender como diferentes ativos contribuem para o RWA</p>
            <p>- Calcular o Índice de Adequação de Capital (CAR)</p>
            <p>- Experimentar com alocações de portfólio e ver o impacto regulatório</p>
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Monte seu Banco */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-on-surface">Monte seu Banco</h3>

          <div className="glass-panel rounded-xl p-4 border border-outline-variant/10 space-y-4">
            {ASSET_KEYS.map((key) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-on-surface-variant">
                    {ASSET_LABELS[key]} ({(RISK_WEIGHTS[key] * 100).toFixed(0)}%)
                  </span>
                  <span className="text-on-surface font-medium">
                    ${allocation[key]}M
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={allocation[key]}
                  onChange={(e) => handleSlider(key, Number(e.target.value))}
                  className="w-full accent-[#00f2ff]"
                />
              </div>
            ))}

            {/* Total badge */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
              <span className="text-sm text-on-surface-variant">Total:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  total === 100
                    ? "bg-[#4edea3]/20 text-[#4edea3]"
                    : "bg-[#ff4444]/20 text-[#ff4444]"
                }`}
              >
                ${total}M {total !== 100 && `(deve ser $100M)`}
              </span>
            </div>
          </div>

          {/* Data table */}
          {rwaResult && (
            <div className="glass-panel rounded-xl border border-outline-variant/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-on-surface-variant">
                    <th className="text-left p-3">Classe</th>
                    <th className="text-right p-3">Alocação ($M)</th>
                    <th className="text-right p-3">Peso Risco</th>
                    <th className="text-right p-3">RWA ($M)</th>
                  </tr>
                </thead>
                <tbody>
                  {rwaResult.details.map((d) => (
                    <tr
                      key={d.label}
                      className="border-b border-outline-variant/5 text-on-surface"
                    >
                      <td className="p-3">{d.label}</td>
                      <td className="text-right p-3">{d.allocation.toFixed(1)}</td>
                      <td className="text-right p-3">{(d.riskWeight * 100).toFixed(0)}%</td>
                      <td className="text-right p-3">{d.rwaContribution.toFixed(1)}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold text-on-surface">
                    <td className="p-3">Total</td>
                    <td className="text-right p-3">{total}</td>
                    <td className="p-3" />
                    <td className="text-right p-3">{rwaResult.rwaTotal.toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right — Dashboard em Tempo Real */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-on-surface">
            Dashboard em Tempo Real
          </h3>

          {rwaResult ? (
            <>
              <PortfolioCharts allocation={allocation} rwaResult={rwaResult} />

              {/* Metrics cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-panel rounded-xl p-3 border border-outline-variant/10 text-center">
                  <p className="text-xs text-on-surface-variant">Patrimônio Regulatório</p>
                  <p className="text-lg font-bold text-primary">${REGULATORY_CAPITAL}M</p>
                </div>
                <div className="glass-panel rounded-xl p-3 border border-outline-variant/10 text-center">
                  <p className="text-xs text-on-surface-variant">CAR</p>
                  <p
                    className={`text-lg font-bold ${
                      rwaResult.car >= CAR_MINIMUM ? "text-[#4edea3]" : "text-[#ff4444]"
                    }`}
                  >
                    {rwaResult.car.toFixed(1)}%
                  </p>
                </div>
                <div className="glass-panel rounded-xl p-3 border border-outline-variant/10 text-center">
                  <p className="text-xs text-on-surface-variant">Buffer</p>
                  <p
                    className={`text-lg font-bold ${
                      rwaResult.capitalBuffer >= 0 ? "text-[#4edea3]" : "text-[#ff4444]"
                    }`}
                  >
                    {rwaResult.capitalBuffer.toFixed(1)}%
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-xl p-8 border border-outline-variant/10 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl mb-2 block">
                tune
              </span>
              <p>Ajuste os sliders para que o total seja exatamente $100M</p>
            </div>
          )}
        </div>
      </div>

      {/* Full-width gauge + status */}
      {rwaResult && (
        <div className="space-y-4">
          <CarGauge car={rwaResult.car} />

          <div
            className={`glass-panel rounded-xl p-4 border text-sm ${
              rwaResult.status === "well-capitalized"
                ? "border-[#4edea3]/30 text-[#4edea3]"
                : rwaResult.status === "adequate"
                ? "border-[#f59e0b]/30 text-[#f59e0b]"
                : "border-[#ff4444]/30 text-[#ff4444]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">
                {rwaResult.status === "well-capitalized"
                  ? "check_circle"
                  : rwaResult.status === "adequate"
                  ? "warning"
                  : "error"}
              </span>
              <span className="font-semibold">
                {rwaResult.status === "well-capitalized"
                  ? "Banco bem capitalizado! CAR acima do mínimo regulatório."
                  : rwaResult.status === "adequate"
                  ? "Atenção: CAR acima de 8%, mas abaixo do buffer de conservação (10.5%)."
                  : "Banco subcapitalizado! CAR abaixo do mínimo regulatório de 8%."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
