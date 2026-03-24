"use client";

import { useState } from "react";
import Link from "next/link";
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
    <div className="sticky top-0 z-50 bg-surface-container-low border-b border-outline-variant/20">
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Back arrow */}
          <Link
            href="/"
            className="text-on-surface hover:text-primary-container transition-colors text-lg"
            aria-label="Voltar"
          >
            &larr;
          </Link>

          {/* Feature selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-surface-container-high text-on-surface border border-outline-variant rounded-md px-3 py-1.5 text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              Variáveis ({selectedFeatures.length})
              <span className="material-symbols-outlined text-base">
                {showDropdown ? "expand_less" : "expand_more"}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-surface-container-high border border-outline-variant/30 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                {features.map((f) => (
                  <label
                    key={f.key}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-surface-container-highest cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(f.key)}
                      onChange={() => toggleFeature(f.key)}
                      className="accent-primary-container"
                    />
                    <span className="text-on-surface">{f.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Selected features chips */}
          <div className="flex flex-wrap gap-1 max-w-md">
            {selectedFeatures.slice(0, 3).map((key) => {
              const feat = features.find((f) => f.key === key);
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-container/10 border border-primary-container/20 rounded-full text-[11px] text-primary-container"
                >
                  {feat?.label ?? key}
                  <button
                    type="button"
                    onClick={() => toggleFeature(key)}
                    className="hover:text-on-surface"
                  >
                    ×
                  </button>
                </span>
              );
            })}
            {selectedFeatures.length > 3 && (
              <span className="px-2 py-0.5 text-[11px] text-outline">
                +{selectedFeatures.length - 3}
              </span>
            )}
          </div>

          {/* Cutoff slider */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-outline whitespace-nowrap">
              Cut-off{" "}
              <span className="text-on-surface font-semibold">
                {(cutoff * 100).toFixed(0)}%
              </span>
            </label>
            <input
              type="range"
              min={CUTOFF_MIN}
              max={CUTOFF_MAX}
              step={CUTOFF_STEP}
              value={cutoff}
              onChange={(e) => onCutoffChange(Number(e.target.value))}
              className="w-24 accent-primary-container"
            />
          </div>

          {/* Run button */}
          <button
            type="button"
            onClick={onRun}
            disabled={!canRun || loading}
            className={`bg-primary-container text-[#111417] font-semibold px-4 py-1.5 rounded-md text-sm transition-opacity flex items-center gap-1 ${
              !canRun || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">
                  progress_activity
                </span>
                Treinando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">
                  play_arrow
                </span>
                Executar Modelo
              </>
            )}
          </button>

          {/* Stats */}
          {dataStats && (
            <div className="ml-auto flex items-center gap-4">
              <div className="text-center">
                <div className="text-[9px] text-outline uppercase">TREINO</div>
                <div className="text-on-surface text-sm font-semibold">
                  {dataStats.trainingRows.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-outline uppercase">PRODUÇÃO</div>
                <div className="text-on-surface text-sm font-semibold">
                  {dataStats.productionRows.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-outline uppercase">VARIÁVEIS</div>
                <div className="text-on-surface text-sm font-semibold">
                  {selectedFeatures.length}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Warning/status row */}
        <div className="flex items-center gap-4 mt-1">
          <span className={`text-[11px] ${cutoffWarning.color}`}>
            {cutoffWarning.text}
          </span>
          {dataLoading && (
            <span className="text-[11px] text-outline">Carregando dados...</span>
          )}
          {dataError && (
            <span className="text-[11px] text-red-400">{dataError}</span>
          )}
          {selectedFeatures.length === 0 && (
            <span className="text-[11px] text-yellow-400">
              Selecione pelo menos uma variável
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowDescriptions(!showDescriptions)}
            className="text-[11px] text-outline hover:text-primary-container transition-colors ml-auto"
          >
            {showDescriptions ? "Ocultar" : "Ver"} descrição das variáveis
          </button>
        </div>
      </div>

      {/* Expandable feature descriptions */}
      {showDescriptions && (
        <div className="px-4 pb-3 border-t border-outline-variant/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {features.map((f) => (
              <div
                key={f.key}
                className={`text-[11px] p-2 rounded ${
                  selectedFeatures.includes(f.key)
                    ? "bg-primary-container/5 border border-primary-container/10"
                    : "text-outline"
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
        </div>
      )}
    </div>
  );
}
