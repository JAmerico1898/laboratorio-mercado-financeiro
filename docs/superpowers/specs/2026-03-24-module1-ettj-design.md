# Module 1: ETTJ — Design Spec

## Context

Module 1 (Estrutura a Termo de Taxas de Juros) is the first interactive module of the Laboratório de Mercado Financeiro platform. It lets students model and analyze the Brazilian yield curve using DI1 futures data from B3. The original Streamlit implementation is being ported to Next.js with TypeScript.

**Key decisions:**
- Python microservice (FastAPI + pyield) for live B3 data
- Top control bar layout (no sidebar)
- Plotly.js for charting (feature parity with Python version)
- TypeScript interpolation engine (8 methods, from scratch)
- Separate pages: opening page (`/modulo/1`) and interactive tool (`/modulo/1/ettj`)

## Pages

### Opening Page (`/modulo/1`)

Faithful replica of `landing&opening_pages/modulo1_opening_page.html`.

**Sections:**
1. **Hero** — Module badge pill with pulsing dot, gradient headline ("Modelagem da Estrutura a Termo - Taxa DI (CDI)"), description text, two CTA buttons ("Escolha o Método" + "Iniciar Modelagem → /modulo/1/ettj")
2. **Kinetic Visual** — Glass-panel bar chart (10 bars, cyan-to-green gradient) with maturity labels (1M to 10A). Hidden on mobile.
3. **Curve Preview** — Full-width SVG spot curve with gradient stroke, download/fullscreen icons
4. **Three Methodology Cards** (glass-panel, 3-column grid):
   - Metodologia: PU formula, compound capitalization checklist
   - Live Feed: SELIC rate display (static or BCB API)
   - Motor de Interpolação: method name + model confidence bar

**Components:** `OpeningHero.tsx`, `CurvePreview.tsx`, `MethodologyCards.tsx`

### Interactive Tool (`/modulo/1/ettj`)

Two operating modes sharing the same page with a top control bar.

#### Control Bar

Sticky horizontal bar at the top with:
- Back arrow (← to `/modulo/1`)
- Mode toggle: segmented control (Curva Única | Comparação)
- Method dropdown: 8 interpolation methods in pedagogical order: Flat Forward, Nelson-Siegel-Svensson, Nelson-Siegel, Smoothing Spline, Akima Spline, PCHIP (Monotônica), Cubic Spline, Interpolação Linear
- Smoothing slider: appears only when "Smoothing Spline" is selected (range 0–200, step 10, default 50)
- Date picker(s): one for Curva Única, two color-coded for Comparação (Data A = blue/royalblue, Data B = red/crimson — matching chart trace colors)
- Action button: "Carregar" (single) or "Comparar" (comparison)
- Stats counters: Total Contratos, ≤5 Anos, Prazo Máx (right-aligned, appear after data loads)

**Component:** `ControlBar.tsx`

#### Single Curve Mode (Curva Única)

1. **Status message** — Green success/info bar showing loaded date
2. **Yield curve chart** (Plotly) — Observed points (blue circles) + fitted curve (crimson line). Title includes date. Hover tooltips with 4-decimal precision. Legend top-right. `hovermode='closest'`.
3. **Rate query section** — Two-column: query by calendar date (with estimated business days) and query by business days. Each shows the interpolated rate as a large metric.
4. **Quality metrics** — 4 cards: RMSE, MAE, R², Max Error. Green color when within threshold. Expandable explanation with LaTeX formulas.
5. **Method equation expander** — Expandable section above tabs with LaTeX rendering of the selected method's formula + interpretation
6. **Fitted parameters** — When NS or NSS is selected, display fitted parameters (β values to 6 decimals, λ values to 2 decimals) in an info box near the chart
7. **Tabs:**
   - **Dados** — Filtered DI1 contract table (Contrato, Vencimento, Dias Úteis, Taxa %)
   - **Resíduos** — Plotly scatter (orange markers, y=0 reference line) + stats (mean, std, min, max) + expandable educational section ("O que são resíduos?" with interpretation guidance)
   - **Download** — CSV downloads for fitted curve and original data (semicolon separator `;`, comma decimal `,` for Brazilian locale)

**Components:** `YieldCurveChart.tsx`, `RateQuery.tsx`, `QualityMetrics.tsx`, `FittedParams.tsx`, `DataTable.tsx`, `ResidualsTab.tsx`, `MethodEquation.tsx`, `DownloadTab.tsx`

