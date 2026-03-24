import {
  sigmoid,
  trainLogisticRegression,
  predictProbability,
  predictClass,
  accuracy,
} from "../credit-risk/logistic-regression";

describe("sigmoid", () => {
  it("returns 0.5 for input 0", () => {
    expect(sigmoid(0)).toBe(0.5);
  });

  it("returns ~1 for large positive input", () => {
    expect(sigmoid(10)).toBeCloseTo(1, 4);
  });

  it("returns ~0 for large negative input", () => {
    expect(sigmoid(-10)).toBeCloseTo(0, 4);
  });

  it("handles extreme values without overflow", () => {
    expect(sigmoid(1000)).toBe(1);
    expect(sigmoid(-1000)).toBe(0);
  });

  it("is monotonically increasing", () => {
    const values = [-5, -2, -1, 0, 1, 2, 5];
    const results = values.map(sigmoid);
    for (let i = 1; i < results.length; i++) {
      expect(results[i]).toBeGreaterThan(results[i - 1]);
    }
  });
});

describe("trainLogisticRegression", () => {
  it("converges on linearly separable data", () => {
    // Simple 1D separable: class 0 has low values, class 1 has high values
    const X = [
      [-3], [-2], [-1], [-0.5],
      [0.5], [1], [2], [3],
    ];
    const y = [0, 0, 0, 0, 1, 1, 1, 1];

    const model = trainLogisticRegression(
      X, y, ["x"],
      { means: [0], stds: [1] },
      0.1, 2000, 1e-6, 0.01
    );

    // Coefficient should be positive (higher x → higher probability of class 1)
    expect(model.coefficients[0]).toBeGreaterThan(0);

    // Should predict correctly
    const probs = predictProbability(X, model);
    const preds = predictClass(probs, 0.5);
    expect(accuracy(y, preds)).toBeGreaterThanOrEqual(0.875);
  });

  it("handles 2D data", () => {
    // class 0: low x1, low x2; class 1: high x1, high x2
    const X = [
      [-2, -2], [-1, -1], [-1.5, -0.5], [-0.5, -1.5],
      [2, 2], [1, 1], [1.5, 0.5], [0.5, 1.5],
    ];
    const y = [0, 0, 0, 0, 1, 1, 1, 1];

    const model = trainLogisticRegression(
      X, y, ["x1", "x2"],
      { means: [0, 0], stds: [1, 1] },
      0.1, 2000, 1e-6, 0.01
    );

    expect(model.coefficients.length).toBe(2);
    expect(model.featureNames).toEqual(["x1", "x2"]);

    const probs = predictProbability(X, model);
    const preds = predictClass(probs, 0.5);
    expect(accuracy(y, preds)).toBe(1);
  });

  it("L2 regularization shrinks coefficients", () => {
    const X = [[-2], [-1], [1], [2]];
    const y = [0, 0, 1, 1];
    const params = { means: [0], stds: [1] };

    const modelLow = trainLogisticRegression(
      X, y, ["x"], params, 0.1, 2000, 1e-6, 0.01
    );
    const modelHigh = trainLogisticRegression(
      X, y, ["x"], params, 0.1, 2000, 1e-6, 10.0
    );

    // Higher regularization → smaller coefficient magnitude
    expect(Math.abs(modelHigh.coefficients[0])).toBeLessThan(
      Math.abs(modelLow.coefficients[0])
    );
  });
});

describe("predictProbability", () => {
  it("returns values between 0 and 1", () => {
    const model = {
      coefficients: [1],
      intercept: 0,
      featureNames: ["x"],
      standardization: { means: [0], stds: [1] },
    };
    const probs = predictProbability([[-10], [0], [10]], model);
    probs.forEach((p) => {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    });
  });
});

describe("predictClass", () => {
  it("applies cutoff correctly", () => {
    const probs = [0.1, 0.3, 0.5, 0.7, 0.9];
    expect(predictClass(probs, 0.5)).toEqual([0, 0, 0, 1, 1]);
    expect(predictClass(probs, 0.3)).toEqual([0, 0, 1, 1, 1]);
    expect(predictClass(probs, 0.7)).toEqual([0, 0, 0, 0, 1]);
  });

  it("cutoff of 0 predicts all as class 1 (except exact 0)", () => {
    expect(predictClass([0, 0.1, 0.5, 1], 0)).toEqual([0, 1, 1, 1]);
  });
});

describe("accuracy", () => {
  it("returns 1 for perfect predictions", () => {
    expect(accuracy([0, 1, 0, 1], [0, 1, 0, 1])).toBe(1);
  });

  it("returns 0 for completely wrong predictions", () => {
    expect(accuracy([0, 0, 1, 1], [1, 1, 0, 0])).toBe(0);
  });

  it("returns 0.5 for half correct", () => {
    expect(accuracy([0, 0, 1, 1], [0, 1, 0, 1])).toBe(0.5);
  });
});
