import { CoefficientInterpretation } from "@/lib/credit-risk";
import { COLUMN_LABELS } from "./constants";

/**
 * Mesma lógica de interpretCoefficients do módulo 2, mas resolvendo o rótulo por COLUNA em
 * vez de por variável — necessário porque aqui uma variável pode gerar várias colunas
 * (as dummies de moradia, o indicador de ausência do tempo de emprego).
 */
export function interpretCoefficientsV2(
  coefficients: number[],
  columnNames: string[]
): CoefficientInterpretation[] {
  return coefficients.map((coef, i) => {
    const oddsRatio = Math.exp(coef);
    const changePct = Math.abs(oddsRatio - 1) * 100;

    let effect: "increases" | "decreases" | "neutral";
    if (oddsRatio > 1.001) effect = "increases";
    else if (oddsRatio < 0.999) effect = "decreases";
    else effect = "neutral";

    let magnitude: "FORTE" | "MODERADO" | "FRACO" | "MUITO FRACO";
    if (changePct > 50) magnitude = "FORTE";
    else if (changePct > 20) magnitude = "MODERADO";
    else if (changePct > 5) magnitude = "FRACO";
    else magnitude = "MUITO FRACO";

    return {
      feature: columnNames[i],
      label: COLUMN_LABELS[columnNames[i]] ?? columnNames[i],
      coefficient: coef,
      oddsRatio,
      effect,
      magnitude,
      changePct,
    };
  });
}
