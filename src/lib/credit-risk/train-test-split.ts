import { TrainTestSplit } from "./types";

/**
 * Seeded pseudo-random number generator (xorshift128+).
 * Returns values in [0, 1).
 */
class SeededRNG {
  private s0: number;
  private s1: number;

  constructor(seed: number) {
    // Initialize state from seed using splitmix32
    let s = seed | 0;
    s = (s + 0x9e3779b9) | 0;
    let t = s ^ (s >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    this.s0 = (t ^ (t >>> 15)) >>> 0;

    s = (s + 0x9e3779b9) | 0;
    t = s ^ (s >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    this.s1 = (t ^ (t >>> 15)) >>> 0;

    if (this.s0 === 0 && this.s1 === 0) this.s1 = 1;
  }

  next(): number {
    let s0 = this.s0;
    let s1 = this.s1;
    const result = (s0 + s1) >>> 0;
    s1 ^= s0;
    this.s0 = (((s0 << 24) | (s0 >>> 8)) ^ s1 ^ (s1 << 16)) >>> 0;
    this.s1 = ((s1 << 37) | (s1 >>> 27)) >>> 0;
    return result / 0x100000000;
  }
}

/**
 * Fisher-Yates shuffle with seeded RNG.
 */
function shuffleIndices(indices: number[], rng: SeededRNG): number[] {
  const arr = [...indices];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Stratified train/test split preserving class proportions.
 *
 * @param X - Feature matrix (n x m)
 * @param y - Target vector (n)
 * @param testSize - Fraction for test set (0-1)
 * @param seed - Random seed for reproducibility
 */
export function stratifiedTrainTestSplit(
  X: number[][],
  y: number[],
  testSize: number,
  seed: number
): TrainTestSplit {
  const rng = new SeededRNG(seed);

  // Separate indices by class
  const class0Indices: number[] = [];
  const class1Indices: number[] = [];
  for (let i = 0; i < y.length; i++) {
    if (y[i] === 0) class0Indices.push(i);
    else class1Indices.push(i);
  }

  // Shuffle each class independently
  const shuffled0 = shuffleIndices(class0Indices, rng);
  const shuffled1 = shuffleIndices(class1Indices, rng);

  // Split each class
  const testCount0 = Math.round(shuffled0.length * testSize);
  const testCount1 = Math.round(shuffled1.length * testSize);

  const testIndices = [
    ...shuffled0.slice(0, testCount0),
    ...shuffled1.slice(0, testCount1),
  ];
  const trainIndices = [
    ...shuffled0.slice(testCount0),
    ...shuffled1.slice(testCount1),
  ];

  return {
    xTrain: trainIndices.map((i) => X[i]),
    yTrain: trainIndices.map((i) => y[i]),
    xTest: testIndices.map((i) => X[i]),
    yTest: testIndices.map((i) => y[i]),
  };
}
