/**
 * Barrel do scorecard do módulo 2.
 *
 * Toda a matemática (regressão logística, padronização, split, ROC, matriz de confusão) é
 * REAPROVEITADA do módulo 2 sem nenhuma alteração — o modelo novo não muda o algoritmo, muda
 * as variáveis e os dados. Só o que é específico deste scorecard mora aqui.
 */
export * from "@/lib/credit-risk";

export * from "./types";
export { interpretCoefficientsV2 } from "./interpret";
export { computeRocCurveFast } from "./roc-fast";
export {
  FEATURES_V2,
  DEFAULT_FEATURES_V2,
  DATASET_TRAINING_V2,
  DATASET_PRODUCTION_V2,
  DATASET_PRODUCTION_TRUE_V2,
  TIER_INFO,
  LR_V2_LEARNING_RATE,
  LR_V2_MAX_ITERATIONS,
  LR_V2_TOLERANCE,
  LR_V2_REGULARIZATION,
  COLUMN_LABELS,
  PYTHON_REFERENCE,
  expandColumns,
} from "./constants";
