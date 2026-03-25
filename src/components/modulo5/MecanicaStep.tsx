"use client";

import { useState, useMemo } from "react";
import type { MecanicaParams, MecanicaResult } from "@/lib/tokenization/types";
import { TOKEN_DISTRIBUTION } from "@/lib/tokenization/constants";
import TokenDistributionChart from "@/components/modulo5/charts/TokenDistributionChart";
import SliderField from "@/components/modulo5/SliderField";

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

const RISK_FLAG_CONFIG = {
  warning: {
    icon: "warning",
    borderClass: "border-yellow-500/40",
    bgClass: "bg-yellow-500/10",
    iconClass: "text-yellow-400",
    textClass: "text-yellow-200",
  },
  error: {
    icon: "error",
    borderClass: "border-red-500/40",
    bgClass: "bg-red-500/10",
    iconClass: "text-red-400",
    textClass: "text-red-200",
  },
  success: {
    icon: "check_circle",
    borderClass: "border-emerald-500/40",
    bgClass: "bg-emerald-500/10",
    iconClass: "text-emerald-400",
    textClass: "text-emerald-200",
  },
} as const;

export default function MecanicaStep() {
  const [params, setParams] = useState<MecanicaParams>({
    assetName: "Edifício Faria Lima 2025",
    valuation: 10_000_000,
    fractionCount: 1000,
    standard: "ERC-20",
    custodyQuality: "Alta (Banco Top-tier)",
  });

  const result = useMemo((): MecanicaResult => {
    const tokenPrice = params.valuation / params.fractionCount;
    const distribution = TOKEN_DISTRIBUTION.map((d) => ({
      stakeholder: d.stakeholder,
      quantidade: params.fractionCount * d.percentage,
    }));
    const riskFlags: MecanicaResult["riskFlags"] = [];

    if (tokenPrice < 10) {
      riskFlags.push({
        level: "warning",
        message:
          "Risco de Pulverização: Preço muito baixo pode atrair especulação excessiva.",
      });
    }

    if (params.custodyQuality === "Baixa/Inexistente") {
      riskFlags.push({
        level: "error",
        message:
          "Risco Crítico: Sem custódia robusta, o token não tem lastro real.",
      });
    } else if (params.custodyQuality === "Média (Auditoria Anual)") {
      riskFlags.push({
        level: "warning",
        message:
          "Atenção: Auditoria anual pode não capturar fraudes em tempo real.",
      });
    } else {
      riskFlags.push({
        level: "success",
        message:
          "Estrutura Robusta: Custódia de alta qualidade mitiga risco de contraparte.",
      });
    }

    return { tokenPrice, marketCap: params.valuation, distribution, riskFlags };
  }, [params]);

  function setParam<K extends keyof MecanicaParams>(key: K, value: MecanicaParams[K]) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT COLUMN — Inputs */}
      <div className="flex flex-col gap-6">
        <div className="bg-surface-container rounded-2xl p-5 flex flex-col gap-5 border border-outline-variant/15">
          <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary-container">
              tune
            </span>
            Parâmetros do Ativo
          </h3>

          {/* Asset name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-on-surface-variant font-medium">
              Nome do Ativo
            </label>
            <input
              type="text"
              value={params.assetName}
              onChange={(e) => setParam("assetName", e.target.value)}
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container/60"
            />
          </div>

          {/* Valuation */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-on-surface-variant font-medium">
              Valuation (R$)
            </label>
            <input
              type="number"
              value={params.valuation}
              step={100_000}
              min={100_000}
              onChange={(e) => setParam("valuation", Number(e.target.value))}
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container/60 tabular-nums"
            />
          </div>

          {/* Token count slider */}
          <SliderField
            label="Quantidade de Tokens"
            value={params.fractionCount}
            min={100}
            max={1_000_000}
            step={100}
            displayValue={params.fractionCount.toLocaleString("pt-BR")}
            onChange={(v) => setParam("fractionCount", v)}
          />

          {/* Token standard */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-on-surface-variant font-medium">
              Padrão do Token
            </label>
            <select
              value={params.standard}
              onChange={(e) =>
                setParam("standard", e.target.value as MecanicaParams["standard"])
              }
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container/60 cursor-pointer"
            >
              <option value="ERC-20">ERC-20 (Fungível)</option>
              <option value="ERC-721">ERC-721 (Único)</option>
            </select>
          </div>

          {/* Custody quality */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-on-surface-variant font-medium">
              Qualidade da Custódia
            </label>
            <select
              value={params.custodyQuality}
              onChange={(e) =>
                setParam(
                  "custodyQuality",
                  e.target.value as MecanicaParams["custodyQuality"]
                )
              }
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container/60 cursor-pointer"
            >
              <option value="Alta (Banco Top-tier)">Alta (Banco Top-tier)</option>
              <option value="Média (Auditoria Anual)">Média (Auditoria Anual)</option>
              <option value="Baixa/Inexistente">Baixa/Inexistente</option>
            </select>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — Outputs */}
      <div className="flex flex-col gap-6">
        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/15">
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
              Preço por Token
            </p>
            <p className="text-xl font-semibold text-primary-container tabular-nums">
              {formatBRL(result.tokenPrice)}
            </p>
            <p className="text-xs text-outline-variant mt-0.5">
              Valuation ÷ {params.fractionCount.toLocaleString("pt-BR")} tokens
            </p>
          </div>
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/15">
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
              Market Cap Inicial
            </p>
            <p className="text-xl font-semibold text-secondary tabular-nums" style={{ color: "#4edea3" }}>
              {formatBRL(result.marketCap)}
            </p>
            <p className="text-xs text-outline-variant mt-0.5">
              Valor total tokenizado
            </p>
          </div>
        </div>

        {/* Token distribution chart */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-hidden">
          <TokenDistributionChart
            distribution={result.distribution}
            assetName={params.assetName}
          />
        </div>

        {/* Risk flags */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-on-surface-variant">
              shield
            </span>
            Análise de Risco
          </h3>
          {result.riskFlags.map((flag, i) => {
            const config = RISK_FLAG_CONFIG[flag.level];
            return (
              <div
                key={i}
                className={`rounded-xl p-4 border flex items-start gap-3 ${config.bgClass} ${config.borderClass}`}
              >
                <span
                  className={`material-symbols-outlined text-xl mt-0.5 flex-shrink-0 ${config.iconClass}`}
                >
                  {config.icon}
                </span>
                <p className={`text-sm leading-relaxed ${config.textClass}`}>
                  {flag.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
