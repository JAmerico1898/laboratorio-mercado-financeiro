import { nelsonSiegel, fitNelsonSiegel } from "../interpolation/nelson-siegel";
import {
  nelsonSiegelSvensson,
  fitNelsonSiegelSvensson,
} from "../interpolation/nelson-siegel-svensson";
import { smoothingSpline } from "../interpolation/smoothing-spline";

describe("Nelson-Siegel model", () => {
  it("evaluates correctly with known parameters", () => {
    const params = { beta0: 0.12, beta1: -0.02, beta2: -0.01, lambda: 500 };
    const result = nelsonSiegel(params, [252]);
    expect(result[0]).toBeGreaterThan(0.09);
    expect(result[0]).toBeLessThan(0.13);
  });

  it("β0 is the long-term rate (tau → ∞)", () => {
    const params = { beta0: 0.12, beta1: -0.02, beta2: -0.01, lambda: 500 };
    const result = nelsonSiegel(params, [100000]);
    expect(result[0]).toBeCloseTo(0.12, 2);
  });

  it("fits a smooth curve to data", () => {
    const x = [50, 100, 200, 400, 600, 800, 1000, 1200];
    const y = [0.10, 0.105, 0.112, 0.122, 0.128, 0.131, 0.133, 0.134];
    const { fitted, params } = fitNelsonSiegel(x, y);
    expect(params).toBeDefined();
    fitted.forEach((v, i) => {
      expect(Math.abs(v - y[i])).toBeLessThan(0.03);
    });
  });
});

describe("Nelson-Siegel-Svensson model", () => {
  it("evaluates with known parameters", () => {
    const params = {
      beta0: 0.12, beta1: -0.02, beta2: -0.01,
      beta3: 0.005, lambda1: 500, lambda2: 1000,
    };
    const result = nelsonSiegelSvensson(params, [252]);
    expect(result[0]).toBeGreaterThan(0.09);
    expect(result[0]).toBeLessThan(0.14);
  });
});

describe("Smoothing spline", () => {
  it("interpolates exactly when s=0", () => {
    const x = [50, 150, 300, 600, 1000];
    const y = [0.10, 0.115, 0.125, 0.130, 0.128];
    const result = smoothingSpline(x, y, x, 0);
    for (let i = 0; i < x.length; i++) {
      expect(result[i]).toBeCloseTo(y[i], 4);
    }
  });

  it("smooths data when s > 0", () => {
    const x = [50, 150, 300, 600, 1000];
    const y = [0.10, 0.115, 0.125, 0.130, 0.128];
    const result = smoothingSpline(x, y, x, 50);
    result.forEach((v) => {
      expect(v).toBeGreaterThan(0.08);
      expect(v).toBeLessThan(0.15);
    });
  });
});
