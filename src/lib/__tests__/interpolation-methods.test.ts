import { linearInterpolation } from "../interpolation/linear";
import { cubicSpline } from "../interpolation/cubic-spline";
import { pchipInterpolation } from "../interpolation/pchip";
import { akimaInterpolation } from "../interpolation/akima";

// Common test data: 5 vertices
const x = [50, 150, 300, 600, 1000];
const y = [0.10, 0.115, 0.125, 0.130, 0.128];
const xQuery = [100, 250, 450, 800];

describe.each([
  ["linear", linearInterpolation],
  ["cubicSpline", cubicSpline],
  ["pchip", pchipInterpolation],
  ["akima", akimaInterpolation],
])("%s interpolation", (_name, fn) => {
  it("returns exact values at vertices", () => {
    const result = fn(x, y, x);
    for (let i = 0; i < x.length; i++) {
      expect(result[i]).toBeCloseTo(y[i], 6);
    }
  });

  it("interpolates between vertices", () => {
    const result = fn(x, y, xQuery);
    result.forEach((v) => {
      expect(v).toBeGreaterThan(0.08);
      expect(v).toBeLessThan(0.15);
    });
  });

  it("returns array of correct length", () => {
    const result = fn(x, y, xQuery);
    expect(result.length).toBe(xQuery.length);
  });
});

describe("pchip monotonicity", () => {
  it("preserves monotonicity in monotone data", () => {
    const xMono = [10, 50, 100, 200, 400];
    const yMono = [0.08, 0.09, 0.10, 0.11, 0.12];
    const xDense = Array.from({ length: 50 }, (_, i) => 10 + i * 8);
    const result = pchipInterpolation(xMono, yMono, xDense);
    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeGreaterThanOrEqual(result[i - 1] - 1e-10);
    }
  });
});
