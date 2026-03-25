import { flatForward } from "../interpolation/flat-forward";

describe("flatForward", () => {
  // Simple test: 2 vertices, interpolate between them
  const x = [100, 500]; // business days
  const y = [0.10, 0.12]; // rates in decimal

  it("returns exact values at vertices", () => {
    const result = flatForward(x, y, [100, 500]);
    expect(result[0]).toBeCloseTo(0.10, 8);
    expect(result[1]).toBeCloseTo(0.12, 8);
  });

  it("interpolates between vertices using compound capitalization", () => {
    const result = flatForward(x, y, [300]);
    // Forward rate: f = ((1+0.12)^(500/252) / (1+0.10)^(100/252))^(252/(500-100)) - 1
    // Intermediate: cap_100 = (1+0.10)^(100/252), cap_300 = cap_100 * (1+f)^((300-100)/252)
    // rate_300 = cap_300^(252/300) - 1
    expect(result[0]).toBeGreaterThan(0.10);
    expect(result[0]).toBeLessThan(0.12);
  });

  it("handles single vertex", () => {
    const result = flatForward([252], [0.11], [252]);
    expect(result[0]).toBeCloseTo(0.11, 8);
  });

  it("extrapolates using last forward rate", () => {
    const result = flatForward(x, y, [600]);
    expect(result[0]).toBeGreaterThan(0.12);
  });
});
