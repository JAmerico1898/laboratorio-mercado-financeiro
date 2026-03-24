"use client";

import { useMemo, useState } from "react";
import {
  ModelResults,
  FEATURES,
  computeLinearCombinations,
  transform,
  predictProbability,
} from "@/lib/credit-risk";
import SigmoidChart from "../SigmoidChart";
import RocCurveChart from "../RocCurveChart";
import ConfusionMatrixChart from "../ConfusionMatrixChart";

interface ModelAnalysisTabProps {
  modelResults: ModelResults;
  cutoff: number;
  selectedFeatures: string[];
}

export default function ModelAnalysisTab({
  modelResults,
  cutoff,
  selectedFeatures,
}: ModelAnalysisTabProps) {
  const [coeffOpen, setCoeffOpen] = useState(false);

  // Compute training linear combinations and probabilities for the sigmoid chart
  const { trainLinearCombinations, trainProbabilities } = useMemo(() => {
    const xTrainStd = transform(
      modelResults.split.xTrain,
      modelResults.model.standardization
    );
    return {
      trainLinearCombinations: computeLinearCombinations(
        xTrainStd,
        modelResults.model
      ),
      trainProbabilities: predictProbability(xTrainStd, modelResults.model),
    };
  }, [modelResults]);

  // Percentage of denied operations
  const deniedPct = useMemo(() => {
    const denied = modelResults.testPredictions.filter((p) => p === 1).length;
    return ((denied / modelResults.testPredictions.length) * 100).toFixed(1);
  }, [modelResults.testPredictions]);

  const { model, classificationReport, coefficientInterpretations } =
    modelResults;

  // Feature label lookup
  const featureLabel = (key: string) =>
    FEATURES.find((f) => f.key === key)?.label ?? key;

  return (
    <div className="space-y-8">
      {/* 1. Sigmoid Chart */}
      <section className="glass-panel rounded-xl border border-outline-variant/10 p-4">
        <SigmoidChart
          linearCombinations={trainLinearCombinations}
          probabilities={trainProbabilities}
          yTrain={modelResults.split.yTrain}
        />
      </section>

      {/* 2. ROC Curve */}
      <section className="glass-panel rounded-xl border border-outline-variant/10 p-4">
        <RocCurveChart
          fpr={modelResults.rocData.fpr}
          tpr={modelResults.rocData.tpr}
          auc={modelResults.rocData.auc}
        />
      </section>

      {/* 3. Confusion Matrix */}
      <section className="glass-panel rounded-xl border border-outline-variant/10 p-4">
        <ConfusionMatrixChart
          tp={modelResults.confusionMatrix.tp}
          tn={modelResults.confusionMatrix.tn}
          fp={modelResults.confusionMatrix.fp}
          fn={modelResults.confusionMatrix.fn}
          title={`Matriz de Confusão (Cut-off: ${(cutoff * 100).toFixed(0)}%)`}
        />
      </section>

      {/* 4. Model Statistics */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Estatísticas do Modelo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              label: "Acurácia no Treinamento",
              value: modelResults.trainAccuracy.toFixed(4),
            },
            {
              label: "Acurácia no Teste",
              value: modelResults.testAccuracy.toFixed(4),
            },
            {
              label: "Observações (Treino)",
              value: modelResults.split.yTrain.length.toLocaleString(),
            },
            {
              label: "Observações (Teste)",
              value: modelResults.split.yTest.length.toLocaleString(),
            },
            {
              label: "Cut-off Utilizado",
              value: `${(cutoff * 100).toFixed(0)}%`,
            },
            {
              label: "% Operações Negadas",
              value: `${deniedPct}%`,
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

      {/* 5. Classification Report */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Relatório de Classificação
        </h3>
        <div className="glass-panel rounded-xl border border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="text-left p-3 text-outline font-medium">
                    Métrica
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    Bons Pagadores (Classe 0)
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    Inadimplentes (Classe 1)
                  </th>
                </tr>
              </thead>
              <tbody className="text-on-surface">
                <tr className="border-b border-outline-variant/10">
                  <td className="p-3">Precisão</td>
                  <td className="p-3 text-right font-mono">
                    {classificationReport.class0.precision.toFixed(4)}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {classificationReport.class1.precision.toFixed(4)}
                  </td>
                </tr>
                <tr className="border-b border-outline-variant/10">
                  <td className="p-3">Recall</td>
                  <td className="p-3 text-right font-mono">
                    {classificationReport.class0.recall.toFixed(4)}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {classificationReport.class1.recall.toFixed(4)}
                  </td>
                </tr>
                <tr className="border-b border-outline-variant/10">
                  <td className="p-3">F1-Score</td>
                  <td className="p-3 text-right font-mono">
                    {classificationReport.class0.f1.toFixed(4)}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {classificationReport.class1.f1.toFixed(4)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Support</td>
                  <td className="p-3 text-right font-mono">
                    {classificationReport.class0.support.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {classificationReport.class1.support.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Overall metrics */}
          <div className="border-t border-outline-variant/20 p-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[11px] text-outline uppercase tracking-wider">
                Acurácia Geral
              </p>
              <p className="text-on-surface font-mono mt-1">
                {classificationReport.accuracy.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-outline uppercase tracking-wider">
                F1-Score Médio (macro)
              </p>
              <p className="text-on-surface font-mono mt-1">
                {classificationReport.macroF1.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-outline uppercase tracking-wider">
                F1-Score Ponderado
              </p>
              <p className="text-on-surface font-mono mt-1">
                {classificationReport.weightedF1.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Regression Equation */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Equação de Regressão
        </h3>
        <div className="glass-panel rounded-xl border border-outline-variant/10 p-6 space-y-6">
          {/* Display equation */}
          <div className="bg-surface-container-high rounded-lg p-4 overflow-x-auto">
            <p className="text-on-surface font-mono text-sm whitespace-nowrap">
              logit(p) = {model.intercept.toFixed(4)}
              {model.coefficients.map((coef, i) => {
                const sign = coef >= 0 ? " + " : " - ";
                return (
                  <span key={model.featureNames[i]}>
                    {sign}
                    {Math.abs(coef).toFixed(4)}&middot;
                    {featureLabel(model.featureNames[i])}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Probability formula */}
          <div className="bg-surface-container-high rounded-lg p-4 text-center">
            <p className="text-on-surface font-mono text-sm">
              P(inadimplência) = 1 / (1 + e<sup>(-z)</sup>)
            </p>
            <p className="text-outline text-xs mt-2">
              onde z = logit(p) é a combinação linear acima
            </p>
          </div>

          {/* Coefficients table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="text-left p-3 text-outline font-medium">
                    Variável
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    Coeficiente
                  </th>
                  <th className="text-right p-3 text-outline font-medium">
                    Exp(Coef)
                  </th>
                </tr>
              </thead>
              <tbody className="text-on-surface">
                <tr className="border-b border-outline-variant/10">
                  <td className="p-3 italic text-outline">Intercepto</td>
                  <td className="p-3 text-right font-mono">
                    {model.intercept.toFixed(4)}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {Math.exp(model.intercept).toFixed(4)}
                  </td>
                </tr>
                {model.coefficients.map((coef, i) => (
                  <tr
                    key={model.featureNames[i]}
                    className="border-b border-outline-variant/10"
                  >
                    <td className="p-3">
                      {featureLabel(model.featureNames[i])}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {coef.toFixed(4)}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {Math.exp(coef).toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Coefficient Interpretation */}
      <section>
        <h3 className="text-lg font-semibold text-on-surface mb-4">
          Interpretação dos Coeficientes
        </h3>
        <div className="glass-panel rounded-xl border border-outline-variant/10">
          <button
            type="button"
            onClick={() => setCoeffOpen(!coeffOpen)}
            className="w-full flex items-center justify-between p-4 text-on-surface hover:bg-surface-container-high/50 transition-colors rounded-xl"
          >
            <span className="font-medium">
              {coeffOpen ? "Ocultar detalhes" : "Mostrar interpretação detalhada"}
            </span>
            <span className="material-symbols-outlined text-outline">
              {coeffOpen ? "expand_less" : "expand_more"}
            </span>
          </button>

          {coeffOpen && (
            <div className="px-4 pb-4 space-y-3">
              {coefficientInterpretations.map((interp) => {
                const directionIcon =
                  interp.effect === "increases"
                    ? "\u{1F4C8}"
                    : interp.effect === "decreases"
                    ? "\u{1F4C9}"
                    : "\u27A1\uFE0F";

                const magnitudeColor =
                  interp.magnitude === "FORTE"
                    ? "bg-red-500/20 text-red-400"
                    : interp.magnitude === "MODERADO"
                    ? "bg-orange-500/20 text-orange-400"
                    : interp.magnitude === "FRACO"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-400";

                const effectText =
                  interp.effect === "increases"
                    ? "aumentam"
                    : interp.effect === "decreases"
                    ? "diminuem"
                    : "permanecem estáveis";

                return (
                  <div
                    key={interp.feature}
                    className="bg-surface-container-high rounded-lg p-4 border border-outline-variant/10"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{directionIcon}</span>
                      <span className="font-medium text-on-surface">
                        {interp.label}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${magnitudeColor}`}
                      >
                        {interp.magnitude}
                      </span>
                    </div>
                    <p className="text-sm text-outline">
                      Para cada unidade de aumento em{" "}
                      <span className="text-on-surface font-medium">
                        {interp.label}
                      </span>
                      , as chances de inadimplência {effectText} em{" "}
                      <span className="text-on-surface font-mono">
                        {interp.changePct.toFixed(1)}%
                      </span>
                      .
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
