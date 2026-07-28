import { FeatureDefinition } from "@/lib/credit-risk";

/** Camada da variável, atribuída por ablação medida (ver TRIALS.md, T29). */
export type FeatureTier = "CORE" | "MARGINAL" | "NOISE";

/**
 * Extensão do FeatureDefinition do módulo 2.
 *
 * `columns` existe porque uma variável da interface pode gerar várias colunas na matriz de
 * desenho — categóricas viram dummies e variáveis com ausência carregam o indicador junto.
 * O módulo 2 não é alterado: lá `FeatureDefinition` continua valendo como está.
 */
export interface FeatureDefinitionV2 extends FeatureDefinition {
  columns: string[];
  tier: FeatureTier;
}
