"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import type { BondResult } from "@/lib/tokenization/types";

interface CashFlowChartProps {
  result: BondResult;
}

export default function CashFlowChart({ result }: CashFlowChartProps) {
  const barColors = result.cashFlows.map((v) =>
    v > 0 ? "#4edea3" : "#ef4444"
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = [
    {
      type: "bar",
      name: "Fluxo de Caixa",
      x: result.years,
      y: result.cashFlows,
      marker: { color: barColors },
      text: result.cashFlows.map((v) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          maximumFractionDigits: 0,
        }).format(v)
      ),
      textposition: "outside",
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
          text: "Fluxo de Caixa da Debênture por Ano",
          font: { color: "#e1e2e7", size: 14, family: "Manrope, sans-serif" },
        },
        margin: { l: 60, r: 60, t: 60, b: 50 },
        showlegend: false,
        xaxis: {
          title: { text: "Ano", font: { color: "#9aa3ae" } },
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          tickmode: "array",
          tickvals: result.years,
        },
        yaxis: {
          title: { text: "Valor (R$)", font: { color: "#9aa3ae" } },
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          tickprefix: "R$ ",
          tickformat: ",.0f",
        },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "380px" }}
    />
  );
}
