"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { TIMELINE_EVENTS } from "@/lib/baas/constants";

const darkLayout = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
};

const STATUS_COLOR: Record<string, string> = {
  done: "#10b981",
  current: "#0ea5e9",
  pending: "#64748b",
};

const STATUS_SIZE: Record<string, number> = {
  done: 15,
  current: 20,
  pending: 15,
};

export default function RegulatoryTimeline() {
  const xs = TIMELINE_EVENTS.map((_, i) => i);
  const ys = TIMELINE_EVENTS.map(() => 0);

  // Dotted baseline
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baselineTrace: any = {
    type: "scatter",
    mode: "lines",
    x: xs,
    y: ys,
    line: { color: "rgba(100,116,139,0.4)", width: 2, dash: "dot" },
    hoverinfo: "none",
    showlegend: false,
  };

  // Event points
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pointsTrace: any = {
    type: "scatter",
    mode: "markers+text",
    x: xs,
    y: ys,
    marker: {
      size: TIMELINE_EVENTS.map((e) => STATUS_SIZE[e.status]),
      color: TIMELINE_EVENTS.map((e) => STATUS_COLOR[e.status]),
      line: { width: 2, color: TIMELINE_EVENTS.map((e) => STATUS_COLOR[e.status]) },
    },
    text: TIMELINE_EVENTS.map((e) => `<b>${e.date}</b><br>${e.title}`),
    textposition: "top center",
    textfont: { size: 10, color: "#e1e2e7", family: "Manrope, sans-serif" },
    hoverinfo: "text",
    showlegend: false,
  };

  return (
    <Plot
      data={[baselineTrace, pointsTrace]}
      layout={{
        ...darkLayout,
        xaxis: {
          showgrid: false,
          zeroline: false,
          showticklabels: false,
        },
        yaxis: {
          showgrid: false,
          zeroline: false,
          showticklabels: false,
          range: [-0.5, 1],
        },
        height: 200,
        margin: { l: 20, r: 20, t: 40, b: 20 },
        showlegend: false,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "200px" }}
    />
  );
}
