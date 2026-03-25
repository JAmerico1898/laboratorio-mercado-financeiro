"use client";

import dynamic from "next/dynamic";
import type { AssetAllocation, RwaResult } from "@/lib/financial-regulation";
import { ASSET_LABELS } from "@/lib/financial-regulation";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const CHART_COLORS = ["#4edea3", "#00f2ff", "#8b5cf6", "#f59e0b", "#ef4444", "#dc2626"];

const DARK_LAYOUT = {
  paper_bgcolor: "#191c1f",
  plot_bgcolor: "#191c1f",
  font: { color: "#e1e2e7", family: "Manrope" },
  margin: { t: 40, r: 20, b: 40, l: 60 },
};

const PLOT_CONFIG = { responsive: true, displayModeBar: false } as const;

interface PortfolioChartsProps {
  allocation: AssetAllocation;
  rwaResult: RwaResult;
}

export default function PortfolioCharts({ allocation, rwaResult }: PortfolioChartsProps) {
  const keys = Object.keys(allocation) as (keyof AssetAllocation)[];
  const labels = keys.map((k) => ASSET_LABELS[k]);
  const allocations = keys.map((k) => allocation[k]);
  const rwaContributions = rwaResult.details.map((d) => d.rwaContribution);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="glass-panel rounded-xl p-4 border border-outline-variant/10">
        <Plot
          data={[
            {
              type: "pie",
              values: allocations,
              labels: labels,
              marker: { colors: CHART_COLORS },
              textinfo: "label+percent",
              hoverinfo: "label+value+percent",
            },
          ]}
          layout={{
            ...DARK_LAYOUT,
            title: { text: "Composição do Portfólio", font: { color: "#e1e2e7", family: "Manrope", size: 14 } },
            showlegend: false,
          }}
          config={PLOT_CONFIG}
          style={{ width: "100%", height: "420px" }}
        />
      </div>

      <div className="glass-panel rounded-xl p-4 border border-outline-variant/10">
        <Plot
          data={[
            {
              type: "bar",
              x: labels,
              y: rwaContributions,
              marker: { color: CHART_COLORS },
            },
          ]}
          layout={{
            ...DARK_LAYOUT,
            title: { text: "Contribuição ao RWA ($M)", font: { color: "#e1e2e7", family: "Manrope", size: 14 } },
            xaxis: { tickangle: -30 },
            yaxis: { title: { text: "$M" }, gridcolor: "#3a494b" },
          }}
          config={PLOT_CONFIG}
          style={{ width: "100%", height: "420px" }}
        />
      </div>
    </div>
  );
}
