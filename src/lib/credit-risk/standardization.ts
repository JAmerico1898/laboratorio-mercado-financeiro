import { StandardizationParams } from "./types";

/**
 * Compute mean and standard deviation for each column.
 * Uses population std (ddof=0) to match sklearn's StandardScaler.
 */
export function fit(data: number[][]): StandardizationParams {
  const n = data.length;
  if (n === 0) return { means: [], stds: [] };

  const m = data[0].length;
  const means = new Array<number>(m).fill(0);
  const stds = new Array<number>(m).fill(0);

  // Compute means
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      means[j] += data[i][j];
    }
  }
  for (let j = 0; j < m; j++) {
    means[j] /= n;
  }

  // Compute standard deviations (population)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const diff = data[i][j] - means[j];
      stds[j] += diff * diff;
    }
  }
  for (let j = 0; j < m; j++) {
    stds[j] = Math.sqrt(stds[j] / n);
    // Avoid division by zero: if std is 0, keep it as 1
    if (stds[j] === 0) stds[j] = 1;
  }

  return { means, stds };
}

/**
 * Apply z-score normalization: (x - mean) / std
 */
export function transform(
  data: number[][],
  params: StandardizationParams
): number[][] {
  return data.map((row) =>
    row.map((val, j) => (val - params.means[j]) / params.stds[j])
  );
}

/**
 * Fit on data and transform in one step.
 */
export function fitTransform(
  data: number[][]
): { transformed: number[][]; params: StandardizationParams } {
  const params = fit(data);
  const transformed = transform(data, params);
  return { transformed, params };
}
