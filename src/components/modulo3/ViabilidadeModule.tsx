"use client";

import { useState, useMemo } from "react";
import type { ViabilidadeParams } from "@/lib/fidc/types";
import {
  VIABILIDADE_DEFAULTS,
  PL_MIN, PL_MAX, PL_STEP,
  YIELD_MIN, YIELD_MAX, YIELD_STEP,
  MGMT_FEE_MIN, MGMT_FEE_MAX, MGMT_FEE_STEP,
  ADMIN_FEE_MIN, ADMIN_FEE_MAX, ADMIN_FEE_STEP,
} from "@/lib/fidc/constants";
import {
  calculateViabilidade,
  calculateSensitivity,
  calculateCostBreakdown,
} from "@/lib/fidc/viabilidade-calc";
import WaterfallChart from "@/components/modulo3/charts/WaterfallChart";
import SensitivityChart from "@/components/modulo3/charts/SensitivityChart";

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (v: number) => void;
}

function SliderField({ label, value, min, max, step, displayValue, onChange }: SliderFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-sm text-on-surface-variant font-medium">{label}</span>
        <span className="text-sm font-semibold text-primary-container tabular-nums">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-surface-container-highest cursor-pointer accent-primary-container"
      />
      <div className="flex justify-between text-xs text-outline-variant">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

interface CostInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

function CostInput({ label, value, onChange }: CostInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-on-surface-variant">{label}</label>
      <input
        type="number"
        value={value}
        step={1000}
        min={0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:border-primary-container/60 tabular-nums"
      />
    </div>
  );
}

const VIABILITY_CONFIG = {
  viable: {
    label: "Viável",
    sublabel: "Margem satisfatória",
    bgClass: "bg-emerald-500/10 border-emerald-500/30",
    textClass: "text-emerald-400",
    icon: "check_circle",
  },
  risky: {
    label: "Arriscado",
    sublabel: "Margem baixa",
    bgClass: "bg-yellow-500/10 border-yellow-500/30",
    textClass: "text-yellow-400",
    icon: "warning",
  },
  inviable: {
    label: "Inviável",
    sublabel: "Resultado negativo",
    bgClass: "bg-red-500/10 border-red-500/30",
    textClass: "text-red-400",
    icon: "cancel",
  },
} as const;

export default function ViabilidadeModule() {
  const [params, setParams] = useState<ViabilidadeParams>(VIABILIDADE_DEFAULTS);
  const [showCostConfig, setShowCostConfig] = useState(false);

  const result = useMemo(() => calculateViabilidade(params), [params]);
  const sensitivityData = useMemo(() => calculateSensitivity(params), [params]);
  const costBreakdown = useMemo(() => calculateCostBreakdown(params, result), [params, result]);

  const viabilityConfig = VIABILITY_CONFIG[result.viabilityLevel];

  function setParam<K extends keyof ViabilidadeParams>(key: K, value: ViabilidadeParams[K]) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
      {/* LEFT COLUMN — Controls */}
      <div className="flex flex-col gap-6">
        {/* Card: Main parameters */}
        <div className="bg-surface-container rounded-2xl p-5 flex flex-col gap-5 border border-outline-variant/15">
          <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary-container">tune</span>
            Parâmetros Principais
          </h3>

          <SliderField
            label="PL do Fundo"
            value={params.pl}
            min={PL_MIN}
            max={PL_MAX}
            step={PL_STEP}
            displayValue={`R$ ${params.pl}M`}
            onChange={(v) => setParam("pl", v)}
          />

          <SliderField
            label="Yield da Carteira"
            value={params.yieldRate}
            min={YIELD_MIN}
            max={YIELD_MAX}
            step={YIELD_STEP}
            displayValue={`${params.yieldRate.toFixed(1)}% a.a.`}
            onChange={(v) => setParam("yieldRate", v)}
          />

          <SliderField
            label="Taxa de Gestão"
            value={params.managementFee}
            min={MGMT_FEE_MIN}
            max={MGMT_FEE_MAX}
            step={MGMT_FEE_STEP}
            displayValue={`${params.managementFee.toFixed(1)}% a.a.`}
            onChange={(v) => setParam("managementFee", v)}
          />

          <SliderField
            label="Taxa de Administração"
            value={params.adminFee}
            min={ADMIN_FEE_MIN}
            max={ADMIN_FEE_MAX}
            step={ADMIN_FEE_STEP}
            displayValue={`${params.adminFee.toFixed(2)}% a.a.`}
            onChange={(v) => setParam("adminFee", v)}
          />
        </div>

        {/* Card: Cost configuration (expandable) */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-hidden">
          <button
            onClick={() => setShowCostConfig((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-on-surface uppercase tracking-wider hover:bg-surface-container-highest/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-on-surface-variant">receipt_long</span>
              Custos Fixos
            </span>
            <span className="material-symbols-outlined text-base text-on-surface-variant transition-transform duration-200"
              style={{ transform: showCostConfig ? "rotate(180deg)" : "rotate(0deg)" }}>
              expand_more
            </span>
          </button>

          {showCostConfig && (
            <div className="px-5 pb-5 flex flex-col gap-3 border-t border-outline-variant/15 pt-4">
              <CostInput
                label="Auditoria (R$/ano)"
                value={params.auditCost}
                onChange={(v) => setParam("auditCost", v)}
              />
              <CostInput
                label="Rating (R$/ano)"
                value={params.ratingCost}
                onChange={(v) => setParam("ratingCost", v)}
              />
              <CostInput
                label="CVM + Anbima (R$/ano)"
                value={params.cvmFees}
                onChange={(v) => setParam("cvmFees", v)}
              />
              <CostInput
                label="Jurídico Setup (R$ total)"
                value={params.legalSetup}
                onChange={(v) => setParam("legalSetup", v)}
              />
              <CostInput
                label="Outros Fixos (R$/ano)"
                value={params.otherFixed}
                onChange={(v) => setParam("otherFixed", v)}
              />
              <p className="text-xs text-outline-variant mt-1">
                Jurídico amortizado em 3 anos (R$ {formatBRL(params.legalSetup / 3)}/ano)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN — Visualization */}
      <div className="flex flex-col gap-6">
        {/* Metric cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/15">
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Receita Bruta</p>
            <p className="text-xl font-semibold text-emerald-400 tabular-nums">{formatBRL(result.receitaBruta)}</p>
            <p className="text-xs text-outline-variant mt-0.5">{params.yieldRate.toFixed(1)}% × PL</p>
          </div>
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/15">
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Custos Totais</p>
            <p className="text-xl font-semibold text-red-400 tabular-nums">{formatBRL(result.totalCosts)}</p>
            <p className="text-xs text-outline-variant mt-0.5">
              Fixos: {formatBRL(result.fixedCosts)} | Variáveis: {formatBRL(result.variableCosts)}
            </p>
          </div>
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/15">
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Resultado Líquido</p>
            <p className={`text-xl font-semibold tabular-nums ${result.netResult >= 0 ? "text-primary-container" : "text-red-400"}`}>
              {formatBRL(result.netResult)}
            </p>
            <p className="text-xs text-outline-variant mt-0.5">Margem: {result.margin.toFixed(1)}%</p>
          </div>
        </div>

        {/* Viability indicator */}
        <div className={`rounded-2xl p-4 border flex items-center gap-4 ${viabilityConfig.bgClass}`}>
          <span className={`material-symbols-outlined text-3xl ${viabilityConfig.textClass}`}>
            {viabilityConfig.icon}
          </span>
          <div>
            <p className={`text-base font-bold ${viabilityConfig.textClass}`}>{viabilityConfig.label}</p>
            <p className="text-sm text-on-surface-variant">{viabilityConfig.sublabel}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-on-surface-variant">Margem</p>
            <p className={`text-lg font-semibold tabular-nums ${viabilityConfig.textClass}`}>
              {result.margin.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Waterfall chart */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-hidden">
          <WaterfallChart result={result} />
        </div>

        {/* Sensitivity chart */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-hidden">
          <SensitivityChart data={sensitivityData} currentPL={params.pl} />
        </div>

        {/* Cost decomposition table */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/15">
            <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-on-surface-variant">pie_chart</span>
              Decomposição dos Custos
            </h3>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {costBreakdown.map((item) => (
              <div key={item.label} className="px-5 py-3 flex items-center gap-3">
                <span className="text-sm text-on-surface-variant flex-1">{item.label}</span>
                <div className="w-24 hidden sm:block">
                  <div className="h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-container/60"
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-outline-variant w-10 text-right tabular-nums">
                  {item.percentage.toFixed(1)}%
                </span>
                <span className="text-sm font-medium text-on-surface w-28 text-right tabular-nums">
                  {formatBRL(item.value)}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-outline-variant/20 flex justify-between items-center">
            <span className="text-sm font-semibold text-on-surface">Total</span>
            <span className="text-sm font-bold text-red-400 tabular-nums">{formatBRL(result.totalCosts)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
