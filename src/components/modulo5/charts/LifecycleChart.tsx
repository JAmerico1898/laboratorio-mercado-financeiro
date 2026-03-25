"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import type { RealEstateResult } from "@/lib/tokenization/types";

interface LifecycleChartProps {
  result: RealEstateResult;
}

export default function LifecycleChart({ result }: LifecycleChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = [
    {
      type: "scatter",
      mode: "lines",
      name: "Preço do Token (R$)",
      x: result.months,
      y: result.prices,
      line: { color: "#00f2ff", width: 2 },
    },
    {
      type: "scatter",
      mode: "lines",
      name: "Dividendos Pagos (R$)",
      x: result.months,
      y: result.dividends,
      line: { color: "#4edea3", width: 2 },
      yaxis: "y2",
    },
  ];

  return (
    <Plot
      data={traces}
      layout={{
        paper_bgcolor: "#191c1f",
        plot_bgcolor: "#191c1f",
        font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        title: {
          text: "Evolução do Preço e Dividendos ao Longo do Tempo",
          font: { color: "#e1e2e7", size: 14, family: "Manrope, sans-serif" },
        },
        margin: { l: 60, r: 60, t: 60, b: 50 },
        legend: {
          font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          bgcolor: "transparent",
        },
        xaxis: {
          title: { text: "Mês", font: { color: "#9aa3ae" } },
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        },
        yaxis: {
          title: { text: "Preço (R$)", font: { color: "#9aa3ae" } },
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          tickprefix: "R$ ",
          tickformat: ",.2f",
        },
        yaxis2: {
          title: { text: "Dividendos (R$)", font: { color: "#9aa3ae" } },
          overlaying: "y",
          side: "right",
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          tickprefix: "R$ ",
          tickformat: ",.3f",
          showgrid: false,
        },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "380px" }}
    />
  );
}
