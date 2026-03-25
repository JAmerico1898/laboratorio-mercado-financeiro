"use client";

import { useState } from "react";
import { FeatureDefinition } from "@/lib/credit-risk";
import { CUTOFF_MIN, CUTOFF_MAX, CUTOFF_STEP } from "@/lib/credit-risk/constants";

interface ControlBarProps {
  features: FeatureDefinition[];
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  cutoff: number;
  onCutoffChange: (cutoff: number) => void;
  onRun: () => void;
  loading: boolean;
  dataLoading: boolean;
  dataError: string | null;
  dataStats: { trainingRows: number; productionRows: number } | null;
}

export default function ControlBar({
  features,
  selectedFeatures,
  onFeaturesChange,
  cutoff,
  onCutoffChange,
  onRun,
  loading,
  dataLoading,
  dataError,
  dataStats,
}: ControlBarProps) {
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleFeature = (key: string) => {
    if (selectedFeatures.includes(key)) {
      onFeaturesChange(selectedFeatures.filter((f) => f !== key));
    } else {
      onFeaturesChange([...selectedFeatures, key]);
    }
  };

  const cutoffWarning =
    cutoff < 0.3
      ? { text: "Cut-off baixo: Muitas negações", color: "text-yellow-400" }
      : cutoff > 0.7
      ? { text: "Cut-off alto: Muitas aprovações", color: "text-yellow-400" }
      : { text: "Cut-off equilibrado", color: "text-secondary" };

  const canRun = selectedFeatures.length > 0 && !dataLoading && !dataError;

  return (
    <section className="px-6 md:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Panel card */}
        <div className="bg-surface-container-low/60 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6 md:p-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-2xl text-primary-container">
              settings
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
              Configuração do Modelo
            </h2>
          </div>

          {/* Row 1: Variable selection */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3 block">
              Seleção de Variáveis
            </label>

            <div className="flex flex-wrap items-start gap-3">
              {/* Dropdown trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-surface-container-high text-on-surface border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 hover:border-primary-container/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">tune</span>
                  Variáveis ({selectedFeatures.length})
                  <span className="material-symbols-outlined text-lg">
                    {showDropdown ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-surface-container-high border border-outline-variant/30 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto">
                    {features.map((f) => (
                      <label
                        key={f.key}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-highest cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(f.key)}
                          onChange={() => toggleFeature(f.key)}
                          className="accent-primary-container w-4 h-4"
                        />
                        <span className="text-on-surface">{f.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected chips */}
              <div className="flex flex-wrap gap-2 flex-1">
                {selectedFeatures.map((key) => {
                  const feat = features.find((f) => f.key === key);
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/10 border border-primary-container/20 rounded-full text-xs text-primary-container"
                    >
                      {feat?.label ?? key}
                      <button
                        type="button"
                        onClick={() => toggleFeature(key)}
                        className="hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                  );
                })}
                {selectedFeatures.length === 0 && (
                  <span className="text-sm text-yellow-400 py-1.5">
                    Selecione pelo menos uma variável
                  </span>
                )}
              </div>
            </div>

            {/* Feature descriptions toggle */}
            <button
              type="button"
              onClick={() => setShowDescriptions(!showDescriptions)}
              className="text-xs text-outline hover:text-primary-container transition-colors mt-3 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                {showDescriptions ? "visibility_off" : "visibility"}
              </span>
              {showDescriptions ? "Ocultar" : "Ver"} descrição das variáveis
            </button>

            {showDescriptions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                {features.map((f) => (
                  <div
                    key={f.key}
                    className={`text-xs p-3 rounded-lg ${
                      selectedFeatures.includes(f.key)
                        ? "bg-primary-container/5 border border-primary-container/10"
                        : "bg-surface-container-high/50 text-outline"
                    }`}
                  >
                    <span className="font-semibold text-on-surface">
                      {f.label}
                    </span>{" "}
                    <span className="text-on-surface-variant">({f.key})</span>
                    <br />
                    <span className="text-on-surface-variant">{f.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 2: Cut-off + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Cut-off */}
            <div className="bg-surface-container-high/40 rounded-xl p-5">
              <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4 block">
                Cut-off de Decisão
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={CUTOFF_MIN}
                  max={CUTOFF_MAX}
                  step={CUTOFF_STEP}
                  value={cutoff}
                  onChange={(e) => onCutoffChange(Number(e.target.value))}
                  className="flex-1 h-2 accent-primary-container"
                />
                <span className="text-2xl font-bold text-on-surface tabular-nums min-w-[4rem] text-right">
                  {(cutoff * 100).toFixed(0)}%
                </span>
              </div>
              <p className={`text-xs mt-2 ${cutoffWarning.color}`}>
                {cutoffWarning.text}
              </p>
            </div>

            {/* Data stats */}
            <div className="bg-surface-container-high/40 rounded-xl p-5">
              <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4 block">
                Dados Carregados
              </label>
              {dataLoading ? (
                <div className="flex items-center gap-2 text-sm text-outline">
                  <span className="material-symbols-outlined text-lg animate-spin">
                    progress_activity
                  </span>
                  Carregando dados...
                </div>
              ) : dataError ? (
                <p className="text-sm text-red-400">{dataError}</p>
              ) : dataStats ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-outline uppercase tracking-wider">
                      Treino
                    </div>
                    <div className="text-xl font-bold text-on-surface">
                      {dataStats.trainingRows.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-outline uppercase tracking-wider">
                      Produção
                    </div>
                    <div className="text-xl font-bold text-on-surface">
                      {dataStats.productionRows.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-outline uppercase tracking-wider">
                      Variáveis
                    </div>
                    <div className="text-xl font-bold text-on-surface">
                      {selectedFeatures.length}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Row 3: Run button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onRun}
              disabled={!canRun || loading}
              className={`px-10 py-4 rounded-xl font-bold text-base tracking-tight transition-all flex items-center gap-2 ${
                !canRun || loading
                  ? "bg-outline/20 text-outline cursor-not-allowed"
                  : "bg-gradient-to-br from-primary to-primary-container text-on-primary hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(0,219,231,0.15)]"
              }`}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">
                    progress_activity
                  </span>
                  Treinando Modelo...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">
                    play_arrow
                  </span>
                  Executar Modelo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
