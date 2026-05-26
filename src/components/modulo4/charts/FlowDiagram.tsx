"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { FLOW_NODES, FLOW_EDGES } from "@/lib/baas/constants";

const darkLayout = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
};

export default function FlowDiagram() {
  // Build a lookup for node positions
  const nodeMap = Object.fromEntries(FLOW_NODES.map((n) => [n.id, n]));

  // Edge traces — one per edge
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edgeTraces: any[] = FLOW_EDGES.map((edge) => {
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];
    const xs = edge.via ? [from.x, edge.via.x, to.x] : [from.x, to.x];
    const ys = edge.via ? [from.y, edge.via.y, to.y] : [from.y, to.y];
    return {
      type: "scatter",
      mode: "lines",
      x: xs,
      y: ys,
      line: {
        color: "rgba(100,116,139,0.4)",
        width: 2,
        dash: "dot",
        shape: edge.via ? "spline" : "linear",
      },
      hoverinfo: "none",
      showlegend: false,
    };
  });

  // Annotations for edge labels (at via waypoint when present, else midpoint)
  const annotations = FLOW_EDGES.map((edge) => {
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];
    const x = edge.via ? edge.via.x : (from.x + to.x) / 2;
    const y = edge.via ? edge.via.y : (from.y + to.y) / 2;
    return {
      x,
      y,
      text: edge.label,
      showarrow: false,
      font: { size: 10, color: "#94a3b8", family: "Manrope, sans-serif" },
      bgcolor: "rgba(17,20,23,0.7)",
      borderpad: 3,
    };
  });

  // Node traces — one per node (marker + text)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeTraces: any[] = FLOW_NODES.map((node) => ({
    type: "scatter",
    mode: "markers+text",
    x: [node.x],
    y: [node.y],
    marker: {
      size: 60,
      color: node.color,
      opacity: 0.2,
    },
    text: [`${node.icon}<br><b>${node.label}</b>`],
    textposition: "middle center",
    textfont: { size: 11, color: "#e1e2e7", family: "Manrope, sans-serif" },
    hoverinfo: "text",
    hovertext: node.label,
    showlegend: false,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = [...edgeTraces, ...nodeTraces];

  return (
    <Plot
      data={traces}
      layout={{
        ...darkLayout,
        xaxis: {
          showgrid: false,
          zeroline: false,
          showticklabels: false,
          range: [-0.05, 1.05],
        },
        yaxis: {
          showgrid: false,
          zeroline: false,
          showticklabels: false,
          range: [-0.1, 1.1],
        },
        annotations,
        height: 350,
        margin: { l: 0, r: 0, t: 0, b: 0 },
        showlegend: false,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "350px" }}
    />
  );
}
