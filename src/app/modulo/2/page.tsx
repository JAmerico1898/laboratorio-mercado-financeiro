"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import OpeningHero from "@/components/modulo2/OpeningHero";
import ControlBar from "@/components/modulo2/ControlBar";
import TabContainer from "@/components/modulo2/TabContainer";
import {
  CreditRecord,
  ModelResults,
  ProductionResults,
  DEFAULT_FEATURES,
  DEFAULT_CUTOFF,
  FEATURES,
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
  computeLinearCombinations,
  computeConfusionMatrix,
  computeClassificationReport,
  interpretCoefficients,
  computeRocCurve,
  RiskBand,
  CutoffComparisonRow,
} from "@/lib/credit-risk";

export default function Module2Page() {
  // Data state
  const [trainingData, setTrainingData] = useState<CreditRecord[] | null>(null);
  const [productionData, setProductionData] = useState<CreditRecord[] | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Control state
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(DEFAULT_FEATURES);
  const [cutoff, setCutoff] = useState(DEFAULT_CUTOFF);

  // Model state
  const [modelResults, setModelResults] = useState<ModelResults | null>(null);
  const [productionResults, setProductionResults] = useState<ProductionResults | null>(null);
  const [modelLoading, setModelLoading] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<"analysis" | "production" | "reference">("analysis");

  // Load data on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setDataLoading(true);
        const [training, production] = await Promise.all([
          loadDataset("training_sample.json"),
          loadDataset("testing_sample.json"),
        ]);
        if (!cancelled) {
          setTrainingData(training);
          setProductionData(production);
          setDataError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setDataError(
            err instanceof Error ? err.message : "Erro ao carregar dados"
          );
        }
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Run model
  const runModel = useCallback(() => {
    if (!trainingData || !productionData || selectedFeatures.length === 0) return;

    setModelLoading(true);

    // Use setTimeout to avoid blocking the UI thread
    setTimeout(() => {
      try {
        // Extract features from training data
        const { X: XAll, y: yAll } = extractFeatures(trainingData, selectedFeatures);

        // Stratified train/test split
        const split = stratifiedTrainTestSplit(XAll, yAll, 0.3, 42);

        // Standardize
        const { transformed: xTrainStd, params: stdParams } = fitTransform(split.xTrain);
        const xTestStd = transform(split.xTest, stdParams);

        // Train model
        const model = trainLogisticRegression(
          xTrainStd,
          split.yTrain,
          selectedFeatures,
          stdParams
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
        const rocData = computeRocCurve(split.yTest, testProbabilities);
        const coefficientInterpretations = interpretCoefficients(
          model.coefficients,
          selectedFeatures
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

        // --- Production scoring ---
        const { X: XProd, y: yProd, ids: prodIds } = extractFeatures(
          productionData,
          selectedFeatures
        );
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
        const prodRocData = computeRocCurve(yProd, prodProbabilities);

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
  }, [trainingData, productionData, selectedFeatures, cutoff]);

  // Data stats for ControlBar
  const dataStats = useMemo(() => {
    if (!trainingData || !productionData) return null;
    return {
      trainingRows: trainingData.length,
      productionRows: productionData.length,
    };
  }, [trainingData, productionData]);

  return (
    <div className="min-h-screen">
      <OpeningHero />

      <div>
        <ControlBar
          features={FEATURES}
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
          selectedFeatures={selectedFeatures}
          trainingData={trainingData}
          productionData={productionData}
        />
      )}
    </div>
  );
}
