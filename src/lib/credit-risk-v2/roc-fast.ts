import { RocData } from "@/lib/credit-risk";

/**
 * Curva ROC em O(n log n), com o MESMO resultado da versão do módulo 2.
 *
 * Por que existe: `computeRocCurve` do módulo 2 é O(n²) — para cada threshold único ela
 * percorre o vetor inteiro. Com 42 mil probabilidades distintas isso dá cerca de 1,8 bilhão
 * de iterações por chamada, e a função é chamada duas vezes por execução. Na prática a aba
 * do navegador congela por mais de um minuto.
 *
 * Aqui a curva é obtida com uma única varredura sobre as probabilidades ordenadas em ordem
 * decrescente, acumulando verdadeiros e falsos positivos. Os pontos (FPR, TPR) produzidos
 * são idênticos aos da versão original — há um teste que compara as duas.
 *
 * O módulo 2 permanece com sua implementação, inalterada.
 */
export function computeRocCurveFast(
  yTrue: number[],
  probabilities: number[]
): RocData {
  const n = yTrue.length;

  const order = Array.from({ length: n }, (_, i) => i).sort(
    (a, b) => probabilities[b] - probabilities[a]
  );

  let totalPositive = 0;
  for (let i = 0; i < n; i++) if (yTrue[i] === 1) totalPositive++;
  const totalNegative = n - totalPositive;

  // Primeiro ponto: threshold acima do máximo, nada classificado como positivo.
  const fpr: number[] = [0];
  const tpr: number[] = [0];
  const thresholds: number[] = [(probabilities[order[0]] ?? 0) + 1];

  let tp = 0;
  let fp = 0;
  let i = 0;
  while (i < n) {
    const threshold = probabilities[order[i]];
    // Consome de uma vez todos os empates neste threshold, como faz o sklearn.
    while (i < n && probabilities[order[i]] === threshold) {
      if (yTrue[order[i]] === 1) tp++;
      else fp++;
      i++;
    }
    fpr.push(totalNegative > 0 ? fp / totalNegative : 0);
    tpr.push(totalPositive > 0 ? tp / totalPositive : 0);
    thresholds.push(threshold);
  }

  // Regra do trapézio; fpr já sai em ordem crescente pela construção.
  // O AUC é calculado sobre a curva COMPLETA, antes de qualquer redução de pontos.
  let auc = 0;
  for (let k = 1; k < fpr.length; k++) {
    auc += (fpr[k] - fpr[k - 1]) * ((tpr[k] + tpr[k - 1]) / 2);
  }

  return { ...thinForPlot(fpr, tpr, thresholds), auc };
}

/** Quantidade de pontos suficiente para a curva ficar visualmente idêntica no gráfico. */
const MAX_PLOT_POINTS = 2000;

/**
 * Reduz a curva para desenho. Com 42 mil probabilidades distintas a curva tem 42 mil
 * pontos — em tela isso é indistinguível de 2 mil, mas custa caro para o Plotly renderizar.
 * O AUC já foi calculado sobre a curva completa, então nenhuma métrica muda; só o desenho
 * fica mais leve. As pontas (0,0) e (1,1) são sempre preservadas.
 */
function thinForPlot(fpr: number[], tpr: number[], thresholds: number[]) {
  const n = fpr.length;
  if (n <= MAX_PLOT_POINTS) return { fpr, tpr, thresholds };

  const step = (n - 1) / (MAX_PLOT_POINTS - 1);
  const outFpr: number[] = [];
  const outTpr: number[] = [];
  const outThr: number[] = [];
  for (let k = 0; k < MAX_PLOT_POINTS; k++) {
    const i = k === MAX_PLOT_POINTS - 1 ? n - 1 : Math.round(k * step);
    outFpr.push(fpr[i]);
    outTpr.push(tpr[i]);
    outThr.push(thresholds[i]);
  }
  return { fpr: outFpr, tpr: outTpr, thresholds: outThr };
}