#### Comparison Mode (Comparação)

**Validations:**
- Data A and Data B must be different dates — show warning if equal
- After fetching, check that maturity ranges overlap (x_min_comum < x_max_comum) — show error if no overlap

1. **Dual curve chart** (Plotly subplots):
   - Top (65%): overlaid curves — Data A (blue circles + line), Data B (red diamonds + line)
   - Bottom (35%): difference B−A (orange line with fill-to-zero, y=0 reference)
   - Shared x-axis, `hovermode='x unified'` (shows both curves' values at same x). Observed points at `opacity=0.5`
2. **Comparison stats** — 4 cards: Dif. Média, Dif. Máxima, Dif. Mínima, DU Maior Divergência
3. **Key maturities table** — Rows for 1M(21), 3M(63), 6M(126), 1A(252), 2A(504), 3A(756), 4A(1008), 5A(1260). Columns: Prazo, DU, Taxa A, Taxa B, Δ (p.p.)
4. **Expandable:** Method equation + CSV download (columns: `DiasUteis`, `Taxa_A_YYYYMMDD_pct`, `Taxa_B_YYYYMMDD_pct`, `Diferenca_pp`; semicolon separator, comma decimal)

**Component:** `ComparisonChart.tsx`, `ComparisonStats.tsx`, `KeyMaturitiesTable.tsx`

## Math Engine (`src/lib/interpolation.ts`)

All 8 methods implemented in TypeScript, ported from the Python/scipy source.

### Methods

1. **Flat Forward** — Market standard. Constant forward rate between vertices, 252-day compound capitalization. Formula: cap_d = cap_i · (1 + f)^((d−d_i)/252), r_d = cap_d^(252/d) − 1
2. **Linear** — Simple linear interpolation between adjacent points
3. **Cubic Spline** — Piecewise cubic polynomials, C² continuity. Solve tridiagonal system for second derivatives.
4. **PCHIP** — Monotonicity-preserving Hermite interpolation. Prevents overshoots.
5. **Akima** — Weighted derivative calculation, less sensitive to outliers
6. **Smoothing Spline** — Uses scipy-style `s` parameter (sum-of-squared-residuals budget), NOT Tikhonov λ. When `s=0` the spline interpolates exactly; larger `s` allows more deviation. The UI slider maps directly to this `s` parameter. Fallback: if smoothing_factor is not set, default to `s = len(x)`. **Equation display:** Show the standard Tikhonov regularization form in the equation expander for educational purposes (matching the Python UI), with a note that the slider maps to scipy's `s` parameter.
7. **Nelson-Siegel** — 4-parameter model (β₀, β₁, β₂, λ). Fit via bounded optimization.
8. **Nelson-Siegel-Svensson** — 6-parameter extension (β₀, β₁, β₂, β₃, λ₁, λ₂)

### Optimization (for NS/NSS)

Use Levenberg-Marquardt algorithm (npm: `ml-levenberg-marquardt`) for least-squares fitting — well-suited for this small-parameter (4–6) problem. Fallback: if optimization fails to converge, show an error message in the UI rather than crashing.

**Objective function:** Minimize `Σ(y_i − ŷ_i)²` (sum of squared errors).

**Bounds constraints:**
- β₀: [y_min − 0.05, y_max + 0.05]
- β₁, β₂, β₃: [−0.1, 0.1]
- λ₁: [1, 2000], λ₂: [1, 3000]

**Initial guesses (critical for convergence):**
- NS: `[mean(y), -0.02, -0.02, 500]`
- NSS: `[mean(y), -0.02, -0.02, 0.01, 500, 1000]`

### Quality Metrics (`src/lib/metrics.ts`)

- RMSE: √(Σ(y − ŷ)²/n)
- MAE: Σ|y − ŷ|/n
- R²: 1 − Σ(y − ŷ)²/Σ(y − ȳ)²
- Max Error: max|y − ŷ|

## Data Layer

### Python Microservice (`api/main.py`)

FastAPI app with two endpoints:
- `GET /di1?date=YYYY-MM-DD` — Fetches DI1 futures data via pyield. Retries up to 10 previous business days if data unavailable. Returns JSON array of `{ticker, expiration, bdays, rate}` — the service maps pyield's column names (`TickerSymbol` → `ticker`, `ExpirationDate` → `expiration`, `BDaysToExp` → `bdays`, `SettlementRate` → `rate`).
- `GET /bdays?start=YYYY-MM-DD&end=YYYY-MM-DD` — Counts business days between two dates via pyield. Used by the Rate Query section to convert a calendar date to business days.

Dependencies: `fastapi`, `uvicorn`, `pyield`, `pandas`

### Next.js API Route (`src/app/api/di1/route.ts`)

Proxies requests to the Python microservice. Adds caching (1-hour TTL via in-memory cache or Redis). Returns typed JSON response.

### TypeScript Types (`src/lib/types.ts`)

```typescript
interface DI1Contract {
  ticker: string;
  expiration: string; // ISO date
  bdays: number;
  rate: number; // decimal (e.g., 0.1050)
}

interface InterpolationResult {
  xSmooth: number[];       // business days
  ySmooth: number[];       // decimal form (e.g., 0.1050 = 10.50%)
  yFitted: number[];       // at observed points, decimal form
  params?: Record<string, number>; // NS/NSS fitted params
}
// NOTE: All rates stored in decimal form throughout the pipeline.
// Percentage conversion (×100) happens ONLY at the UI display layer.

interface QualityMetrics {
  rmse: number;
  mae: number;
  r2: number;
  maxError: number;
}
```

## File Structure

```
src/
├── app/
│   ├── api/di1/route.ts              # API proxy
│   └── modulo/1/
│       ├── page.tsx                   # Opening page
│       └── ettj/page.tsx              # Interactive tool
├── components/modulo1/
│   ├── OpeningHero.tsx
│   ├── CurvePreview.tsx
│   ├── MethodologyCards.tsx
│   ├── ControlBar.tsx
│   ├── YieldCurveChart.tsx
│   ├── ComparisonChart.tsx
│   ├── ComparisonStats.tsx
│   ├── KeyMaturitiesTable.tsx
│   ├── RateQuery.tsx
│   ├── QualityMetrics.tsx
│   ├── DataTable.tsx
│   ├── ResidualsTab.tsx
│   ├── MethodEquation.tsx
│   ├── FittedParams.tsx
│   └── DownloadTab.tsx
├── lib/
│   ├── interpolation.ts              # 8 methods
│   ├── optimization.ts               # Levenberg-Marquardt for NS/NSS
│   ├── metrics.ts                    # RMSE, MAE, R², MaxErr
│   └── types.ts                      # DI1Contract, etc.
api/
├── main.py                            # FastAPI + pyield
└── requirements.txt
```

## Constants

- Business day basis: 252 days/year
- 5-year horizon: 1260 business days
- Smooth curve resolution: 500 points
- Key maturities: {21: "1M", 63: "3M", 126: "6M", 252: "1A", 504: "2A", 756: "3A", 1008: "4A", 1260: "5A"}
- Default smoothing factor: 50 (range 0–200, step 10)
- Quality threshold: errors < 10 bps (0.10%), R² > 0.99

## UI States

- **Loading**: Skeleton/spinner overlay on chart area while fetching DI1 data. Control bar action button disabled during fetch.
- **Error**: Red error banner below control bar for API failures, invalid dates, or optimization convergence failures.
- **Warning**: Yellow warning bar for non-critical issues (e.g., data loaded from previous business day, dates are equal).
- **Empty**: Prompt message when no data has been loaded yet ("Selecione uma data e clique em Carregar").

## Footer

Data source attribution below all content:
> Fonte de Dados: B3 (Brasil, Bolsa, Balcão) via pyield
> Nota: Os contratos DI1 são essencialmente taxas zero-cupom com capitalização de 252 dias úteis

## Verification

1. **Python microservice**: Start with `uvicorn main:app`, call `GET /di1?date=2026-03-24`, verify JSON response with DI1 contracts
2. **API proxy**: `curl localhost:3000/api/di1?date=2026-03-24`, verify proxied response
3. **Interpolation**: Unit tests for each method against known scipy outputs (test vectors from Python version)
4. **Opening page**: Visual comparison with `modulo1_opening_page.html` in browser
5. **Single curve mode**: Load data, select each method, verify chart renders + metrics compute correctly
6. **Comparison mode**: Select two dates, verify dual chart + difference + key maturities table
7. **Rate query**: Query specific dates/business days, compare results with Python version
8. **Downloads**: Verify CSV files contain correct data format
9. **Responsive**: Test control bar wrapping on narrow viewports
