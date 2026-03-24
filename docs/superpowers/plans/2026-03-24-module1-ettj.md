# Module 1: ETTJ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the ETTJ (yield curve modeling) module — opening page + interactive tool with 8 interpolation methods, live B3 data, and Plotly charts.

**Architecture:** Python microservice (FastAPI + pyield) fetches DI1 data from B3. Next.js API route proxies requests. TypeScript math engine runs 8 interpolation methods client-side. Plotly.js renders charts. Two pages: opening page at `/modulo/1` and interactive tool at `/modulo/1/ettj`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Plotly.js, ml-levenberg-marquardt, FastAPI, pyield

**Spec:** `docs/superpowers/specs/2026-03-24-module1-ettj-design.md`

---

## File Structure

```
src/
├── app/
│   ├── api/di1/route.ts                # Next.js API proxy to Python microservice
│   ├── api/bdays/route.ts              # Business days proxy
│   └── modulo/1/
│       ├── page.tsx                     # Opening page (hero + cards)
│       └── ettj/
│           └── page.tsx                 # Interactive tool (control bar + charts)
├── components/modulo1/
│   ├── OpeningHero.tsx                  # Hero section with badge, headline, CTAs
│   ├── KineticVisual.tsx                # Glass-panel bar chart decoration
│   ├── CurvePreview.tsx                 # SVG spot curve preview card
│   ├── MethodologyCards.tsx             # Three info cards (methodology, feed, engine)
│   ├── ControlBar.tsx                   # Top control bar (mode, method, dates)
│   ├── YieldCurveChart.tsx              # Plotly single curve chart
│   ├── ComparisonChart.tsx              # Plotly dual curve + difference subplot
│   ├── RateQuery.tsx                    # Two-column rate lookup
│   ├── QualityMetrics.tsx               # RMSE, MAE, R², MaxErr cards
│   ├── FittedParams.tsx                 # NS/NSS parameter display
│   ├── DataTable.tsx                    # DI1 contract data table
│   ├── ResidualsTab.tsx                 # Residuals scatter + stats
│   ├── MethodEquation.tsx               # LaTeX equation expander
│   ├── DownloadTab.tsx                  # CSV download buttons
│   ├── ComparisonStats.tsx              # 4 comparison metric cards
│   └── KeyMaturitiesTable.tsx           # Key maturities comparison table
├── lib/
│   ├── types.ts                         # DI1Contract, InterpolationResult, QualityMetrics
│   ├── constants.ts                     # Business day basis, key maturities, thresholds
│   ├── interpolation/
│   │   ├── index.ts                     # applyMethod dispatcher
│   │   ├── flat-forward.ts              # Market standard method
│   │   ├── linear.ts                    # Linear interpolation
│   │   ├── cubic-spline.ts              # Cubic spline (tridiagonal solver)
│   │   ├── pchip.ts                     # PCHIP monotonic
│   │   ├── akima.ts                     # Akima spline
│   │   ├── smoothing-spline.ts          # Smoothing spline with s parameter
│   │   ├── nelson-siegel.ts             # NS 4-param model
│   │   └── nelson-siegel-svensson.ts    # NSS 6-param model
│   ├── optimization.ts                  # Levenberg-Marquardt wrapper
│   └── metrics.ts                       # Quality metrics (RMSE, MAE, R², MaxErr)
api/
├── main.py                              # FastAPI + pyield service
└── requirements.txt                     # Python dependencies
```

---

## Task 1: Project Setup — Install Dependencies & Configure Testing

**Files:**
- Modify: `package.json`
- Create: `jest.config.ts`
- Create: `src/lib/types.ts`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Install npm dependencies**

Run:
```bash
cd C:/jose_americo/laboratorio-mercado-financeiro
npm install plotly.js-dist-min react-plotly.js ml-levenberg-marquardt
npm install --save-dev jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Create Jest config**

Create `jest.config.ts`:
```typescript
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
```

- [ ] **Step 3: Add test script to package.json**

In `package.json` scripts, add: `"test": "jest"` and `"test:watch": "jest --watch"`

- [ ] **Step 4: Create types file**

Create `src/lib/types.ts`:
```typescript
export interface DI1Contract {
  ticker: string;
  expiration: string; // ISO date string YYYY-MM-DD
  bdays: number;      // business days to expiration
  rate: number;        // decimal form (e.g., 0.1050 = 10.50%)
}

export interface InterpolationResult {
  xSmooth: number[];   // business days (500 points)
  ySmooth: number[];   // decimal form (e.g., 0.1050)
  yFitted: number[];   // interpolated at observed points, decimal form
  params?: Record<string, number>; // NS/NSS fitted parameters
}

export interface QualityMetrics {
  rmse: number;
  mae: number;
  r2: number;
  maxError: number;
}

export type InterpolationMethod =
  | "flat-forward"
  | "nelson-siegel-svensson"
  | "nelson-siegel"
  | "smoothing-spline"
  | "akima"
  | "pchip"
  | "cubic-spline"
  | "linear";

export const METHOD_LABELS: Record<InterpolationMethod, string> = {
  "flat-forward": "Flat Forward",
  "nelson-siegel-svensson": "Nelson-Siegel-Svensson",
  "nelson-siegel": "Nelson-Siegel",
  "smoothing-spline": "Smoothing Spline",
  "akima": "Akima Spline",
  "pchip": "PCHIP (Monotônica)",
  "cubic-spline": "Cubic Spline",
  "linear": "Interpolação Linear",
};

export const METHOD_ORDER: InterpolationMethod[] = [
  "flat-forward",
  "nelson-siegel-svensson",
  "nelson-siegel",
  "smoothing-spline",
  "akima",
  "pchip",
  "cubic-spline",
  "linear",
];
```

- [ ] **Step 5: Create constants file**

Create `src/lib/constants.ts`:
```typescript
export const BUSINESS_DAYS_PER_YEAR = 252;
export const FIVE_YEAR_HORIZON = 1260; // 252 * 5
export const SMOOTH_POINTS = 500;
export const DEFAULT_SMOOTHING_FACTOR = 50;
export const SMOOTHING_MIN = 0;
export const SMOOTHING_MAX = 200;
export const SMOOTHING_STEP = 10;

export const KEY_MATURITIES: Record<number, string> = {
  21: "1M",
  63: "3M",
  126: "6M",
  252: "1A",
  504: "2A",
  756: "3A",
  1008: "4A",
  1260: "5A",
};

export const QUALITY_THRESHOLD_BPS = 10; // 0.10%
export const QUALITY_THRESHOLD_R2 = 0.99;
```

- [ ] **Step 6: Verify setup**

Run: `npx jest --passWithNoTests`
Expected: Jest runs, 0 tests, passes.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json jest.config.ts src/lib/types.ts src/lib/constants.ts
git commit -m "feat(module1): add dependencies, types, constants, and jest config"
```

