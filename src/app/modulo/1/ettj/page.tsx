"use client";

import { useState, useMemo } from "react";
import ControlBar from "@/components/modulo1/ControlBar";
import YieldCurveChart from "@/components/modulo1/YieldCurveChart";
import RateQuery from "@/components/modulo1/RateQuery";
import QualityMetricsPanel from "@/components/modulo1/QualityMetrics";
import FittedParams from "@/components/modulo1/FittedParams";
import { applyMethod } from "@/lib/interpolation";
import { computeMetrics } from "@/lib/metrics";
import {
  DI1Contract,
  InterpolationMethod,
  METHOD_LABELS,
} from "@/lib/types";
import { FIVE_YEAR_HORIZON } from "@/lib/constants";

export default function ETTJPage() {
  const [mode, setMode] = useState<"single" | "comparison">("single");
  const [method, setMethod] = useState<InterpolationMethod>("flat-forward");
  const [smoothingFactor, setSmoothingFactor] = useState(50);
  const [dateA, setDateA] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  });
  const [dateB, setDateB] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<DI1Contract[] | null>(null);
  const [actualDate, setActualDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // Filter contracts to 5-year horizon
  const filtered = useMemo(
    () => contracts?.filter((c) => c.bdays <= FIVE_YEAR_HORIZON) ?? [],
    [contracts]
  );

  const xData = useMemo(() => filtered.map((c) => c.bdays), [filtered]);
  const yData = useMemo(() => filtered.map((c) => c.rate), [filtered]);

  // Stats for ControlBar
  const stats = useMemo(() => {
    if (!contracts) return undefined;
    return {
      total: contracts.length,
      filtered: filtered.length,
      maxBdays: contracts.length > 0 ? Math.max(...contracts.map((c) => c.bdays)) : 0,
    };
  }, [contracts, filtered]);

  // Compute interpolation
  const result = useMemo(() => {
    if (xData.length < 2) return null;
    try {
      return applyMethod(method, xData, yData, smoothingFactor);
    } catch {
      return null;
    }
  }, [method, xData, yData, smoothingFactor]);

  // Compute quality metrics
  const metrics = useMemo(() => {
    if (!result || yData.length === 0) return null;
    return computeMetrics(yData, result.yFitted);
  }, [result, yData]);

  const handleLoad = async () => {
    setLoading(true);
    setError(null);
    setWarning(null);

    try {
      const res = await fetch(`/api/di1?date=${dateA}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Erro ao buscar dados" }));
        setError(body.error || `Erro ${res.status}`);
        setContracts(null);
        return;
      }

      const data = await res.json();

      if (!data.contracts || data.contracts.length === 0) {
        setError("Nenhum contrato DI1 encontrado para esta data.");
        setContracts(null);
        return;
      }

      setContracts(data.contracts as DI1Contract[]);
      setActualDate(data.actual_date || dateA);

      if (data.actual_date && data.actual_date !== dateA) {
        setWarning(
          `Data solicitada: ${dateA}. Dados disponíveis para: ${data.actual_date}.`
        );
      }
    } catch {
      setError(
        "Não foi possível conectar ao serviço de dados. Verifique se o microserviço Python está ativo."
      );
      setContracts(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low">
      <ControlBar
        mode={mode}
        method={method}
        smoothingFactor={smoothingFactor}
        dateA={dateA}
        dateB={dateB}
        loading={loading}
        stats={stats}
        onModeChange={setMode}
        onMethodChange={setMethod}
        onSmoothingChange={setSmoothingFactor}
        onDateAChange={setDateA}
        onDateBChange={setDateB}
        onLoad={handleLoad}
      />

      {error && (
        <div className="mx-4 mt-2 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {warning && (
        <div className="mx-4 mt-2 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
          {warning}
        </div>
      )}

      {!contracts && !loading && (
        <div className="flex items-center justify-center h-96 text-outline">
          Selecione uma data e clique em Carregar
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-96">
          <span className="text-primary-container animate-pulse">
            Carregando dados DI1...
          </span>
        </div>
      )}

      {contracts && result && (
        <div className="px-4 py-4 space-y-6">
          <YieldCurveChart
            xObserved={xData}
            yObserved={yData.map((v) => v * 100)}
            xSmooth={result.xSmooth}
            ySmooth={result.ySmooth.map((v) => v * 100)}
            date={actualDate!}
            methodLabel={METHOD_LABELS[method]}
          />
          <RateQuery
            method={method}
            xData={xData}
            yData={yData}
            smoothingFactor={smoothingFactor}
          />
          <QualityMetricsPanel metrics={metrics!} />
          {result.params && (
            <FittedParams params={result.params} method={method} />
          )}
        </div>
      )}
    </div>
  );
}
