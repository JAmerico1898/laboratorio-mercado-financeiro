"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { calculateProvisioning } from "@/lib/financial-regulation";
import type { Scenario, ProvisioningModel } from "@/lib/financial-regulation";

const ProvisioningChart = dynamic(() => import("./charts/ProvisioningChart"), { ssr: false });

const CALLOUT_MESSAGES: Record<string, { icon: string; text: string }> = {
  "non-recession-4966": {
    icon: "shield",
    text: "Em tempos bons a Res 4966 já provisiona mais que a Res 2682 → constrói colchão antecipado",
  },
  "non-recession-2682": {
    icon: "warning",
    text: "Res 2682 praticamente não provisiona em bons tempos (só quando a perda já ocorreu)",
  },
  "recession-4966": {
    icon: "verified",
    text: "Res 4966 antecipa a perda esperada → cria colchão antes da recessão e estabiliza lucro",
  },
  "recession-2682": {
    icon: "crisis_alert",
    text: 'Res 2682: "cliff effect" → lucro inflado no início, depois colapso (crise 2008)',
  },
};

export default function ProvisaoModule() {
  const [portfolio, setPortfolio] = useState(500);
  const [interestRate, setInterestRate] = useState(15);
  const [scenario, setScenario] = useState<Scenario>("Normal");
  const [model, setModel] = useState<ProvisioningModel>("Res4966");

  const result = useMemo(
    () =>
      calculateProvisioning({ portfolio, interestRate, scenario, model }),
    [portfolio, interestRate, scenario, model]
  );

  const callout = CALLOUT_MESSAGES[result.calloutKey];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-1">
          Provisões e Ciclo de Crédito
        </h2>
        <p className="text-sm text-on-surface-variant">
          Objetivo: ver na prática por que a Res 4966 reduz a prociclicidade e
          cria colchão antes da crise
        </p>
      </div>

      {/* Configuration panel */}
      <div className="glass-panel rounded-xl p-4 border border-outline-variant/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Portfolio */}
          <div>
            <label className="block text-xs text-on-surface-variant mb-1">
              Portfólio ($M)
            </label>
            <input
              type="number"
              min={100}
              max={2000}
              step={100}
              value={portfolio}
              onChange={(e) => setPortfolio(Number(e.target.value))}
              className="w-full bg-surface-container rounded-lg px-3 py-2 text-sm text-on-surface border border-outline-variant/20 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Interest rate */}
          <div>
            <label className="block text-xs text-on-surface-variant mb-1">
              Taxa de juros: {interestRate}%
            </label>
            <input
              type="range"
              min={10}
              max={25}
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#00f2ff]"
            />
          </div>

          {/* Scenario */}
          <div>
            <label className="block text-xs text-on-surface-variant mb-1">
              Cenário
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as Scenario)}
              className="w-full bg-surface-container rounded-lg px-3 py-2 text-sm text-on-surface border border-outline-variant/20 focus:border-primary focus:outline-none"
            >
              <option value="Boom">Boom</option>
              <option value="Normal">Normal</option>
              <option value="Recessão">Recessão</option>
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs text-on-surface-variant mb-1">
              Modelo
            </label>
            <div className="flex gap-3 mt-1">
              {(["Res2682", "Res4966"] as const).map((m) => (
                <label key={m} className="flex items-center gap-1.5 text-sm text-on-surface cursor-pointer">
                  <input
                    type="radio"
                    name="model"
                    checked={model === m}
                    onChange={() => setModel(m)}
                    className="accent-[#00f2ff]"
                  />
                  {m === "Res2682" ? "Res 2682" : "Res 4966"}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="glass-panel rounded-xl border border-outline-variant/10 overflow-x-auto">
        <div className="p-3 border-b border-outline-variant/10">
          <h3 className="text-sm font-semibold text-on-surface">Simulação 5 anos</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant/10 text-on-surface-variant">
              <th className="text-left p-3">Ano</th>
              <th className="text-right p-3">Receita Juros ($M)</th>
              <th className="text-right p-3">Provisão ($M)</th>
              <th className="text-right p-3">Lucro Líquido ($M)</th>
            </tr>
          </thead>
          <tbody>
            {result.years.map((y) => (
              <tr
                key={y.year}
                className="border-b border-outline-variant/5 text-on-surface"
              >
                <td className="p-3">{y.year}</td>
                <td className="text-right p-3 text-[#4edea3]">
                  {y.interest.toFixed(1)}
                </td>
                <td className="text-right p-3 text-[#ff4444]">
                  {y.provision.toFixed(1)}
                </td>
                <td
                  className={`text-right p-3 font-medium ${
                    y.netProfit >= 0 ? "text-[#4edea3]" : "text-[#ff4444]"
                  }`}
                >
                  {y.netProfit.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <ProvisioningChart years={result.years} />

      {/* Cumulative metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-outline-variant/10 text-center">
          <p className="text-xs text-on-surface-variant">Provisões Acumuladas</p>
          <p className="text-xl font-bold text-[#ff4444]">
            ${result.cumProvisions.toFixed(1)}M
          </p>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-outline-variant/10 text-center">
          <p className="text-xs text-on-surface-variant">Lucro Acumulado</p>
          <p
            className={`text-xl font-bold ${
              result.cumProfit >= 0 ? "text-[#4edea3]" : "text-[#ff4444]"
            }`}
          >
            ${result.cumProfit.toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Educational callout */}
      {callout && (
        <div className="glass-panel rounded-xl p-4 border border-outline-variant/10 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-xl mt-0.5">
            {callout.icon}
          </span>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {callout.text}
          </p>
        </div>
      )}
    </div>
  );
}