---

## Task 2: Quality Metrics Library

**Files:**
- Create: `src/lib/metrics.ts`
- Create: `src/lib/__tests__/metrics.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/__tests__/metrics.test.ts`:
```typescript
import { computeMetrics } from "../metrics";

describe("computeMetrics", () => {
  const observed = [0.10, 0.12, 0.14, 0.11, 0.13];
  const fitted   = [0.101, 0.119, 0.141, 0.109, 0.131];

  it("computes RMSE correctly", () => {
    const m = computeMetrics(observed, fitted);
    expect(m.rmse).toBeCloseTo(0.001095, 5);
  });

  it("computes MAE correctly", () => {
    const m = computeMetrics(observed, fitted);
    expect(m.mae).toBeCloseTo(0.001, 5);
  });

  it("computes R² close to 1 for good fit", () => {
    const m = computeMetrics(observed, fitted);
    expect(m.r2).toBeGreaterThan(0.99);
  });

  it("computes max error correctly", () => {
    const m = computeMetrics(observed, fitted);
    expect(m.maxError).toBeCloseTo(0.001, 5);
  });

  it("returns R²=1 for perfect fit", () => {
    const m = computeMetrics(observed, observed);
    expect(m.r2).toBe(1);
    expect(m.rmse).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/__tests__/metrics.test.ts`
Expected: FAIL — `Cannot find module '../metrics'`

- [ ] **Step 3: Implement metrics**

Create `src/lib/metrics.ts`:
```typescript
import { QualityMetrics } from "./types";

export function computeMetrics(
  observed: number[],
  fitted: number[]
): QualityMetrics {
  const n = observed.length;
  const mean = observed.reduce((a, b) => a + b, 0) / n;

  let sse = 0;
  let sae = 0;
  let sst = 0;
  let maxErr = 0;

  for (let i = 0; i < n; i++) {
    const residual = observed[i] - fitted[i];
    sse += residual * residual;
    sae += Math.abs(residual);
    sst += (observed[i] - mean) ** 2;
    maxErr = Math.max(maxErr, Math.abs(residual));
  }

  return {
    rmse: Math.sqrt(sse / n),
    mae: sae / n,
    r2: sst === 0 ? 1 : 1 - sse / sst,
    maxError: maxErr,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/__tests__/metrics.test.ts`
Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/metrics.ts src/lib/__tests__/metrics.test.ts
git commit -m "feat(module1): add quality metrics (RMSE, MAE, R², MaxError)"
```

---

## Task 3: Interpolation — Flat Forward

**Files:**
- Create: `src/lib/interpolation/flat-forward.ts`
- Create: `src/lib/__tests__/flat-forward.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/flat-forward.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/__tests__/flat-forward.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement flat forward interpolation**

Create `src/lib/interpolation/flat-forward.ts`:
```typescript
import { BUSINESS_DAYS_PER_YEAR } from "../constants";

/**
 * Flat Forward interpolation — Brazilian market standard.
 * Assumes constant forward rate between adjacent vertices.
 * Uses 252 business day compound capitalization convention.
 */
export function flatForward(
  x: number[], // business days (sorted)
  y: number[], // spot rates (decimal)
  xNew: number[] // target business days
): number[] {
  const n = x.length;
  if (n === 0) return [];
  if (n === 1) return xNew.map(() => y[0]);

  // Pre-compute capitalization factors: cap_i = (1 + r_i)^(d_i / 252)
  const cap = x.map((d, i) => Math.pow(1 + y[i], d / BUSINESS_DAYS_PER_YEAR));

  // Compute forward rates between each pair of vertices
  const forwardRates: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dDiff = x[i + 1] - x[i];
    forwardRates.push(
      Math.pow(cap[i + 1] / cap[i], BUSINESS_DAYS_PER_YEAR / dDiff) - 1
    );
  }

  return xNew.map((d) => {
    // Find the segment
    let segIdx = 0;
    for (let i = 0; i < n - 1; i++) {
      if (d > x[i]) segIdx = i;
    }

    // If before first vertex, use first forward rate
    if (d <= x[0]) {
      const capD = Math.pow(1 + forwardRates[0], d / BUSINESS_DAYS_PER_YEAR);
      return Math.pow(capD, BUSINESS_DAYS_PER_YEAR / d) - 1;
    }

    // If beyond last vertex, extrapolate with last forward rate
    if (d >= x[n - 1]) {
      const lastFwd = forwardRates[n - 2];
      const capD =
        cap[n - 1] *
        Math.pow(1 + lastFwd, (d - x[n - 1]) / BUSINESS_DAYS_PER_YEAR);
      return Math.pow(capD, BUSINESS_DAYS_PER_YEAR / d) - 1;
    }

    // Interpolate within segment
    const fwd = forwardRates[segIdx];
    const capD =
      cap[segIdx] *
      Math.pow(1 + fwd, (d - x[segIdx]) / BUSINESS_DAYS_PER_YEAR);
    return Math.pow(capD, BUSINESS_DAYS_PER_YEAR / d) - 1;
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/__tests__/flat-forward.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/interpolation/flat-forward.ts src/lib/__tests__/flat-forward.test.ts
git commit -m "feat(module1): add Flat Forward interpolation method"
```

---

## Task 4: Interpolation — Linear, Cubic Spline, PCHIP, Akima

**Files:**
- Create: `src/lib/interpolation/linear.ts`
- Create: `src/lib/interpolation/cubic-spline.ts`
- Create: `src/lib/interpolation/pchip.ts`
- Create: `src/lib/interpolation/akima.ts`
- Create: `src/lib/__tests__/interpolation-methods.test.ts`

- [ ] **Step 1: Write failing tests for all 4 methods**

Create `src/lib/__tests__/interpolation-methods.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/__tests__/interpolation-methods.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement linear interpolation**

Create `src/lib/interpolation/linear.ts`:
```typescript
export function linearInterpolation(
  x: number[],
  y: number[],
  xNew: number[]
): number[] {
  const n = x.length;
  return xNew.map((xq) => {
    if (xq <= x[0]) return y[0];
    if (xq >= x[n - 1]) return y[n - 1];

    let i = 0;
    while (i < n - 1 && x[i + 1] < xq) i++;

    const t = (xq - x[i]) / (x[i + 1] - x[i]);
    return y[i] + t * (y[i + 1] - y[i]);
  });
}
```

- [ ] **Step 4: Implement cubic spline (natural boundary, tridiagonal solver)**

Create `src/lib/interpolation/cubic-spline.ts`:
```typescript
/**
 * Natural cubic spline interpolation.
 * Solves a tridiagonal system for second derivatives (natural BCs: S''(x0)=0, S''(xn)=0).
 */
