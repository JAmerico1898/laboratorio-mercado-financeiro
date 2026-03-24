import { stratifiedTrainTestSplit } from "../credit-risk/train-test-split";

describe("stratifiedTrainTestSplit", () => {
  // Create a small dataset: 10 samples, 70% class 0, 30% class 1
  const X = [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
    [9, 10],
    [11, 12],
    [13, 14],
    [15, 16],
    [17, 18],
    [19, 20],
  ];
  const y = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1]; // 7 class 0, 3 class 1

  it("produces correct train/test sizes for 30% test", () => {
    const split = stratifiedTrainTestSplit(X, y, 0.3, 42);
    const totalTrain = split.xTrain.length;
    const totalTest = split.xTest.length;
    expect(totalTrain + totalTest).toBe(10);
    // 30% of 7 ≈ 2 class0 test, 30% of 3 ≈ 1 class1 test → 3 test, 7 train
    expect(totalTest).toBe(3);
    expect(totalTrain).toBe(7);
  });

  it("preserves stratification (class proportions)", () => {
    const split = stratifiedTrainTestSplit(X, y, 0.3, 42);

    const trainClass1 = split.yTrain.filter((v) => v === 1).length;
    const testClass1 = split.yTest.filter((v) => v === 1).length;

    // Original proportion: 3/10 = 30%
    // Train should have ~30% class 1, test should have ~30% class 1
    const trainProp = trainClass1 / split.yTrain.length;
    const testProp = testClass1 / split.yTest.length;

    // With small data, exact proportions won't match, but both sets should have class 1
    expect(trainClass1).toBeGreaterThan(0);
    expect(testClass1).toBeGreaterThan(0);
    // Proportions should be within reasonable range of original
    expect(trainProp).toBeGreaterThan(0.1);
    expect(trainProp).toBeLessThan(0.6);
    expect(testProp).toBeGreaterThan(0.1);
    expect(testProp).toBeLessThan(0.6);
  });

  it("is deterministic with the same seed", () => {
    const split1 = stratifiedTrainTestSplit(X, y, 0.3, 42);
    const split2 = stratifiedTrainTestSplit(X, y, 0.3, 42);
    expect(split1.xTrain).toEqual(split2.xTrain);
    expect(split1.yTrain).toEqual(split2.yTrain);
    expect(split1.xTest).toEqual(split2.xTest);
    expect(split1.yTest).toEqual(split2.yTest);
  });

  it("produces different results with different seeds", () => {
    const split1 = stratifiedTrainTestSplit(X, y, 0.3, 42);
    const split2 = stratifiedTrainTestSplit(X, y, 0.3, 123);
    // Very unlikely to be identical with different seeds
    const same = JSON.stringify(split1.xTrain) === JSON.stringify(split2.xTrain);
    expect(same).toBe(false);
  });

  it("handles larger dataset with correct proportions", () => {
    // 100 samples: 80 class 0, 20 class 1
    const bigX = Array.from({ length: 100 }, (_, i) => [i, i * 2]);
    const bigY = Array.from({ length: 100 }, (_, i) => (i < 80 ? 0 : 1));
    const split = stratifiedTrainTestSplit(bigX, bigY, 0.3, 42);

    expect(split.xTrain.length + split.xTest.length).toBe(100);

    // Test set should be ~30 items
    expect(split.xTest.length).toBe(30); // 24 from class0 + 6 from class1

    // Check stratification: ~20% class 1 in both sets
    const trainProp =
      split.yTrain.filter((v) => v === 1).length / split.yTrain.length;
    const testProp =
      split.yTest.filter((v) => v === 1).length / split.yTest.length;
    expect(trainProp).toBeCloseTo(0.2, 1);
    expect(testProp).toBeCloseTo(0.2, 1);
  });

  it("preserves all original data (no duplication or loss)", () => {
    const split = stratifiedTrainTestSplit(X, y, 0.3, 42);
    const allX = [...split.xTrain, ...split.xTest];
    const allY = [...split.yTrain, ...split.yTest];

    // Sort by first element to compare
    const sortedOriginal = [...X].sort((a, b) => a[0] - b[0]);
    const sortedResult = allX.sort((a, b) => a[0] - b[0]);
    expect(sortedResult).toEqual(sortedOriginal);
    expect(allY.sort()).toEqual([...y].sort());
  });
});
