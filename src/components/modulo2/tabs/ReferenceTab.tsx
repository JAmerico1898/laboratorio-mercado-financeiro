"use client";

import { useMemo } from "react";
import { CreditRecord, ModelResults, FEATURES } from "@/lib/credit-risk";

interface ReferenceTabProps {
  modelResults: ModelResults;
  selectedFeatures: string[];
  trainingData: CreditRecord[] | null;
  productionData: CreditRecord[] | null;
}

/** Compute descriptive statistics for a numeric array */
function describeColumn(values: number[]) {
  if (values.length === 0) {
    return { count: 0, mean: 0, std: 0, min: 0, q25: 0, q50: 0, q75: 0, max: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);

  const percentile = (p: number) => {
    const idx = (p / 100) * (n - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  };

  return {
    count: n,
    mean,
    std,
    min: sorted[0],
    q25: percentile(25),
    q50: percentile(50),
    q75: percentile(75),
    max: sorted[n - 1],
  };
}

export default function ReferenceTab({
  modelResults,
  selectedFeatures,
  trainingData,
  productionData,
}: ReferenceTabProps) {
  const featureLabel = (key: string) =>
    FEATURES.find((f) => f.key === key)?.label ?? key;

  // Display columns: id + selected features + loan_status
  const displayCols = useMemo(
    () => ["id", ...selectedFeatures, "loan_status"],
    [selectedFeatures]
  );

  // Descriptive statistics for training data
  const descriptiveStats = useMemo(() => {
    if (!trainingData || trainingData.length === 0) return null;
    return selectedFeatures.map((feat) => ({
      feature: feat,
      label: featureLabel(feat),
      stats: describeColumn(trainingData.map((r) => r[feat] as number)),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingData, selectedFeatures]);

  const renderDataPreview = (
    title: string,
    data: CreditRecord[] | null,
    icon: string
  ) => {
    if (!data) {
      return (
        <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
          <h4 className="text-md font-semibold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">{icon}</span>
            {title}
          </h4>
          <p className="text-outline text-sm">Dados não carregados.</p>
        </div>
      );
    }

    const rows = data.slice(0, 5);
    const cols = data.length > 0 ? Object.keys(data[0]).length : 0;

    return (
      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
        <h4 className="text-md font-semibold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-outline">{icon}</span>
          {title}
        </h4>
        <p className="text-outline text-sm mb-4">
          Dimensão: {data.length.toLocaleString()} linhas x {cols} colunas
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20">
                {displayCols.map((col) => (
                  <th
                    key={col}
                    className="text-left p-2 text-outline font-medium whitespace-nowrap"
                  >
                    {col === "id"
                      ? "ID"
                      : col === "loan_status"
                      ? "Status"
                      : featureLabel(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-on-surface">
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-outline-variant/10">
                  {displayCols.map((col) => (
                    <td key={col} className="p-2 font-mono text-xs whitespace-nowrap">
                      {typeof row[col] === "number"
                        ? Number.isInteger(row[col])
                          ? row[col]
                          : (row[col] as number).toFixed(4)
                        : String(row[col] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. Data Preview */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Pré-visualização dos Dados
        </h3>
        <div className="space-y-6">
          {renderDataPreview("Dados de Treinamento", trainingData, "model_training")}
          {renderDataPreview("Dados de Produção", productionData, "precision_manufacturing")}
        </div>
      </section>

      {/* 2. Descriptive Statistics */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Estatísticas Descritivas (Treinamento)
        </h3>
        {descriptiveStats ? (
          <div className="glass-panel rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left p-3 text-outline font-medium">
                      Variável
                    </th>
                    <th className="text-right p-3 text-outline font-medium">
                      Count
                    </th>
                    <th className="text-right p-3 text-outline font-medium">
                      Mean
                    </th>
                    <th className="text-right p-3 text-outline font-medium">
                      Std
                    </th>
                    <th className="text-right p-3 text-outline font-medium">
                      Min
                    </th>
                    <th className="text-right p-3 text-outline font-medium">
                      25%
                    </th>
                    <th className="text-right p-3 text-outline font-medium">
                      50%
                    </th>
                    <th className="text-right p-3 text-outline font-medium">
                      75%
                    </th>
                    <th className="text-right p-3 text-outline font-medium">
                      Max
                    </th>
                  </tr>
                </thead>
                <tbody className="text-on-surface">
                  {descriptiveStats.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-outline-variant/10"
                    >
                      <td className="p-3">{row.label}</td>
                      <td className="p-3 text-right font-mono">
                        {row.stats.count.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.stats.mean.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.stats.std.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.stats.min.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.stats.q25.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.stats.q50.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.stats.q75.toFixed(4)}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {row.stats.max.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
            <p className="text-outline text-sm">
              Dados de treinamento não disponíveis.
            </p>
          </div>
        )}
      </section>

      {/* 3. Module Info */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Informações do Módulo
        </h3>
        <div className="space-y-6">
          {/* Objetivo */}
          <div className="glass-panel rounded-xl border border-outline-variant/10 p-6">
            <h4 className="text-md font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">
                target
              </span>
              Objetivo
            </h4>
            <p className="text-outline text-sm leading-relaxed">
              Este sistema foi desenvolvido para ensinar como funciona a
              modelagem de risco de crédito utilizando regressão logística. O
              módulo permite que o aluno selecione variáveis preditoras,
              treine um modelo de classificação binária e avalie os
              resultados em dados de produção, simulando o fluxo completo de
              uma esteira de crédito.
            </p>
          </div>

          {/* Funcionalidades */}
          <div className="glass-panel rounded-xl border border-outline-variant/10 p-6">
            <h4 className="text-md font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">
                checklist
              </span>
              Funcionalidades
            </h4>
            <ul className="text-outline text-sm space-y-2 list-disc list-inside">
              <li>
                Seleção interativa de variáveis preditoras para o modelo de
                regressão logística
              </li>
              <li>
                Treinamento do modelo com divisão estratificada
                treino/teste e padronização Z-score
              </li>
              <li>
                Visualização da curva sigmóide e distribuição de
                probabilidades preditas
              </li>
              <li>
                Avaliação do desempenho via matriz de confusão, curva ROC e
                métricas de classificação
              </li>
              <li>
                Aplicação do modelo treinado em dados de produção com
                ajuste dinâmico do cut-off de decisão
              </li>
              <li>
                Interpretação automática dos coeficientes do modelo e
                análise por faixas de risco
              </li>
            </ul>
          </div>

          {/* Tecnologias Utilizadas */}
          <div className="glass-panel rounded-xl border border-outline-variant/10 p-6">
            <h4 className="text-md font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">
                code
              </span>
              Tecnologias Utilizadas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: "TypeScript",
                  desc: "Toda a lógica de regressão logística, padronização e métricas implementada nativamente",
                },
                {
                  name: "React / Next.js",
                  desc: "Interface interativa com componentes reutilizáveis e renderização otimizada",
                },
                {
                  name: "Plotly.js",
                  desc: "Gráficos interativos: curva sigmóide, ROC, matriz de confusão e distribuições",
                },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="bg-surface-container-high rounded-lg p-4 border border-outline-variant/10"
                >
                  <p className="text-on-surface font-medium text-sm">
                    {tech.name}
                  </p>
                  <p className="text-outline text-xs mt-1">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interpretação dos Resultados */}
          <div className="glass-panel rounded-xl border border-outline-variant/10 p-6">
            <h4 className="text-md font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">
                analytics
              </span>
              Interpretação dos Resultados
            </h4>
            <p className="text-outline text-sm mb-4">
              A área sob a curva ROC (AUC) é uma métrica fundamental para
              avaliar a capacidade discriminatória do modelo:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  range: "> 0.8",
                  label: "Excelente",
                  color: "bg-green-500/20 text-green-400 border-green-500/30",
                },
                {
                  range: "0.7 - 0.8",
                  label: "Bom",
                  color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                },
                {
                  range: "0.6 - 0.7",
                  label: "Razoável",
                  color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                },
                {
                  range: "< 0.6",
                  label: "Fraco",
                  color: "bg-red-500/20 text-red-400 border-red-500/30",
                },
              ].map((tier) => (
                <div
                  key={tier.label}
                  className={`rounded-lg p-3 border text-center ${tier.color}`}
                >
                  <p className="text-lg font-bold">{tier.range}</p>
                  <p className="text-xs font-medium mt-1">{tier.label}</p>
                </div>
              ))}
            </div>
            {modelResults.rocData.auc > 0 && (
              <p className="text-outline text-sm mt-4">
                AUC do modelo atual:{" "}
                <span className="text-on-surface font-mono font-bold">
                  {modelResults.rocData.auc.toFixed(4)}
                </span>{" "}
                —{" "}
                {modelResults.rocData.auc > 0.8
                  ? "Excelente poder discriminatório"
                  : modelResults.rocData.auc > 0.7
                  ? "Bom poder discriminatório"
                  : modelResults.rocData.auc > 0.6
                  ? "Poder discriminatório razoável"
                  : "Poder discriminatório fraco"}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
