# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Laboratório de Mercado Financeiro** is an educational financial markets platform being refactored from a Python/Streamlit application to a Next.js web app for Vercel deployment. The content is in Portuguese (pt-BR) and targets finance students and professionals at COPPEAD/FGV/UCAM (Prof. José Américo).

## Source Material (Reference Only — Do Not Modify)

The original Streamlit code and design assets live in these directories:

- `landing&opening_pages/` — Static HTML pages (Tailwind CSS dark theme, Manrope font, Material Symbols icons) for the landing page and each module's opening page. These define the visual design system to replicate in Next.js.
- `python-code/` — Streamlit Python modules containing the business logic, calculations, and interactive simulations to port.
- `python-code/FIDC/` — Sub-modules for Module 3 (FIDC), each with its own `run()` entry point.

## Modules

| # | Name | Python Source | Key Dependencies / Concepts |
|---|------|--------------|----------------------------|
| 1 | Estrutura a Termo de Taxas de Juros (ETTJ) | `module_01_ettj.py` | `pyield` for DI1 futures data, `scipy` interpolation (CubicSpline, Akima, Svensson), Plotly charts. Fetches live market data. |
| 2 | Modelagem de Risco de Crédito | `module_02_credit_risk.py` | `sklearn` LogisticRegression, confusion matrix, ROC/AUC. Requires CSV datasets (`training_sample.csv`, `testing_sample_true.csv`). |
| 3 | FIDC Builder 175 | `module_03_fidc.py` + `FIDC/` | Sub-navigation with 5 sub-modules: viabilidade (breakeven), classes (CVM 175 segregation via graphviz), subordinação (waterfall simulation), checklist (regulatory), animação (HTML embed). |
| 4 | Banking as a Service (BaaS) | `module_04_baas.py` | Based on BCB Consulta Pública 108/2024 & 115/2025. Interactive regulatory exploration with Plotly + embedded HTML components. |
| 5 | Tokenização de Ativos | `module_05_tokenization.py` | Blockchain simulation (SHA-256 hashing, mining), smart contract logic, graphviz diagrams. All client-side computation. |
| 6 | Regulação Bancária (Basileia) | `module_06_financial_regulation.py` | Basel I/II/III/IV simulator, RWA calculation, bank capital adequacy simulation with session state, embedded HTML animations. |

## Design System (from landing page HTML)

- **Theme:** Dark mode (`#111417` background, `#e1e2e7` text)
- **Primary color:** `#00f2ff` (cyan), Secondary: `#4edea3` (green)
- **Font:** Manrope (headlines, body, labels)
- **Icons:** Material Symbols Outlined
- **Cards:** Glass-panel effect (`backdrop-filter: blur(20px)`, semi-transparent backgrounds)
- **Tailwind config:** Custom color tokens follow Material Design 3 naming (surface, on-surface, primary-container, etc.)

## Architecture Decisions for Next.js Migration

- Each module maps to a route: `/modulo/1` through `/modulo/6`
- Module 3 (FIDC) has sub-routes for its 5 sub-modules
- Computationally heavy logic (interpolation, ML models, blockchain sim) runs client-side in TypeScript or via API routes
- Module 1 (ETTJ) requires a server-side API route or external API to fetch DI1 futures data (originally used `pyield`)
- Module 2 needs a strategy for ML inference — consider pre-trained model coefficients embedded client-side
- Interactive charts: use Plotly.js or Recharts (maintain interactivity parity with Streamlit sliders/inputs)
- Each Streamlit `st.session_state` pattern maps to React `useState`/`useReducer`

## Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests
npm test

# Run a single test file
npx jest path/to/test.ts
```

## Development Workflow

- Build and validate one module at a time, starting from the landing page
- Each module must be tested and reviewed before moving to the next
- Use the `landing&opening_pages/*.html` files as the visual reference for each module's opening page
- Port business logic from the corresponding `python-code/*.py` file
- Preserve all educational content, labels, and explanations in Portuguese
