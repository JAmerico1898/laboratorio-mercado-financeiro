"use client";

import { useMemo, useState } from "react";
import {
  ModelResults,
  ProductionResults,
  RISK_BANDS,
} from "@/lib/credit-risk";
import ConfusionMatrixChart from "../ConfusionMatrixChart";
import RocCurveChart from "../RocCurveChart";
import ProbabilityDistribution from "../ProbabilityDistribution";
import RiskBandChart from "../RiskBandChart";

interface ProductionTabProps {
  modelResults: ModelResults;
  productionResults: ProductionResults;
  cutoff: number;
}

/** Return the risk band label for a given probability */
function getRiskBandLabel(prob: number): string {
  for (const band of RISK_BANDS) {
    if (prob >= band.min && prob < band.max) return band.label;
  }
  // Edge case: prob === 1.0 falls into the last band
  return RISK_BANDS[RISK_BANDS.length - 1].label;
}

export default function ProductionTab({
  modelResults,
  productionResults,
  cutoff,
}: ProductionTabProps) {
  const [showAll, setShowAll] = useState(false);

  const { ids, probabilities, predictions, riskBands, cutoffComparison } =
    productionResults;

  // Decision statistics
  const approved = useMemo(
    () => predictions.filter((p) => p === 0).length,
    [predictions]
  );
  const denied = useMemo(
    () => predictions.filter((p) => p === 1).length,
    [predictions]
  );
  const total = predictions.length;
  const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : "0";

  // Table rows
  const tableData = useMemo(
    () =>
      ids.map((id, i) => ({
        id,
        probability: probabilities[i],
        prediction: predictions[i],
        riskBand: getRiskBandLabel(probabilities[i]),
      })),
    [ids, probabilities, predictions]
  );

  const visibleRows = showAll ? tableData : tableData.slice(0, 100);

  return (
    <div className="space-y-8">
      {/* 1. Decision Statistics */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Estatísticas de Decisão
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Operações Aprovadas", value: approved.toLocaleString() },
            { label: "Operações Negadas", value: denied.toLocaleString() },
            { label: "Taxa de Aprovação", value: `${approvalRate}%` },
            {
              label: "Cut-off Aplicado",
              value: `${(cutoff * 100).toFixed(0)}%`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-high rounded-xl p-4 border border-outline-variant/10"
            >
              <p className="text-[11px] text-outline uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-on-surface mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Probability Distribution */}
      <section className="glass-panel rounded-xl border border-outline-variant/10 p-4">
        <ProbabilityDistribution
          probabilities={probabilities}
          cutoff={cutoff}
        />
      </section>

      {/* 3. Risk Band Analysis */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Análise por Faixas de Risco
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: text summary */}
          <div className="space-y-3">
            {riskBands.map((band) => (
              <div
                key={band.label}
                className="bg-surface-container-high rounded-lg p-4 border border-outline-variant/10"
              >
                <p className="text-sm font-medium text-on-surface">
                  {band.label}
                </p>
                <p className="text-outline text-sm mt-1">
                  {band.count.toLocaleString()} operações ({band.percentage.toFixed(1)}%)
                </p>
              </div>
            ))}
          </div>

          {/* Right: pie chart */}
          <div className="glass-panel rounded-xl border border-outline-variant/10 p-4">
            <RiskBandChart bands={riskBands} />
          </div>
        </div>
      </section>

      {/* 4. Results Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-on-surface">
            Tabela de Resultados
          </h3>
          {tableData.length > 100 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-primary-container hover:underline"
            >
              {showAll ? "Mostrar 100" : "Mostrar todos"}
            </button>
          )}
        </div>
        <div className="glass-panel rounded-xl border border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface-container-high">
                <tr className="border-b border-outline-variant/20">
                  <th className="text-left p-3 text-outline font-medium">
                    ID
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    Probabilidade
                  </th>
                  <th className="text-center p-3 text-outline font-medium">
                    Decisão
                  </th>
                  <th className="text-left p-3 text-outline font-medium">
                    Faixa de Risco
                  </th>
                </tr>
              </thead>
              <tbody className="text-on-surface">
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-outline-variant/10"
                  >
                    <td className="p-3 font-mono">{row.id}</td>
                    <td className="p-3 text-right font-mono">
                      {row.probability.toFixed(4)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          row.prediction === 0
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {row.prediction === 0 ? "APROVAR" : "NEGAR"}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{row.riskBand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-outline-variant/20 p-3 text-xs text-outline text-center">
            Exibindo {visibleRows.length} de {tableData.length} operações
          </div>
        </div>
      </section>

      {/* 5. Cutoff Comparison */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Comparação de Cut-offs
        </h3>
        <div className="glass-panel rounded-xl border border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="text-center p-3 text-outline font-medium">
                    Cut-off
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    Acurácia
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    Precisão
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    Recall
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    F1-Score
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    Taxa de Aprovação
                  </th>
                </tr>
              </thead>
              <tbody className="text-on-surface">
                {cutoffComparison.map((row) => {
                  const isActive =
                    Math.abs(row.cutoff - cutoff) < 0.001;
                  return (
                    <tr
                      key={row.cutoff}
                      className={`border-b border-outline-variant/10 ${
                        isActive ? "bg-secondary/10" : ""
                      }`}
                    >
                      <td className="p-3 text-center font-mono">
                        {(row.cutoff * 100).toFixed(0)}%
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.accuracy.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.precision.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.recall.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.f1.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.approvalRate.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Production Confusion Matrix */}
      <section className="glass-panel rounded-xl border border-outline-variant/10 p-4">
        <ConfusionMatrixChart
          tp={productionResults.confusionMatrix.tp}
          tn={productionResults.confusionMatrix.tn}
          fp={productionResults.confusionMatrix.fp}
          fn={productionResults.confusionMatrix.fn}
          title="Matriz de Confusão (Produção)"
        />
      </section>

      {/* 7. Production ROC Curve */}
      <section className="glass-panel rounded-xl border border-outline-variant/10 p-4">
        <RocCurveChart
          fpr={productionResults.rocData.fpr}
          tpr={productionResults.rocData.tpr}
          auc={productionResults.rocData.auc}
          title="Curva ROC (Produção)"
        />
      </section>
    </div>
  );
}
