"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { RISK_CATEGORIES, RISK_INHERENT, RISK_MITIGATED } from "@/lib/baas/constants";

const darkLayout = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
};

export default function RiskRadar() {
  // Close the polygon by repeating the first point
  const inherentClosed = [...RISK_INHERENT, RISK_INHERENT[0]];
  const mitigatedClosed = [...RISK_MITIGATED, RISK_MITIGATED[0]];
  const categoriesClosed = [...RISK_CATEGORIES, RISK_CATEGORIES[0]];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = [
    {
      type: "scatterpolar",
      r: inherentClosed,
      theta: categoriesClosed,
      fill: "toself",
      fillcolor: "rgba(239,68,68,0.3)",
      line: { color: "#ef4444", width: 2 },
      name: "Nível de Risco",
    },
    {
      type: "scatterpolar",
      r: mitigatedClosed,
      theta: categoriesClosed,
      fill: "toself",
      fillcolor: "rgba(16,185,129,0.3)",
      line: { color: "#10b981", width: 2 },
      name: "Após Mitigação",
    },
  ];

  return (
    <Plot
      data={traces}
      layout={{
        ...darkLayout,
        polar: {
          bgcolor: "rgba(0,0,0,0)",
          radialaxis: {
            visible: true,
            range: [0, 5],
            tickfont: { color: "#64748b", size: 10, family: "Manrope, sans-serif" },
            gridcolor: "rgba(100,116,139,0.2)",
            linecolor: "rgba(100,116,139,0.2)",
          },
          angularaxis: {
            tickfont: { color: "#94a3b8", size: 11, family: "Manrope, sans-serif" },
            gridcolor: "rgba(100,116,139,0.2)",
            linecolor: "rgba(100,116,139,0.2)",
          },
        },
        legend: {
          font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          bgcolor: "rgba(0,0,0,0)",
          orientation: "h",
          x: 0.5,
          xanchor: "center",
          y: -0.1,
        },
        height: 400,
        margin: { l: 40, r: 40, t: 20, b: 60 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "400px" }}
    />
  );
}
