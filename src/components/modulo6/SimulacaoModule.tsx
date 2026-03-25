"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  createInitialState,
  advanceYear,
  isGameOver,
  getGameOutcome,
  CAR_MINIMUM,
  LEVERAGE_MINIMUM,
} from "@/lib/financial-regulation";
import type {
  SimulationState,
  SimulationYearInput,
} from "@/lib/financial-regulation";

const SimulationChart = dynamic(() => import("./charts/SimulationChart"), {
  ssr: false,
});

export default function SimulacaoModule() {
  const [gameState, setGameState] = useState<SimulationState>(
    createInitialState()
  );
  const [yearInputs, setYearInputs] = useState<SimulationYearInput>({
    growthRate: 12,
    roa: 4,
    isStress: false,
  });

  const preview = useMemo(
    () => advanceYear(gameState, yearInputs),
    [gameState, yearInputs]
  );

  const gameOver = isGameOver(gameState);

  const handleAdvance = useCallback(() => {
    const { nextState } = advanceYear(gameState, yearInputs);
    setGameState(nextState);
    setYearInputs({ growthRate: 12, roa: 4, isStress: false });
  }, [gameState, yearInputs]);

  const handleReset = useCallback(() => {
    setGameState(createInitialState());
    setYearInputs({ growthRate: 12, roa: 4, isStress: false });
  }, []);

  const lastResult =
    gameState.history.length > 0
      ? gameState.history[gameState.history.length - 1]
      : null;
  const isSuccess =
    lastResult !== null &&
    lastResult.car >= CAR_MINIMUM &&
    lastResult.leverage >= LEVERAGE_MINIMUM;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-1">
          Construa seu Banco!
        </h2>
        <p className="text-sm text-on-surface-variant">
          Gerencie um banco virtual por 3 anos. Defina crescimento, rentabilidade
          e enfrente cenários de stress, mantendo os índices regulatórios.
        </p>
      </div>

      {/* Active game */}
      {!gameOver && (
        <>
          {/* Year badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-primary">
              <span className="material-symbols-outlined text-base">
                calendar_month
              </span>
              Ano {gameState.currentYear}
            </span>
          </div>

          {/* Input controls */}
          <div className="glass-panel rounded-xl p-4 border border-outline-variant/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Growth rate */}
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">
                  Crescimento anual dos ativos (%): {yearInputs.growthRate}%
                </label>
                <input
                  type="range"
                  min={-20}
                  max={60}
                  step={1}
                  value={yearInputs.growthRate}
                  onChange={(e) =>
                    setYearInputs((prev) => ({
                      ...prev,
                      growthRate: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#00f2ff]"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
                  <span>-20%</span>
                  <span>60%</span>
                </div>
              </div>

              {/* ROA */}
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">
                  ROA esperado (%): {yearInputs.roa.toFixed(1)}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={0.1}
                  value={yearInputs.roa}
                  onChange={(e) =>
                    setYearInputs((prev) => ({
                      ...prev,
                      roa: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#00f2ff]"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
                  <span>0%</span>
                  <span>8%</span>
                </div>
              </div>

              {/* Stress */}
              <div className="flex items-center gap-2 self-center">
                <input
                  type="checkbox"
                  id="stress-toggle"
                  checked={yearInputs.isStress}
                  onChange={(e) =>
                    setYearInputs((prev) => ({
                      ...prev,
                      isStress: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#ff4444] rounded"
                />
                <label
                  htmlFor="stress-toggle"
                  className="text-xs text-on-surface-variant cursor-pointer"
                >
                  Evento de stress/recessão neste ano?
                </label>
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Capital */}
            <MetricCard
              label="Capital"
              value={`$${preview.result.capitalFinal}M`}
              delta={`${preview.result.deltaCapital > 0 ? "+" : ""}${preview.result.deltaCapital.toFixed(1)}M`}
              deltaPositive={preview.result.deltaCapital > 0}
            />

            {/* Assets */}
            <MetricCard
              label="Ativos Totais"
              value={`$${preview.result.assets}M`}
            />

            {/* RWA % */}
            <MetricCard
              label="RWA / Ativos"
              value={`${gameState.rwaPercent}%`}
            />

            {/* CAR */}
            <MetricCard
              label="CAR"
              value={`${preview.result.car}%`}
              statusOk={preview.result.car >= CAR_MINIMUM}
            />

            {/* Leverage */}
            <MetricCard
              label="Leverage Ratio"
              value={`${preview.result.leverage}%`}
              statusOk={preview.result.leverage >= LEVERAGE_MINIMUM}
            />

            {/* ROA */}
            <MetricCard
              label="ROA realizado"
              value={`${yearInputs.roa.toFixed(1)}%`}
            />

            {/* Dividends */}
            <MetricCard
              label="Dividendos"
              value={`$${preview.result.dividends.toFixed(1)}M`}
              subtitle="50% do lucro"
            />
          </div>

          {/* Advance button */}
          <button
            onClick={handleAdvance}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
            Avançar para o próximo ano
          </button>
        </>
      )}

      {/* Game over */}
      {gameOver && (
        <div
          className="glass-panel rounded-xl p-6 border-2 text-center"
          style={{
            borderColor: isSuccess ? "#4edea3" : "#ff4444",
          }}
        >
          <span
            className="material-symbols-outlined text-5xl mb-3 block"
            style={{ color: isSuccess ? "#4edea3" : "#ff4444" }}
          >
            {isSuccess ? "celebration" : "warning"}
          </span>
          <p
            className="text-lg font-bold mb-2"
            style={{ color: isSuccess ? "#4edea3" : "#ff4444" }}
          >
            {isSuccess ? "Resultado: Sucesso!" : "Resultado: Atenção!"}
          </p>
          <p className="text-sm text-on-surface-variant">
            {getGameOutcome(gameState)}
          </p>
        </div>
      )}

      {/* History chart */}
      {gameState.history.length > 0 && (
        <SimulationChart history={gameState.history} />
      )}

      {/* Reset button */}
      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="px-5 py-2 rounded-xl border border-outline-variant/30 text-on-surface-variant text-sm font-medium hover:bg-surface-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">restart_alt</span>
          Reiniciar Simulação
        </button>
      </div>
    </div>
  );
}

/* ─── Metric Card helper ─── */

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  statusOk?: boolean;
  subtitle?: string;
}

function MetricCard({
  label,
  value,
  delta,
  deltaPositive,
  statusOk,
  subtitle,
}: MetricCardProps) {
  return (
    <div className="glass-panel rounded-xl p-3 border border-outline-variant/10 text-center">
      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="flex items-center justify-center gap-1">
        <p className="text-lg font-bold text-on-surface">{value}</p>
        {statusOk !== undefined && (
          <span
            className="material-symbols-outlined text-base"
            style={{ color: statusOk ? "#4edea3" : "#ff4444" }}
          >
            {statusOk ? "check_circle" : "cancel"}
          </span>
        )}
      </div>
      {delta && (
        <p
          className="text-xs font-medium"
          style={{ color: deltaPositive ? "#4edea3" : "#ff4444" }}
        >
          {delta}
        </p>
      )}
      {subtitle && (
        <p className="text-[10px] text-on-surface-variant">{subtitle}</p>
      )}
    </div>
  );
}
