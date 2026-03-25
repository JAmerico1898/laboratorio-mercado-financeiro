"use client";

import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import type { RiskImpactResult } from "@/lib/tokenization/types";

interface RiskHeatmapProps {
  result: RiskImpactResult;
}

export default function RiskHeatmap({ result }: RiskHeatmapProps) {
  const highCount = result.impacts.filter((v) => v >= 70).length;
  const midCount = result.impacts.filter((v) => v >= 40 && v < 70).length;
  const ariaLabel = `Heatmap de risco: ${highCount} categoria(s) crítica(s) (≥70), ${midCount} moderada(s) (40-69). Categorias: ${result.categories.map((c, i) => `${c}: ${result.impacts[i]}`).join(", ")}.`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = [
    {
      type: "heatmap",
      z: [result.impacts],
      x: result.categories,
      y: ["Impacto"],
      colorscale: "RdYlGn_r",
      zmin: 0,
      zmax: 100,
      text: [result.impacts.map((v) => String(v))],
      texttemplate: "%{text}",
      hovertemplate: "%{x}: %{z}<extra></extra>",
      showscale: true,
      colorbar: {
        thickness: 12,
        len: 0.8,
        tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif", size: 11 },
        tickvals: [0, 25, 50, 75, 100],
        ticktext: ["0", "25", "50", "75", "100"],
        bgcolor: "transparent",
        bordercolor: "transparent",
      },
    },
  ];

  return (
    <div aria-label={ariaLabel}>
      <Plot
        data={traces}
        layout={{
          paper_bgcolor: "#191c1f",
          plot_bgcolor: "#191c1f",
          font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          margin: { l: 60, r: 80, t: 20, b: 50 },
          height: 200,
          xaxis: {
            tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif", size: 12 },
            gridcolor: "transparent",
            zeroline: false,
          },
          yaxis: {
            tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif", size: 12 },
            gridcolor: "transparent",
            zeroline: false,
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "200px" }}
      />
    </div>
  );
}
