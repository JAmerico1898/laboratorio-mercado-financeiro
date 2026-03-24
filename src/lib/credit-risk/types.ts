/** A single row from the credit dataset */
export interface CreditRecord {
  id: number;
  loan_status: number; // 0 = good payer, 1 = delinquent
  [feature: string]: number;
}

/** Feature metadata for the UI */
export interface FeatureDefinition {
  key: string;
  label: string; // Portuguese display name
  description: string; // Portuguese description
  defaultSelected: boolean;
}

/** Z-score standardization parameters */
export interface StandardizationParams {
  means: number[];
  stds: number[];
}

/** Trained logistic regression model */
export interface LogisticRegressionModel {
  coefficients: number[];
  intercept: number;
  featureNames: string[];
  standardization: StandardizationParams;
}

/** Train/test split result */
export interface TrainTestSplit {
  xTrain: number[][];
  yTrain: number[];
  xTest: number[][];
  yTest: number[];
}

/** Confusion matrix values */
export interface ConfusionMatrix {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
}

/** Per-class classification metrics */
export interface ClassMetrics {
  precision: number;
  recall: number;
  f1: number;
  support: number;
}

/** Full classification report */
export interface ClassificationReport {
  class0: ClassMetrics;
  class1: ClassMetrics;
  accuracy: number;
  macroF1: number;
  weightedF1: number;
}

/** ROC curve data */
export interface RocData {
  fpr: number[];
  tpr: number[];
  thresholds: number[];
  auc: number;
}

/** Risk probability band */
export interface RiskBand {
  label: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

/** Per-variable coefficient interpretation */
export interface CoefficientInterpretation {
  feature: string;
  label: string;
  coefficient: number;
  oddsRatio: number;
  effect: "increases" | "decreases" | "neutral";
  magnitude: "FORTE" | "MODERADO" | "FRACO" | "MUITO FRACO";
  changePct: number;
}

/** Full model training results */
export interface ModelResults {
  model: LogisticRegressionModel;
  split: TrainTestSplit;
  trainAccuracy: number;
  testAccuracy: number;
  testProbabilities: number[];
  testPredictions: number[];
  confusionMatrix: ConfusionMatrix;
  classificationReport: ClassificationReport;
  rocData: RocData;
  coefficientInterpretations: CoefficientInterpretation[];
}

/** Cutoff comparison row */
export interface CutoffComparisonRow {
  cutoff: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  approvalRate: number;
}

/** Production scoring results */
export interface ProductionResults {
  ids: number[];
  probabilities: number[];
  predictions: number[];
  riskBands: RiskBand[];
  confusionMatrix: ConfusionMatrix;
  classificationReport: ClassificationReport;
  rocData: RocData;
  cutoffComparison: CutoffComparisonRow[];
}
