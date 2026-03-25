"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { calculateLeverage, CAR_MINIMUM, LEVERAGE_MINIMUM } from "@/lib/financial-regulation";

const LeverageGauge = dynamic(() => import("./charts/LeverageGauge"), { ssr: false });

const STATUS_MESSAGES: Record<string, { icon: string; color: string; text: string }> = {
  "both-ok": {
    icon: "check_circle",
    color: "#4edea3",
    text: "Banco cumpre ambas as exigências!",
  },
  "car-violation": {
    icon: "error",
    color: "#ff4444",
    text: "Restrição ativa: Requerimento Mínimo de Capital não satisfeito",
  },
  "leverage-violation": {
    icon: "error",
    color: "#ff4444",
    text: "Restrição ativa: Índice de Alavancagem (ex: bancos com ativos em excesso, mas de baixo risco)",
  },
  "both-violation": {
    icon: "error",
    color: "#ff4444",
    text: "Banco em situação crítica - viola ambas as regras!",
  },
};

export default function AlavancagemModule() {
  const [capital, setCapital] = useState(100);
  const [totalAssets, setTotalAssets] = useState(1500);
  const [rwaPercent, setRwaPercent] = useState(70);

  const result = useMemo(
    () => calculateLeverage({ capital, totalAssets, rwaPercent }),
    [capital, totalAssets, rwaPercent]
  );

  const status = STATUS_MESSAGES[result.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-1">
          As Duas Restrições Simultâneas
        </h2>
        <p className="text-sm text-on-surface-variant">
          Todo banco enfrenta dois limites: Capital baseado em risco (CAR) e
          Índice de Alavancagem
        </p>
      </div>

      {/* Input panel */}
      <div className="glass-panel rounded-xl p-4 border border-outline-variant/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Capital */}
          <div>
            <label className="block text-xs text-on-surface-variant mb-1">
              Capital ($M)
            </label>
            <input
              type="number"
              min={50}
              max={300}
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full bg-surface-container rounded-lg px-3 py-2 text-sm text-on-surface border border-outline-variant/20 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Total Assets */}
          <div>
            <label className="block text-xs text-on-surface-variant mb-1">
              Ativos Totais: ${totalAssets}M
            </label>
            <input
              type="range"
              min={500}
              max={5000}
              step={50}
              value={totalAssets}
              onChange={(e) => setTotalAssets(Number(e.target.value))}
              className="w-full accent-[#00f2ff]"
            />
          </div>

          {/* RWA % */}
          <div>
            <label className="block text-xs text-on-surface-variant mb-1">
              RWA %: {rwaPercent}%
            </label>
            <input
              type="range"
              min={40}
              max={100}
              value={rwaPercent}
              onChange={(e) => setRwaPercent(Number(e.target.value))}
              className="w-full accent-[#00f2ff]"
            />
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-outline-variant/10 text-center">
          <p className="text-xs text-on-surface-variant">RWA</p>
          <p className="text-xl font-bold text-primary">
            ${result.rwa.toFixed(0)}M
          </p>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-outline-variant/10 text-center">
          <p className="text-xs text-on-surface-variant">CAR</p>
          <p
            className={`text-xl font-bold ${
              result.car >= CAR_MINIMUM ? "text-[#4edea3]" : "text-[#ff4444]"
            }`}
          >
            {result.car.toFixed(1)}%
          </p>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-outline-variant/10 text-center">
          <p className="text-xs text-on-surface-variant">Alavancagem</p>
          <p
            className={`text-xl font-bold ${
              result.leverage >= LEVERAGE_MINIMUM
                ? "text-[#4edea3]"
                : "text-[#ff4444]"
            }`}
          >
            {result.leverage.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Two gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LeverageGauge
          value={parseFloat(result.car.toFixed(1))}
          label="CAR - Índice de Adequação de Capital (%)"
          threshold={CAR_MINIMUM}
          maxRange={30}
        />
        <LeverageGauge
          value={parseFloat(result.leverage.toFixed(1))}
          label="Índice de Alavancagem (%)"
          threshold={LEVERAGE_MINIMUM}
          maxRange={20}
        />
      </div>

      {/* Status callout */}
      <div
        className="glass-panel rounded-xl p-4 border text-sm"
        style={{ borderColor: `${status.color}30` }}
      >
        <div className="flex items-center gap-2" style={{ color: status.color }}>
          <span className="material-symbols-outlined">{status.icon}</span>
          <span className="font-semibold">{status.text}</span>
        </div>
      </div>
    </div>
  );
}