export function cubicSpline(
  x: number[],
  y: number[],
  xNew: number[]
): number[] {
  const n = x.length;
  if (n < 2) return xNew.map(() => y[0] ?? 0);

  // Step 1: compute h_i and alpha_i
  const h: number[] = [];
  const alpha: number[] = [0];
  for (let i = 0; i < n - 1; i++) {
    h.push(x[i + 1] - x[i]);
  }
  for (let i = 1; i < n - 1; i++) {
    alpha.push(
      (3 / h[i]) * (y[i + 1] - y[i]) - (3 / h[i - 1]) * (y[i] - y[i - 1])
    );
  }

  // Step 2: solve tridiagonal for c (second derivatives / 2)
  const c = new Array(n).fill(0);
  const l = new Array(n).fill(1);
  const mu = new Array(n).fill(0);
  const z = new Array(n).fill(0);

  for (let i = 1; i < n - 1; i++) {
    l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }

  // Back substitution
  for (let j = n - 2; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
  }

  // Step 3: compute b, d coefficients
  const b: number[] = [];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    b.push(
      (y[i + 1] - y[i]) / h[i] - (h[i] * (c[i + 1] + 2 * c[i])) / 3
    );
    d.push((c[i + 1] - c[i]) / (3 * h[i]));
  }

  // Step 4: evaluate
  return xNew.map((xq) => {
    let i = 0;
    if (xq <= x[0]) i = 0;
    else if (xq >= x[n - 1]) i = n - 2;
    else {
      while (i < n - 2 && x[i + 1] < xq) i++;
    }

    const dx = xq - x[i];
    return y[i] + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx;
  });
}
```

- [ ] **Step 5: Implement PCHIP interpolation**

Create `src/lib/interpolation/pchip.ts`:
```typescript
/**
 * PCHIP — Piecewise Cubic Hermite Interpolating Polynomial.
 * Preserves monotonicity: no overshoots or spurious oscillations.
 */
