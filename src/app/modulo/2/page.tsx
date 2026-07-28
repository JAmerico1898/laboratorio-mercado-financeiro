"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import OpeningHero from "@/components/modulo2/OpeningHero";
import ControlBar from "@/components/modulo2/ControlBar";
import TabContainer from "@/components/modulo2/TabContainer";
import {
  CreditRecord,
  ModelResults,
  ProductionResults,
  DEFAULT_CUTOFF,
  CUTOFF_SCENARIOS,
  RISK_BANDS,
  loadDataset,
  extractFeatures,
  fitTransform,
  transform,
  stratifiedTrainTestSplit,
  trainLogisticRegression,
  predictProbability,
  predictClass,
  accuracy,
  computeConfusionMatrix,
  computeClassificationReport,
  RiskBand,
  CutoffComparisonRow,
  // específicos deste módulo
  FEATURES_V2,
  DEFAULT_FEATURES_V2,
  DATASET_TRAINING_V2,
  DATASET_PRODUCTION_V2,
  DATASET_PRODUCTION_TRUE_V2,
  expandColumns,
  interpretCoefficientsV2,
  computeRocCurveFast,
  LR_V2_LEARNING_RATE,
  LR_V2_MAX_ITERATIONS,
  LR_V2_TOLERANCE,
  LR_V2_REGULARIZATION,
} from "@/lib/credit-risk-v2";

