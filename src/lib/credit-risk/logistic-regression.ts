import { LogisticRegressionModel, StandardizationParams } from "./types";
import { LR_LEARNING_RATE, LR_MAX_ITERATIONS, LR_TOLERANCE, LR_REGULARIZATION } from "./constants";

/**
 * Sigmoid function with clamping to prevent overflow.
 */
export function sigmoid(z: number): number {
  if (z > 500) return 1;
  if (z < -500) return 0;
  return 1 / (1 + Math.exp(-z));
}

/**
 * Compute dot product of a row and weights, plus bias.
 */
function linearCombination(row: number[], weights: number[], bias: number): number {
  let sum = bias;
  for (let j = 0; j < row.length; j++) {
    sum += row[j] * weights[j];
  }
  return sum;
}

/**
 * Train logistic regression using gradient descent with L2 regularization.
 *
 * @param X - Standardized feature matrix (n x m)
 * @param y - Binary target vector (n)
 * @param featureNames - Names of the features
 * @param standardization - Standardization parameters used on X
 * @param learningRate - Gradient descent step size
 * @param maxIterations - Maximum number of iterations
 * @param tolerance - Convergence threshold on max gradient
 * @param lambda_ - L2 regularization strength (1/C in sklearn terms)
 */
export function trainLogisticRegression(
  X: number[][],
  y: number[],
  featureNames: string[],
  standardization: StandardizationParams,
  learningRate: number = LR_LEARNING_RATE,
  maxIterations: number = LR_MAX_ITERATIONS,
  tolerance: number = LR_TOLERANCE,
  lambda_: number = LR_REGULARIZATION
): LogisticRegressionModel {
  const n = X.length;
  const m = X[0].length;

  // Initialize weights to zeros
  const weights = new Array<number>(m).fill(0);
  let bias = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    // Compute predictions
    const predictions = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      predictions[i] = sigmoid(linearCombination(X[i], weights, bias));
    }

    // Compute gradients
    const gradWeights = new Array<number>(m).fill(0);
    let gradBias = 0;

    for (let i = 0; i < n; i++) {
      const error = predictions[i] - y[i];
      gradBias += error;
      for (let j = 0; j < m; j++) {
        gradWeights[j] += error * X[i][j];
      }
    }

    // Average gradients + L2 regularization on weights (not bias)
    let maxGrad = Math.abs(gradBias / n);
    gradBias /= n;

    for (let j = 0; j < m; j++) {
      gradWeights[j] = gradWeights[j] / n + (lambda_ / n) * weights[j];
      const absGrad = Math.abs(gradWeights[j]);
      if (absGrad > maxGrad) maxGrad = absGrad;
    }

    // Check convergence
    if (maxGrad < tolerance) break;

    // Update weights
    bias -= learningRate * gradBias;
    for (let j = 0; j < m; j++) {
      weights[j] -= learningRate * gradWeights[j];
    }
  }

  return {
    coefficients: weights,
    intercept: bias,
    featureNames,
    standardization,
  };
}

/**
 * Predict probabilities for the positive class (class 1).
 */
export function predictProbability(
  X: number[][],
  model: LogisticRegressionModel
): number[] {
  return X.map((row) =>
    sigmoid(linearCombination(row, model.coefficients, model.intercept))
  );
}

/**
 * Predict binary class labels using a cutoff threshold.
 */
export function predictClass(
  probabilities: number[],
  cutoff: number
): number[] {
  return probabilities.map((p) => (p > cutoff ? 1 : 0));
}

/**
 * Compute accuracy: proportion of correct predictions.
 */
export function accuracy(yTrue: number[], yPred: number[]): number {
  let correct = 0;
  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === yPred[i]) correct++;
  }
  return correct / yTrue.length;
}

/**
 * Compute the linear combination values for visualization (sigmoid chart).
 */
export function computeLinearCombinations(
  X: number[][],
  model: LogisticRegressionModel
): number[] {
  return X.map((row) =>
    linearCombination(row, model.coefficients, model.intercept)
  );
}