export function pchipInterpolation(
  x: number[],
  y: number[],
  xNew: number[]
): number[] {
  const n = x.length;
  if (n < 2) return xNew.map(() => y[0] ?? 0);

  // Compute slopes between adjacent points
  const delta: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    delta.push((y[i + 1] - y[i]) / (x[i + 1] - x[i]));
  }

  // Compute derivatives at each point
  const d: number[] = new Array(n);
  d[0] = delta[0];
  d[n - 1] = delta[n - 2];

  for (let i = 1; i < n - 1; i++) {
    if (delta[i - 1] * delta[i] <= 0) {
      d[i] = 0;
    } else {
      // Weighted harmonic mean
      const w1 = 2 * (x[i + 1] - x[i]) + (x[i] - x[i - 1]);
      const w2 = (x[i + 1] - x[i]) + 2 * (x[i] - x[i - 1]);
      d[i] = (w1 + w2) / (w1 / delta[i - 1] + w2 / delta[i]);
    }
  }

  // Evaluate using Hermite basis functions
  return xNew.map((xq) => {
    let i = 0;
    if (xq <= x[0]) return y[0];
    if (xq >= x[n - 1]) return y[n - 1];

    while (i < n - 2 && x[i + 1] < xq) i++;

    const h = x[i + 1] - x[i];
    const t = (xq - x[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;

    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;

    return h00 * y[i] + h10 * h * d[i] + h01 * y[i + 1] + h11 * h * d[i + 1];
  });
}
```

- [ ] **Step 6: Implement Akima interpolation**

Create `src/lib/interpolation/akima.ts`:
```typescript
/**
 * Akima spline interpolation.
 * Less sensitive to outliers than cubic spline.
 * Uses weighted derivative calculation.
 */
export function akimaInterpolation(
  x: number[],
  y: number[],
  xNew: number[]
): number[] {
  const n = x.length;
  if (n < 2) return xNew.map(() => y[0] ?? 0);
  if (n < 3) {
    // Fall back to linear for 2 points
    return xNew.map((xq) => {
      const t = (xq - x[0]) / (x[1] - x[0]);
      return y[0] + t * (y[1] - y[0]);
    });
  }

  // Compute slopes
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    m.push((y[i + 1] - y[i]) / (x[i + 1] - x[i]));
  }

  // Extend slopes at boundaries (2 extra on each side)
  const slopes: number[] = [];
  slopes.push(2 * m[0] - (m.length > 1 ? m[1] : m[0]));
  slopes.push(2 * m[0] - slopes[0]);
  for (const s of m) slopes.push(s);
  slopes.push(2 * m[n - 2] - (n > 2 ? m[n - 3] : m[n - 2]));
  slopes.push(2 * slopes[slopes.length - 1] - m[n - 2]);

  // Compute Akima derivatives
  const d: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const idx = i + 2; // offset due to extension
    const w1 = Math.abs(slopes[idx + 1] - slopes[idx]);
    const w2 = Math.abs(slopes[idx - 1] - slopes[idx - 2]);
    if (w1 + w2 === 0) {
      d[i] = (slopes[idx - 1] + slopes[idx]) / 2;
    } else {
      d[i] = (w1 * slopes[idx - 1] + w2 * slopes[idx]) / (w1 + w2);
    }
  }

  // Evaluate using Hermite basis
  return xNew.map((xq) => {
    if (xq <= x[0]) return y[0];
    if (xq >= x[n - 1]) return y[n - 1];

    let i = 0;
    while (i < n - 2 && x[i + 1] < xq) i++;

    const h = x[i + 1] - x[i];
    const t = (xq - x[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;

    return (
      (2 * t3 - 3 * t2 + 1) * y[i] +
      (t3 - 2 * t2 + t) * h * d[i] +
      (-2 * t3 + 3 * t2) * y[i + 1] +
      (t3 - t2) * h * d[i + 1]
    );
  });
}
```

- [ ] **Step 7: Run all interpolation tests**

Run: `npx jest src/lib/__tests__/interpolation-methods.test.ts`
Expected: All tests PASS (4 methods × 3 tests + 1 monotonicity test)

- [ ] **Step 8: Commit**

```bash
git add src/lib/interpolation/linear.ts src/lib/interpolation/cubic-spline.ts src/lib/interpolation/pchip.ts src/lib/interpolation/akima.ts src/lib/__tests__/interpolation-methods.test.ts
git commit -m "feat(module1): add Linear, Cubic Spline, PCHIP, Akima interpolation"
```

---

## Task 5: Interpolation — Smoothing Spline, Nelson-Siegel, NSS + Dispatcher

**Files:**
- Create: `src/lib/interpolation/smoothing-spline.ts`
- Create: `src/lib/interpolation/nelson-siegel.ts`
- Create: `src/lib/interpolation/nelson-siegel-svensson.ts`
- Create: `src/lib/optimization.ts`
- Create: `src/lib/interpolation/index.ts`
- Create: `src/lib/__tests__/parametric-models.test.ts`

- [ ] **Step 1: Write failing tests for NS and NSS**

Create `src/lib/__tests__/parametric-models.test.ts`:
```typescript
import { nelsonSiegel, fitNelsonSiegel } from "../interpolation/nelson-siegel";
import {
  nelsonSiegelSvensson,
  fitNelsonSiegelSvensson,
} from "../interpolation/nelson-siegel-svensson";
import { smoothingSpline } from "../interpolation/smoothing-spline";

describe("Nelson-Siegel model", () => {
  it("evaluates correctly with known parameters", () => {
    // β0=0.12, β1=-0.02, β2=-0.01, λ=500
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
    // Check fitted values are reasonable
    fitted.forEach((v, i) => {
      expect(Math.abs(v - y[i])).toBeLessThan(0.01);
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
    // Values should be close but not exact
    result.forEach((v) => {
      expect(v).toBeGreaterThan(0.08);
      expect(v).toBeLessThan(0.15);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/__tests__/parametric-models.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement optimization wrapper**

Create `src/lib/optimization.ts`:
```typescript
import levenbergMarquardt from "ml-levenberg-marquardt";

export interface FitResult {
  params: number[];
  residuals: number[];
  converged: boolean;
}

/**
 * Fit a parametric model to data using Levenberg-Marquardt.
 * @param modelFn - function(params) => (x) => y
 * @param x - independent variable values
 * @param y - observed values
 * @param initialParams - starting parameter values
 * @param options - bounds, maxIterations
 */
export function fitModel(
  modelFn: (params: number[]) => (x: number) => number,
  x: number[],
  y: number[],
  initialParams: number[],
  options?: {
    minValues?: number[];
    maxValues?: number[];
    maxIterations?: number;
  }
): FitResult {
  try {
    const data = { x, y };

    const parameterizedFn =
      (p: number[]) =>
      (xi: number): number =>
        modelFn(p)(xi);

    const result = levenbergMarquardt(data, parameterizedFn, {
      initialValues: initialParams,
      minValues: options?.minValues,
      maxValues: options?.maxValues,
      maxIterations: options?.maxIterations ?? 1000,
      damping: 0.001,
      gradientDifference: 1e-6,
    });

    const fitted = x.map((xi) => parameterizedFn(result.parameterValues)(xi));
    const residuals = y.map((yi, i) => yi - fitted[i]);

    return {
      params: Array.from(result.parameterValues),
      residuals,
      converged: true,
    };
  } catch {
    return {
      params: initialParams,
      residuals: y.map(() => 0),
      converged: false,
    };
  }
}
```

- [ ] **Step 4: Implement Nelson-Siegel**

Create `src/lib/interpolation/nelson-siegel.ts`:
```typescript
import { fitModel } from "../optimization";

export interface NSParams {
  beta0: number;
  beta1: number;
  beta2: number;
  lambda: number;
}

export function nelsonSiegel(params: NSParams, tau: number[]): number[] {
  const { beta0, beta1, beta2, lambda } = params;
  return tau.map((t) => {
    const ratio = t / lambda;
    const expTerm = Math.exp(-ratio);
    const factor1 = ratio === 0 ? 1 : (1 - expTerm) / ratio;
    const factor2 = factor1 - expTerm;
    return beta0 + beta1 * factor1 + beta2 * factor2;
  });
}

export function fitNelsonSiegel(
  x: number[],
  y: number[]
): { fitted: number[]; params: NSParams } {
  const yMean = y.reduce((a, b) => a + b, 0) / y.length;
  const yMin = Math.min(...y);
  const yMax = Math.max(...y);

  const modelFn = (p: number[]) => (xi: number) => {
    const ratio = xi / p[3];
    const expTerm = Math.exp(-ratio);
    const f1 = ratio === 0 ? 1 : (1 - expTerm) / ratio;
    return p[0] + p[1] * f1 + p[2] * (f1 - expTerm);
  };

  const result = fitModel(modelFn, x, y, [yMean, -0.02, -0.02, 500], {
    minValues: [yMin - 0.05, -0.1, -0.1, 1],
    maxValues: [yMax + 0.05, 0.1, 0.1, 2000],
  });

  const params: NSParams = {
    beta0: result.params[0],
    beta1: result.params[1],
    beta2: result.params[2],
    lambda: result.params[3],
  };

  return { fitted: nelsonSiegel(params, x), params };
}
```

- [ ] **Step 5: Implement Nelson-Siegel-Svensson**

Create `src/lib/interpolation/nelson-siegel-svensson.ts`:
```typescript
import { fitModel } from "../optimization";

export interface NSSParams {
  beta0: number;
  beta1: number;
  beta2: number;
  beta3: number;
  lambda1: number;
  lambda2: number;
}

export function nelsonSiegelSvensson(
  params: NSSParams,
  tau: number[]
): number[] {
  const { beta0, beta1, beta2, beta3, lambda1, lambda2 } = params;
  return tau.map((t) => {
    const r1 = t / lambda1;
    const r2 = t / lambda2;
    const e1 = Math.exp(-r1);
    const e2 = Math.exp(-r2);
    const f1 = r1 === 0 ? 1 : (1 - e1) / r1;
    const f2 = r2 === 0 ? 1 : (1 - e2) / r2;
    return beta0 + beta1 * f1 + beta2 * (f1 - e1) + beta3 * (f2 - e2);
  });
}

export function fitNelsonSiegelSvensson(
  x: number[],
  y: number[]
): { fitted: number[]; params: NSSParams } {
  const yMean = y.reduce((a, b) => a + b, 0) / y.length;
  const yMin = Math.min(...y);
  const yMax = Math.max(...y);

  const modelFn = (p: number[]) => (xi: number) => {
    const r1 = xi / p[4];
    const r2 = xi / p[5];
    const e1 = Math.exp(-r1);
    const e2 = Math.exp(-r2);
    const f1 = r1 === 0 ? 1 : (1 - e1) / r1;
    const f2 = r2 === 0 ? 1 : (1 - e2) / r2;
    return p[0] + p[1] * f1 + p[2] * (f1 - e1) + p[3] * (f2 - e2);
  };

  const result = fitModel(
    modelFn,
    x,
    y,
    [yMean, -0.02, -0.02, 0.01, 500, 1000],
    {
      minValues: [yMin - 0.05, -0.1, -0.1, -0.1, 1, 1],
      maxValues: [yMax + 0.05, 0.1, 0.1, 0.1, 2000, 3000],
    }
  );

  const params: NSSParams = {
    beta0: result.params[0],
    beta1: result.params[1],
    beta2: result.params[2],
    beta3: result.params[3],
    lambda1: result.params[4],
    lambda2: result.params[5],
  };

  return { fitted: nelsonSiegelSvensson(params, x), params };
}
```

- [ ] **Step 6: Implement smoothing spline**

Create `src/lib/interpolation/smoothing-spline.ts`:
```typescript
import { cubicSpline } from "./cubic-spline";

/**
 * Smoothing spline approximation.
 * Uses iterative smoothing: when s=0, exact interpolation (delegates to cubic spline).
 * When s>0, applies weighted averaging to reduce noise before cubic spline fitting.
 *
 * This is a simplified approximation of scipy's UnivariateSpline behavior.
 * The `s` parameter controls the sum-of-squared-residuals budget.
 */
export function smoothingSpline(
  x: number[],
  y: number[],
  xNew: number[],
  s: number = 0
): number[] {
  if (s === 0) {
    return cubicSpline(x, y, xNew);
  }

  const n = x.length;
  // Apply iterative smoothing based on s parameter
  // Higher s → more smoothing iterations and wider kernel
  const iterations = Math.max(1, Math.round(s / 20));
  const smoothed = [...y];

  for (let iter = 0; iter < iterations; iter++) {
    const prev = [...smoothed];
    for (let i = 1; i < n - 1; i++) {
      // Weighted average with neighbors, respecting x-spacing
      const wl = 1 / (x[i] - x[i - 1]);
      const wr = 1 / (x[i + 1] - x[i]);
      const wc = (wl + wr) * 2; // center weight
      smoothed[i] = (wl * prev[i - 1] + wc * prev[i] + wr * prev[i + 1]) / (wl + wc + wr);
    }
  }

  return cubicSpline(x, smoothed, xNew);
}
```

- [ ] **Step 7: Create interpolation dispatcher**

Create `src/lib/interpolation/index.ts`:
```typescript
import { InterpolationMethod, InterpolationResult } from "../types";
import { SMOOTH_POINTS } from "../constants";
import { flatForward } from "./flat-forward";
import { linearInterpolation } from "./linear";
import { cubicSpline } from "./cubic-spline";
import { pchipInterpolation } from "./pchip";
import { akimaInterpolation } from "./akima";
import { smoothingSpline } from "./smoothing-spline";
import { fitNelsonSiegel, nelsonSiegel } from "./nelson-siegel";
import {
  fitNelsonSiegelSvensson,
  nelsonSiegelSvensson,
} from "./nelson-siegel-svensson";

export function applyMethod(
  method: InterpolationMethod,
  xData: number[],
  yData: number[],
  smoothingFactor?: number
): InterpolationResult {
  const xMin = Math.min(...xData);
  const xMax = Math.max(...xData);
  const xSmooth = Array.from(
    { length: SMOOTH_POINTS },
    (_, i) => xMin + (i * (xMax - xMin)) / (SMOOTH_POINTS - 1)
  );

  let ySmooth: number[];
  let yFitted: number[];
  let params: Record<string, number> | undefined;

  switch (method) {
    case "flat-forward":
      ySmooth = flatForward(xData, yData, xSmooth);
      yFitted = flatForward(xData, yData, xData);
      break;
    case "linear":
      ySmooth = linearInterpolation(xData, yData, xSmooth);
      yFitted = linearInterpolation(xData, yData, xData);
      break;
    case "cubic-spline":
      ySmooth = cubicSpline(xData, yData, xSmooth);
      yFitted = cubicSpline(xData, yData, xData);
      break;
    case "pchip":
      ySmooth = pchipInterpolation(xData, yData, xSmooth);
      yFitted = pchipInterpolation(xData, yData, xData);
      break;
    case "akima":
      ySmooth = akimaInterpolation(xData, yData, xSmooth);
      yFitted = akimaInterpolation(xData, yData, xData);
      break;
    case "smoothing-spline":
      ySmooth = smoothingSpline(xData, yData, xSmooth, smoothingFactor);
      yFitted = smoothingSpline(xData, yData, xData, smoothingFactor);
      break;
    case "nelson-siegel": {
      const ns = fitNelsonSiegel(xData, yData);
      ySmooth = nelsonSiegel(ns.params, xSmooth);
      yFitted = ns.fitted;
      params = ns.params as unknown as Record<string, number>;
      break;
    }
    case "nelson-siegel-svensson": {
      const nss = fitNelsonSiegelSvensson(xData, yData);
      ySmooth = nelsonSiegelSvensson(nss.params, xSmooth);
      yFitted = nss.fitted;
      params = nss.params as unknown as Record<string, number>;
      break;
    }
  }

  return { xSmooth, ySmooth, yFitted, params };
}
```

- [ ] **Step 8: Run all tests**

Run: `npx jest`
Expected: All tests PASS

- [ ] **Step 9: Commit**

```bash
git add src/lib/interpolation/ src/lib/optimization.ts src/lib/__tests__/parametric-models.test.ts
git commit -m "feat(module1): add Smoothing Spline, Nelson-Siegel, NSS, and method dispatcher"
```

---

## Task 6: Python Microservice (FastAPI + pyield)

**Files:**
- Create: `api/main.py`
- Create: `api/requirements.txt`

- [ ] **Step 1: Create requirements.txt**

Create `api/requirements.txt`:
```
fastapi==0.115.0
uvicorn==0.30.0
pyield==1.1.0
pandas==2.2.0
```

- [ ] **Step 2: Create FastAPI service**

Create `api/main.py`:
```python
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import pyield as yd
import pandas as pd

app = FastAPI(title="DI1 Data Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/di1")
def get_di1(date: str = Query(..., description="Reference date YYYY-MM-DD")):
    """Fetch DI1 futures data from B3 via pyield."""
    ref_date = datetime.strptime(date, "%Y-%m-%d").date()
    data = None
    actual_date = ref_date

    for attempt in range(10):
        try:
            check_date = ref_date - timedelta(days=attempt)
            df = yd.futures(contract_code="DI1", reference_date=check_date)
            if df is not None and len(df) > 0:
                data = df
                actual_date = check_date
                break
        except Exception:
            continue

    if data is None:
        return {"error": "No data available", "contracts": [], "actual_date": None}

    # Convert to pandas if polars
    if not isinstance(data, pd.DataFrame):
        data = data.to_pandas()

    contracts = []
    for _, row in data.iterrows():
        contracts.append({
            "ticker": str(row["TickerSymbol"]),
            "expiration": str(row["ExpirationDate"]),
            "bdays": int(row["BDaysToExp"]),
            "rate": float(row["SettlementRate"]),
        })

    return {
        "contracts": contracts,
        "actual_date": str(actual_date),
        "requested_date": date,
    }


@app.get("/bdays")
def count_bdays(
    start: str = Query(..., description="Start date YYYY-MM-DD"),
    end: str = Query(..., description="End date YYYY-MM-DD"),
):
    """Count business days between two dates using Brazilian calendar."""
    start_date = datetime.strptime(start, "%Y-%m-%d").date()
    end_date = datetime.strptime(end, "%Y-%m-%d").date()
    count = yd.count_bdays(start_date, end_date)
    return {"start": start, "end": end, "bdays": int(count)}
```

- [ ] **Step 3: Test the microservice locally**

Run:
```bash
cd C:/jose_americo/laboratorio-mercado-financeiro/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Then in another terminal:
```bash
curl http://localhost:8000/di1?date=2026-03-24
```
Expected: JSON with `contracts` array containing DI1 contract objects.

- [ ] **Step 4: Commit**

```bash
git add api/main.py api/requirements.txt
git commit -m "feat(module1): add Python microservice for DI1 data (FastAPI + pyield)"
```

---

## Task 7: Next.js API Routes (Proxy)

**Files:**
- Create: `src/app/api/di1/route.ts`
- Create: `src/app/api/bdays/route.ts`

- [ ] **Step 1: Create DI1 API proxy route**

Create `src/app/api/di1/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

// Simple in-memory cache with 1-hour TTL
const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date parameter required" }, { status: 400 });
  }

  // Check cache
  const cacheKey = `di1:${date}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(`${PYTHON_API_URL}/di1?date=${date}`);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch DI1 data" },
        { status: res.status }
      );
    }
    const data = await res.json();

    // Cache successful responses
    if (data.contracts?.length > 0) {
      cache.set(cacheKey, { data, expires: Date.now() + CACHE_TTL });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Python microservice unavailable" },
      { status: 503 }
    );
  }
}
```

- [ ] **Step 2: Create business days API proxy route**

Create `src/app/api/bdays/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const start = request.nextUrl.searchParams.get("start");
  const end = request.nextUrl.searchParams.get("end");
  if (!start || !end) {
    return NextResponse.json(
      { error: "start and end parameters required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${PYTHON_API_URL}/bdays?start=${start}&end=${end}`
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to count business days" },
        { status: res.status }
      );
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Python microservice unavailable" },
      { status: 503 }
    );
  }
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: Build succeeds without errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/di1/route.ts src/app/api/bdays/route.ts
git commit -m "feat(module1): add Next.js API proxy routes for DI1 and bdays"
```

---

## Task 8: Opening Page (`/modulo/1`)

**Files:**
- Create: `src/app/modulo/1/page.tsx`
- Create: `src/components/modulo1/OpeningHero.tsx`
- Create: `src/components/modulo1/KineticVisual.tsx`
- Create: `src/components/modulo1/CurvePreview.tsx`
- Create: `src/components/modulo1/MethodologyCards.tsx`
- Modify: `src/app/modulo/[id]/page.tsx` (redirect module 1 to its dedicated page)

Reference: `landing&opening_pages/modulo1_opening_page.html`

- [ ] **Step 1: Create KineticVisual component**

Create `src/components/modulo1/KineticVisual.tsx` — the glass-panel bar chart decoration with 10 bars (cyan-to-green gradient) and maturity labels. Hidden on mobile (`hidden lg:block`). Reference the HTML file at `landing&opening_pages/modulo1_opening_page.html` lines with the kinetic visual section for exact bar heights and styling.

- [ ] **Step 2: Create OpeningHero component**

Create `src/components/modulo1/OpeningHero.tsx` — badge pill with pulsing dot animation, gradient headline, description text, two CTA buttons. "Iniciar Modelagem" links to `/modulo/1/ettj`. Import `KineticVisual` for the right side. Use Tailwind classes matching the design system (`glass-panel`, `gradient-text`, `primary-container`, etc.).

- [ ] **Step 3: Create CurvePreview component**

Create `src/components/modulo1/CurvePreview.tsx` — full-width glass-panel card with SVG spot curve (gradient stroke from `#4edea3` to `#00f2ff`), 5 data points, "CURTO PRAZO" / "LONGO PRAZO" labels, download and fullscreen icon buttons.

- [ ] **Step 4: Create MethodologyCards component**

Create `src/components/modulo1/MethodologyCards.tsx` — three glass-panel cards in a responsive grid (`grid-cols-1 md:grid-cols-3`):
1. Metodologia: `functions` icon, PU formula in monospace box, green checkmarks for capitalization items
2. Live Feed: green "Conectado" badge, large SELIC rate (11.25%), change indicator
3. Motor de Interpolação: `insights` icon, method name, confidence progress bar (99.8%)

- [ ] **Step 5: Create dedicated Module 1 page**

Create `src/app/modulo/1/page.tsx`:
```typescript
import OpeningHero from "@/components/modulo1/OpeningHero";
import CurvePreview from "@/components/modulo1/CurvePreview";
import MethodologyCards from "@/components/modulo1/MethodologyCards";

export const metadata = {
  title: "ETTJ | Laboratório de Mercado Financeiro",
  description: "Modelagem da Estrutura a Termo - Taxa DI (CDI)",
};

export default function Module1Page() {
  return (
    <div className="min-h-screen">
      <OpeningHero />
      <div className="max-w-7xl mx-auto px-6 pb-16 space-y-8">
        <CurvePreview />
        <MethodologyCards />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Update dynamic module page to redirect Module 1**

In `src/app/modulo/[id]/page.tsx`, add a redirect for `id === "1"`:
```typescript
import { redirect } from "next/navigation";
// At the top of ModuloPage function:
if (id === "1") redirect("/modulo/1");
```

- [ ] **Step 7: Verify the opening page renders**

Run: `npm run dev`
Navigate to `http://localhost:3000/modulo/1`
Expected: Hero section, curve preview, and 3 methodology cards render correctly. Compare visually with `landing&opening_pages/modulo1_opening_page.html` opened in a browser.

- [ ] **Step 8: Commit**

```bash
git add src/app/modulo/1/page.tsx src/components/modulo1/ src/app/modulo/\[id\]/page.tsx
git commit -m "feat(module1): add ETTJ opening page with hero, preview, and methodology cards"
```

---

## Task 9: Control Bar Component

**Files:**
- Create: `src/components/modulo1/ControlBar.tsx`

- [ ] **Step 1: Create ControlBar component**

Create `src/components/modulo1/ControlBar.tsx` — a `'use client'` component with:

**Props:**
```typescript
interface ControlBarProps {
  mode: "single" | "comparison";
  method: InterpolationMethod;
  smoothingFactor: number;
  dateA: string; // ISO date
  dateB: string; // ISO date
  loading: boolean;
  stats?: { total: number; filtered: number; maxBdays: number };
  onModeChange: (mode: "single" | "comparison") => void;
  onMethodChange: (method: InterpolationMethod) => void;
  onSmoothingChange: (factor: number) => void;
  onDateAChange: (date: string) => void;
  onDateBChange: (date: string) => void;
  onLoad: () => void;
}
```

**Layout:** Sticky horizontal bar with flex-wrap:
- Back arrow link to `/modulo/1`
- Segmented control toggle (Curva Única | Comparação) with active state using `bg-primary-container text-on-primary`
- Method `<select>` dropdown using `METHOD_ORDER` and `METHOD_LABELS`
- Smoothing slider (only visible when method is `smoothing-spline`)
- Date input(s): one in single mode, two in comparison mode (Data A with blue border, Data B with red/crimson border)
- Action button: "Carregar" / "Comparar" (disabled when `loading`)
- Stats counters on the right (only when stats is provided)

- [ ] **Step 2: Verify it renders in dev mode**

Create a temporary test in the ETTJ page to render the ControlBar with default props. Navigate to `/modulo/1/ettj` and verify the control bar appears correctly with mode switching, method dropdown, and date pickers.

- [ ] **Step 3: Commit**

```bash
git add src/components/modulo1/ControlBar.tsx
git commit -m "feat(module1): add top control bar with mode toggle, method select, date pickers"
```

---

## Task 10: Interactive Tool Page — Single Curve Mode

**Files:**
- Create: `src/app/modulo/1/ettj/page.tsx`
- Create: `src/components/modulo1/YieldCurveChart.tsx`
- Create: `src/components/modulo1/RateQuery.tsx`
- Create: `src/components/modulo1/QualityMetrics.tsx`
- Create: `src/components/modulo1/FittedParams.tsx`

- [ ] **Step 1: Create YieldCurveChart component**

Create `src/components/modulo1/YieldCurveChart.tsx` — `'use client'` component using `react-plotly.js`:

**Props:** `xObserved: number[], yObserved: number[], xSmooth: number[], ySmooth: number[], date: string, methodLabel: string`

Chart config:
- Trace 1: Observed rates (scatter, blue circles, `marker.size=8`, `marker.color='royalblue'`)
- Trace 2: Fitted curve (line, `line.color='crimson'`, `line.width=3`)
- Layout: `template='plotly_dark'` (customize background to `#191c1f`), `height=500`, `hovermode='closest'`
- Axis labels: "Dias Úteis até o Vencimento" (x), "Taxa de Juros (%)" (y)
- Hover format: `.4f` for rates
- Legend: top-right, horizontal

Note: All y-values passed to this component should be in percentage form (multiply by 100 before passing).

- [ ] **Step 2: Create RateQuery component**

Create `src/components/modulo1/RateQuery.tsx` — `'use client'` component:

**Props:** `interpolationFn: (xTarget: number[]) => number[], xMin: number, xMax: number`

Two-column layout:
- Left: date input → calls `/api/bdays` to convert calendar date to exact business days, shows interpolated rate
- Right: number input for business days → shows interpolated rate
- Rates displayed as large cyan metrics (4 decimal places, percentage)

- [ ] **Step 3: Create QualityMetrics component**

Create `src/components/modulo1/QualityMetrics.tsx`:

**Props:** `metrics: QualityMetrics`

Four cards in a grid. Each shows label + value. Green color when within threshold (RMSE < 0.001, R² > 0.99). Expandable section with LaTeX-formatted metric explanations (use KaTeX or inline HTML for formulas).

- [ ] **Step 4: Create FittedParams component**

Create `src/components/modulo1/FittedParams.tsx`:

**Props:** `params: Record<string, number> | undefined, method: InterpolationMethod`

Only renders when `method` is `nelson-siegel` or `nelson-siegel-svensson` and `params` is defined. Shows parameters in a glass-panel info box: β values to 6 decimal places, λ values to 2 decimal places.

- [ ] **Step 5: Create the ETTJ interactive tool page**

Create `src/app/modulo/1/ettj/page.tsx` — `'use client'` page component:

**State management (useState):**
- `mode: "single" | "comparison"`
- `method: InterpolationMethod` (default `"flat-forward"`)
- `smoothingFactor: number` (default 50)
- `dateA: string`, `dateB: string`
- `loading: boolean`
- `contracts: DI1Contract[] | null`
- `actualDate: string | null`
- `error: string | null`
- `warning: string | null`

**Data flow:**
1. User clicks "Carregar" → fetch `/api/di1?date=...`
2. Filter contracts to 5-year horizon (bdays ≤ 1260)
3. Extract `xData` (bdays) and `yData` (rates)
4. Call `applyMethod(method, xData, yData, smoothingFactor)`
5. Call `computeMetrics(yData, result.yFitted)`
6. Pass results to child components

**Render (single mode):**
```
<ControlBar ... />
{error && <ErrorBanner />}
{warning && <WarningBanner />}
{!contracts && <EmptyState />}
{contracts && <>
  <YieldCurveChart ... />
  <RateQuery ... />
  <QualityMetrics ... />
  {result.params && <FittedParams ... />}
  <TabSection ... />
</>}
<Footer />
```

- [ ] **Step 6: Verify single curve mode end-to-end**

Run: Start Python microservice (`uvicorn main:app --port 8000`) and Next.js dev server (`npm run dev`).
Navigate to `/modulo/1/ettj`, select a date, click "Carregar".
Expected: Chart renders with observed points and fitted curve. Quality metrics display. Rate query works.

- [ ] **Step 7: Commit**

```bash
git add src/app/modulo/1/ettj/page.tsx src/components/modulo1/YieldCurveChart.tsx src/components/modulo1/RateQuery.tsx src/components/modulo1/QualityMetrics.tsx src/components/modulo1/FittedParams.tsx
git commit -m "feat(module1): add interactive tool page with single curve mode"
```

---

## Task 11: Tabs — Data Table, Residuals, Method Equation, Download

**Files:**
- Create: `src/components/modulo1/DataTable.tsx`
- Create: `src/components/modulo1/ResidualsTab.tsx`
- Create: `src/components/modulo1/MethodEquation.tsx`
- Create: `src/components/modulo1/DownloadTab.tsx`

- [ ] **Step 1: Create DataTable component**

Create `src/components/modulo1/DataTable.tsx`:

**Props:** `contracts: DI1Contract[]`

Renders a styled table with columns: Contrato, Vencimento (DD/MM/YYYY), Dias Úteis, Taxa (%) (4 decimals). Alternate row styling. Glass-panel container.

- [ ] **Step 2: Create ResidualsTab component**

Create `src/components/modulo1/ResidualsTab.tsx` — `'use client'` component:

**Props:** `xData: number[], residuals: number[]`

- Plotly scatter chart: orange markers (`marker.size=8`), y=0 reference line (gray dashed)
- Stats row: Média dos Resíduos (`.6f`), Desvio Padrão (`.3f`), Mínimo (`.3f`), Máximo (`.3f`)
- Expandable educational section: "O que são resíduos?" with interpretation text in Portuguese

- [ ] **Step 3: Create MethodEquation component**

Create `src/components/modulo1/MethodEquation.tsx`:

**Props:** `method: InterpolationMethod, smoothingFactor?: number`

Expandable section that shows the LaTeX equation for the selected method. Use inline HTML/CSS for formulas (or KaTeX if installed). Include interpretation text in Portuguese for each method. Reference `python-code/module_01_ettj.py` function `exibir_equacao_metodo()` for the exact content.

- [ ] **Step 4: Create DownloadTab component**

Create `src/components/modulo1/DownloadTab.tsx` — `'use client'` component:

**Props:** `curveData: { bdays: number; rate: number }[], contracts: DI1Contract[], date: string, method: string`

Two download buttons:
- "Download Curva Ajustada (CSV)": columns `DiasUteis;TaxaAjustada_pct` with semicolon separator and comma decimal
- "Download Dados Originais (CSV)": full contract data

Use `Blob` + `URL.createObjectURL` + `<a download>` pattern. Filename format: `curva_di_YYYYMMDD_method.csv`.

- [ ] **Step 5: Integrate tabs into ETTJ page**

Add a tab component to `src/app/modulo/1/ettj/page.tsx` with three tabs: Dados, Resíduos, Download. Add the MethodEquation as an expandable section above the tabs.

- [ ] **Step 6: Verify tabs work**

Run dev server, load data, switch between tabs. Verify:
- Data table shows filtered contracts
- Residuals chart renders with stats
- Method equation updates when method changes
- CSV downloads produce valid files with Brazilian locale formatting

- [ ] **Step 7: Commit**

```bash
git add src/components/modulo1/DataTable.tsx src/components/modulo1/ResidualsTab.tsx src/components/modulo1/MethodEquation.tsx src/components/modulo1/DownloadTab.tsx src/app/modulo/1/ettj/page.tsx
git commit -m "feat(module1): add Data, Residuals, Equation, and Download tabs"
```

---

## Task 12: Comparison Mode

**Files:**
- Create: `src/components/modulo1/ComparisonChart.tsx`
- Create: `src/components/modulo1/ComparisonStats.tsx`
- Create: `src/components/modulo1/KeyMaturitiesTable.tsx`
- Modify: `src/app/modulo/1/ettj/page.tsx`

- [ ] **Step 1: Create ComparisonChart component**

Create `src/components/modulo1/ComparisonChart.tsx` — `'use client'` component using Plotly subplots:

**Props:** `dataA: { x: number[], yObs: number[], ySmooth: number[], xSmooth: number[], date: string }, dataB: { same }, methodLabel: string`

Two-row subplot (`make_subplots` equivalent using Plotly.js):
- Row 1 (65% height): Overlaid curves. Data A: blue circles (`opacity=0.5`) + blue line. Data B: crimson circles (`opacity=0.5`) + crimson line.
- Row 2 (35% height): Difference B−A as orange line with fill-to-zero, y=0 gray dashed reference.
- Shared x-axis, `hovermode='x unified'`, height=700.

- [ ] **Step 2: Create ComparisonStats component**

Create `src/components/modulo1/ComparisonStats.tsx`:

**Props:** `diffMean: number, diffMax: number, diffMin: number, duMaxDiv: number`

Four metric cards showing comparison stats in p.p. (percentage points). Cyan color.

- [ ] **Step 3: Create KeyMaturitiesTable component**

Create `src/components/modulo1/KeyMaturitiesTable.tsx`:

**Props:** `ratesA: Map<number, number>, ratesB: Map<number, number>`

Table with rows for each key maturity (from `KEY_MATURITIES` constant). Columns: Prazo, DU, Taxa A (4 decimals), Taxa B (4 decimals), Δ (p.p., colored orange).

- [ ] **Step 4: Integrate comparison mode into ETTJ page**

Update `src/app/modulo/1/ettj/page.tsx`:
- When `mode === "comparison"`, fetch data for both dates
- Validate: dates must differ, maturity ranges must overlap
- Compute interpolation for both datasets on common x-range
- Calculate differences and stats
- Render ComparisonChart, ComparisonStats, KeyMaturitiesTable
- Add comparison CSV download in expandable section

- [ ] **Step 5: Verify comparison mode end-to-end**

Run both servers. Navigate to `/modulo/1/ettj`, switch to "Comparação", select two different dates, click "Comparar".
Expected: Dual curve chart renders, difference subplot shows, stats display, key maturities table populates.

- [ ] **Step 6: Commit**

```bash
git add src/components/modulo1/ComparisonChart.tsx src/components/modulo1/ComparisonStats.tsx src/components/modulo1/KeyMaturitiesTable.tsx src/app/modulo/1/ettj/page.tsx
git commit -m "feat(module1): add comparison mode with dual curves, stats, and key maturities"
```

---

## Task 13: UI States, Footer, and Polish

**Files:**
- Modify: `src/app/modulo/1/ettj/page.tsx`

- [ ] **Step 1: Add loading, error, warning, and empty states**

In the ETTJ page:
- **Loading**: Show a spinner overlay on the chart area and disable the action button during fetch
- **Error**: Red banner below control bar for API failures or optimization convergence failures
- **Warning**: Yellow banner for data loaded from previous business day, or equal dates in comparison
- **Empty**: Centered message "Selecione uma data e clique em Carregar" when no data is loaded

- [ ] **Step 2: Add footer attribution**

Add footer text below all content:
```
Fonte de Dados: B3 (Brasil, Bolsa, Balcão) via pyield
Nota: Os contratos DI1 são essencialmente taxas zero-cupom com capitalização de 252 dias úteis
```
Style: centered, `text-outline` color, `text-sm`.

- [ ] **Step 3: Test all interpolation methods end-to-end**

Load data and cycle through all 8 methods. Verify:
- Chart updates for each method
- Quality metrics recalculate
- Smoothing slider appears/disappears correctly
- NS/NSS fitted parameters display when those methods are selected
- Residuals tab updates

- [ ] **Step 4: Test responsive behavior**

Resize the browser window to narrow width. Verify the control bar wraps cleanly on mobile.

- [ ] **Step 5: Commit**

```bash
git add src/app/modulo/1/ettj/page.tsx
git commit -m "feat(module1): add UI states (loading/error/warning/empty) and footer"
```

---

## Task 14: Build Verification & Final Cleanup

- [ ] **Step 1: Run all tests**

Run: `npx jest --coverage`
Expected: All tests pass. Coverage report shows lib/ files covered.

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: Build succeeds. No TypeScript errors.

- [ ] **Step 4: Manual end-to-end test**

Start both services and test the complete flow:
1. Landing page → click Module 1 card → opening page renders
2. Click "Iniciar Modelagem" → interactive tool loads
3. Select Flat Forward, pick a date, click Carregar → chart renders
4. Test rate query by date and by business days
5. Switch to each interpolation method → chart updates
6. Switch to Comparação → select two dates → comparison renders
7. Download CSVs → verify file format (semicolons, comma decimals)
8. Check all tabs work (Dados, Resíduos, Download)

- [ ] **Step 5: Final commit**

Review any remaining unstaged changes with `git status` and stage only relevant files before committing.