export default function Module2Page() {
  // Data state
  const [trainingData, setTrainingData] = useState<CreditRecord[] | null>(null);
  // Produção INPUT: testing_sample_v2 (sem rótulos) — o que o modelo pontua
  const [productionData, setProductionData] = useState<CreditRecord[] | null>(null);
  // Produção GABARITO: testing_sample_true_v2 (com rótulos) — usado para corrigir
  const [productionTrueData, setProductionTrueData] = useState<CreditRecord[] | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Control state — chaves de VARIÁVEIS (não de colunas)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(DEFAULT_FEATURES_V2);
  const [cutoff, setCutoff] = useState(DEFAULT_CUTOFF);

  // Model state
  const [modelResults, setModelResults] = useState<ModelResults | null>(null);
  const [productionResults, setProductionResults] = useState<ProductionResults | null>(null);
  const [modelLoading, setModelLoading] = useState(false);

  // UI state
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "production" | "reference">("analysis");
  const setupRef = useRef<HTMLDivElement>(null);

  // Load data on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setDataLoading(true);
        const [training, production, productionTrue] = await Promise.all([
          loadDataset(DATASET_TRAINING_V2),
          loadDataset(DATASET_PRODUCTION_V2),
          loadDataset(DATASET_PRODUCTION_TRUE_V2),
        ]);
        if (!cancelled) {
          setTrainingData(training);
          setProductionData(production);
          setProductionTrueData(productionTrue);
          setDataError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setDataError(err instanceof Error ? err.message : "Erro ao carregar dados");
        }
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Run model
  const runModel = useCallback(() => {
    if (
      !trainingData ||
      !productionData ||
      !productionTrueData ||
      selectedFeatures.length === 0
    )
      return;

    setModelLoading(true);

    // setTimeout para não travar a thread da interface
    setTimeout(() => {
      try {
        // Uma variável da interface pode virar várias colunas do desenho.
        const selectedColumns = expandColumns(selectedFeatures);

        const { X: XAll, y: yAll } = extractFeatures(trainingData, selectedColumns);

        // Stratified train/test split
        const split = stratifiedTrainTestSplit(XAll, yAll, 0.3, 42);

        // Standardize
        const { transformed: xTrainStd, params: stdParams } = fitTransform(split.xTrain);
        const xTestStd = transform(split.xTest, stdParams);

        // Train model
        // Parâmetros próprios deste módulo — ver o comentário em credit-risk-v2/constants.ts:
        // com o lr do módulo 2 o gradiente não converge e a armadilha de colinearidade
        // não aparece.
        const model = trainLogisticRegression(
          xTrainStd,
          split.yTrain,
          selectedColumns,
          stdParams,
          LR_V2_LEARNING_RATE,
          LR_V2_MAX_ITERATIONS,
          LR_V2_TOLERANCE,
          LR_V2_REGULARIZATION
        );

        // Predictions on test set
        const testProbabilities = predictProbability(xTestStd, model);
        const testPredictions = predictClass(testProbabilities, cutoff);

        // Training predictions for accuracy
        const trainProbabilities = predictProbability(xTrainStd, model);
        const trainPredictions = predictClass(trainProbabilities, cutoff);

        // Metrics
        const trainAccuracy = accuracy(split.yTrain, trainPredictions);
        const testAccuracy = accuracy(split.yTest, testPredictions);
        const confusionMatrix = computeConfusionMatrix(split.yTest, testPredictions);
        const classificationReport = computeClassificationReport(split.yTest, testPredictions);
        const rocData = computeRocCurveFast(split.yTest, testProbabilities);
        const coefficientInterpretations = interpretCoefficientsV2(
          model.coefficients,
          selectedColumns
        );

        const results: ModelResults = {
          model,
          split,
          trainAccuracy,
          testAccuracy,
          testProbabilities,
          testPredictions,
          confusionMatrix,
          classificationReport,
          rocData,
          coefficientInterpretations,
        };

        setModelResults(results);

        // --- Produção ---
        // Pontua o conjunto SEM rótulos: o modelo nunca vê os desfechos.
        const { X: XProd, ids: prodIds } = extractFeatures(productionData, selectedColumns);
        // Os desfechos verdadeiros vêm do gabarito, unidos por id.
        const trueLabelById = new Map<number, number>(
          productionTrueData.map((r) => [r.id, r.loan_status])
        );
        const yProd = prodIds.map((id) => trueLabelById.get(id) ?? 0);
        const xProdStd = transform(XProd, stdParams);
        const prodProbabilities = predictProbability(xProdStd, model);
        const prodPredictions = predictClass(prodProbabilities, cutoff);

        // Risk bands
        const riskBands: RiskBand[] = RISK_BANDS.map((band) => {
          const count = prodProbabilities.filter(
            (p) => p >= band.min && p < (band.max === 1 ? 1.01 : band.max)
          ).length;
          return {
            ...band,
            count,
            percentage: (count / prodProbabilities.length) * 100,
          };
        });

        // Cutoff comparison
        const cutoffComparison: CutoffComparisonRow[] = CUTOFF_SCENARIOS.map(
          (scenarioCutoff) => {
            const preds = predictClass(prodProbabilities, scenarioCutoff);
            const report = computeClassificationReport(yProd, preds);
            const approved = preds.filter((p) => p === 0).length;
            return {
              cutoff: scenarioCutoff,
              accuracy: report.accuracy,
              precision: report.class1.precision,
              recall: report.class1.recall,
              f1: report.class1.f1,
              approvalRate: (approved / preds.length) * 100,
            };
          }
        );

        // Production metrics
        const prodCM = computeConfusionMatrix(yProd, prodPredictions);
        const prodReport = computeClassificationReport(yProd, prodPredictions);
        const prodRocData = computeRocCurveFast(yProd, prodProbabilities);

        setProductionResults({
          ids: prodIds,
          probabilities: prodProbabilities,
          predictions: prodPredictions,
          riskBands,
          confusionMatrix: prodCM,
          classificationReport: prodReport,
          rocData: prodRocData,
          cutoffComparison,
        });
      } catch (err) {
        console.error("Model training error:", err);
      } finally {
        setModelLoading(false);
      }
    }, 50);
  }, [trainingData, productionData, productionTrueData, selectedFeatures, cutoff]);

  const handleStartAnalysis = useCallback(() => {
    setAnalysisStarted(true);
    setTimeout(() => {
      setupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  // Data stats for ControlBar
  const dataStats = useMemo(() => {
    if (!trainingData || !productionData) return null;
    return {
      trainingRows: trainingData.length,
      productionRows: productionData.length,
    };
  }, [trainingData, productionData]);

  // Colunas do desenho para as abas que precisam listar o que entrou no modelo.
  const selectedColumns = useMemo(
    () => expandColumns(selectedFeatures),
    [selectedFeatures]
  );

  return (
    <div className="min-h-screen">
      <OpeningHero onStartAnalysis={handleStartAnalysis} />

      {analysisStarted && (
        <div data-theme="light">
          <div ref={setupRef}>
            <ControlBar
              features={FEATURES_V2}
              selectedFeatures={selectedFeatures}
              onFeaturesChange={setSelectedFeatures}
              cutoff={cutoff}
              onCutoffChange={setCutoff}
              onRun={runModel}
              loading={modelLoading}
              dataLoading={dataLoading}
              dataError={dataError}
              dataStats={dataStats}
            />
          </div>

          {modelResults && productionResults && (
            <TabContainer
              activeTab={activeTab}
              onTabChange={setActiveTab}
              modelResults={modelResults}
              productionResults={productionResults}
              cutoff={cutoff}
              selectedFeatures={selectedColumns}
              trainingData={trainingData}
              productionData={productionTrueData}
            />
          )}
        </div>
      )}
    </div>
  );
}
