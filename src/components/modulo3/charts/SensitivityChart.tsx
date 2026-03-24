"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import type { SensitivityPoint } from "@/lib/fidc/types";

interface SensitivityChartProps {
  data: SensitivityPoint[];
  currentPL: number;
}

export default function SensitivityChart({ data, currentPL }: SensitivityChartProps) {
  const xValues = data.map((p) => p.pl);
  const yValues = data.map((p) => p.margin);

  // Find breakeven point: first pl where margin crosses zero (from negative to positive)
  const breakevenPoint = data.find((p) => p.margin >= 0);
  const breakevenPL = breakevenPoint ? breakevenPoint.pl : null;

  // Find current point margin
  const currentPoint = data.find((p) => p.pl === currentPL) ?? data.reduce((prev, curr) =>
    Math.abs(curr.pl - currentPL) < Math.abs(prev.pl - currentPL) ? curr : prev
  );
  const currentMargin = currentPoint?.margin ?? 0;

  const shapes: object[] = [];
  const annotations: object[] = [];

  // Breakeven dashed vertical line
  if (breakevenPL !== null) {
    shapes.push({
      type: "line",
      x0: breakevenPL,
      x1: breakevenPL,
      y0: Math.min(...yValues) - 2,
      y1: Math.max(...yValues) + 2,
      line: { color: "#4edea3", width: 1.5, dash: "dash" },
    });
    annotations.push({
      x: breakevenPL,
      y: Math.max(...yValues) * 0.9,
      xanchor: "left",
      yanchor: "top",
      text: `Breakeven<br>PL = R$${breakevenPL}M`,
      showarrow: false,
      font: { color: "#4edea3", size: 11, family: "Manrope, sans-serif" },
      bgcolor: "rgba(25, 28, 31, 0.8)",
      borderpad: 4,
    });
  }

  // Red zero line
  shapes.push({
    type: "line",
    x0: xValues[0],
    x1: xValues[xValues.length - 1],
    y0: 0,
    y1: 0,
    line: { color: "#ef4444", width: 1 },
  });

  return (
    <Plot
      data={[
        // Main sensitivity line with fill
        {
          type: "scatter" as const,
          mode: "lines" as const,
          x: xValues,
          y: yValues,
          name: "Margem Líquida",
          line: { color: "#00f2ff", width: 2 },
          fill: "tozeroy" as const,
          fillcolor: "rgba(0, 242, 255, 0.08)",
        },
        // Current PL marker (red star)
        {
          type: "scatter" as const,
          mode: "markers" as const,
          x: [currentPL],
          y: [currentMargin],
          name: "PL Atual",
          marker: {
            color: "#ef4444",
            size: 14,
            symbol: "star",
            line: { color: "#ffffff", width: 1 },
          },
        },
      ]}
      layout={{
        paper_bgcolor: "#191c1f",
        plot_bgcolor: "#191c1f",
        font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        title: {
          text: "Análise de Sensibilidade: Margem vs PL",
          font: { color: "#e1e2e7", size: 14, family: "Manrope, sans-serif" },
        },
        margin: { l: 60, r: 40, t: 60, b: 60 },
        showlegend: true,
        legend: {
          x: 0.01,
          y: 0.99,
          xanchor: "left",
          yanchor: "top",
          font: { color: "#e1e2e7", size: 11, family: "Manrope, sans-serif" },
          bgcolor: "rgba(25, 28, 31, 0.8)",
        },
        xaxis: {
          title: { text: "PL (R$ Milhões)", font: { color: "#e1e2e7", family: "Manrope, sans-serif" } },
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          ticksuffix: "M",
        },
        yaxis: {
          title: { text: "Margem Líquida (%)", font: { color: "#e1e2e7", family: "Manrope, sans-serif" } },
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          ticksuffix: "%",
        },
        shapes,
        annotations,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "380px" }}
    />
  );
}
