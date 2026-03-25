"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { GLOBAL_REGIONS, GLOBAL_METRICS, GLOBAL_METRIC_COLORS } from "@/lib/baas/constants";

const darkLayout = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
};

export default function GlobalComparison() {
  const metricKeys = Object.keys(GLOBAL_METRICS);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = metricKeys.map((key, i) => ({
    type: "bar",
    name: key,
    x: GLOBAL_REGIONS,
    y: GLOBAL_METRICS[key],
    marker: { color: GLOBAL_METRIC_COLORS[i] },
  }));

  return (
    <Plot
      data={traces}
      layout={{
        ...darkLayout,
        barmode: "group",
        xaxis: {
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          gridcolor: "rgba(58,73,75,0.4)",
          zerolinecolor: "rgba(58,73,75,0.4)",
        },
        yaxis: {
          range: [0, 6],
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          gridcolor: "rgba(58,73,75,0.4)",
          zerolinecolor: "rgba(58,73,75,0.4)",
        },
        legend: {
          font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          bgcolor: "rgba(0,0,0,0)",
          orientation: "h",
          x: 0.5,
          xanchor: "center",
          y: 1.1,
        },
        height: 400,
        margin: { l: 40, r: 20, t: 60, b: 60 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "400px" }}
    />
  );
}
