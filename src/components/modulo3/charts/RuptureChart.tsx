"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import type { SensitivityCurvePoint, RupturePoint } from "@/lib/fidc/types";

interface RuptureChartProps {
  data: SensitivityCurvePoint[];
  currentLossPercent: number;
  rupturePoints: RupturePoint[];
}

export default function RuptureChart({
  data,
  currentLossPercent,
  rupturePoints,
}: RuptureChartProps) {
  const xValues = data.map((p) => p.lossPercent);
  const juniorY = data.map((p) => p.juniorValue / 1_000_000);
  const seniorY = data.map((p) => p.seniorValue / 1_000_000);
  const hasMezanino = data.some((p) => p.mezaninoValue !== undefined && p.mezaninoValue > 0);
  const mezaninoY = data.map((p) => (p.mezaninoValue ?? 0) / 1_000_000);

  // Current loss vertical line
  const maxY =
    Math.max(...juniorY) + Math.max(...mezaninoY) + Math.max(...seniorY);

  const shapes: object[] = [
    {
      type: "line",
      x0: currentLossPercent,
      x1: currentLossPercent,
      y0: 0,
      y1: maxY * 1.05,
      line: { color: "#00f2ff", width: 2, dash: "dash" },
    },
  ];

  const annotations: object[] = [
    {
      x: currentLossPercent,
      y: maxY * 1.05,
      xanchor: "left" as const,
      yanchor: "bottom" as const,
      text: `Perda atual<br>${currentLossPercent.toFixed(1)}%`,
      showarrow: false,
      font: { color: "#00f2ff", size: 10, family: "Manrope, sans-serif" },
      bgcolor: "rgba(25, 28, 31, 0.85)",
      borderpad: 3,
    },
  ];

  // Rupture point annotations (skip "Fundo Total")
  const ruptureColors: Record<string, string> = {
    Junior: "#ff4444",
    Mezanino: "#ffb74d",
  };

  for (const rp of rupturePoints) {
    if (rp.label === "Fundo Total") continue;
    const color = ruptureColors[rp.label] ?? "#e1e2e7";
    shapes.push({
      type: "line",
      x0: rp.lossPercent,
      x1: rp.lossPercent,
      y0: 0,
      y1: maxY * 1.05,
      line: { color, width: 1, dash: "dot" },
    });
    annotations.push({
      x: rp.lossPercent,
      y: maxY * 0.5,
      xanchor: "right" as const,
      yanchor: "middle" as const,
      text: `Ruptura<br>${rp.label}<br>${rp.lossPercent.toFixed(1)}%`,
      showarrow: false,
      font: { color, size: 9, family: "Manrope, sans-serif" },
      bgcolor: "rgba(25, 28, 31, 0.85)",
      borderpad: 3,
    });
  }

  const traces: object[] = [
    // Junior (bottom)
    {
      type: "scatter" as const,
      mode: "lines" as const,
      name: "Junior",
      x: xValues,
      y: juniorY,
      stackgroup: "capital",
      fill: "tonexty" as const,
      line: { color: "#ff4444", width: 1.5 },
      fillcolor: "rgba(255, 68, 68, 0.4)",
      hovertemplate: "Junior: R$ %{y:.1f}M<extra></extra>",
    },
  ];

  if (hasMezanino) {
    traces.push({
      type: "scatter" as const,
      mode: "lines" as const,
      name: "Mezanino",
      x: xValues,
      y: mezaninoY,
      stackgroup: "capital",
      fill: "tonexty" as const,
      line: { color: "#ffb74d", width: 1.5 },
      fillcolor: "rgba(255, 183, 77, 0.35)",
      hovertemplate: "Mezanino: R$ %{y:.1f}M<extra></extra>",
    });
  }

  traces.push({
    type: "scatter" as const,
    mode: "lines" as const,
    name: "Sênior",
    x: xValues,
    y: seniorY,
    stackgroup: "capital",
    fill: "tonexty" as const,
    line: { color: "#4edea3", width: 1.5 },
    fillcolor: "rgba(78, 222, 163, 0.3)",
    hovertemplate: "Sênior: R$ %{y:.1f}M<extra></extra>",
  });

  return (
    <Plot
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data={traces as any}
      layout={{
        paper_bgcolor: "#191c1f",
        plot_bgcolor: "#191c1f",
        font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        title: {
          text: "Curva de Ruptura: Absorção de Perdas por Classe",
          font: { color: "#e1e2e7", size: 14, family: "Manrope, sans-serif" },
        },
        margin: { l: 60, r: 40, t: 60, b: 60 },
        showlegend: true,
        legend: {
          x: 0.98,
          y: 0.98,
          xanchor: "right" as const,
          yanchor: "top" as const,
          font: { color: "#e1e2e7", size: 11, family: "Manrope, sans-serif" },
          bgcolor: "rgba(25, 28, 31, 0.8)",
        },
        xaxis: {
          title: {
            text: "Perda (% do PL)",
            font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          },
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          ticksuffix: "%",
          range: [0, 60],
        },
        yaxis: {
          title: {
            text: "Valor (R$ Milhões)",
            font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          },
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          ticksuffix: "M",
        },
        shapes,
        annotations,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "420px" }}
    />
  );
}
