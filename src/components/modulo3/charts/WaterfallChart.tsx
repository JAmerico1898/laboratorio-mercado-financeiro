"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import type { ViabilidadeResult } from "@/lib/fidc/types";

interface WaterfallChartProps {
  result: ViabilidadeResult;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function WaterfallChart({ result }: WaterfallChartProps) {
  const { receitaBruta, fixedCosts, variableCosts, netResult } = result;

  const isPositive = netResult >= 0;

  const measures: string[] = ["absolute", "relative", "relative", "total"];
  const x: string[] = ["Receita Bruta", "Custos Fixos", "Custos Variáveis", "Resultado Líquido"];
  const y: number[] = [receitaBruta, -fixedCosts, -variableCosts, netResult];
  const textLabels: string[] = [
    formatBRL(receitaBruta),
    `-${formatBRL(fixedCosts)}`,
    `-${formatBRL(variableCosts)}`,
    formatBRL(netResult),
  ];

  return (
    <Plot
      data={[
        {
          type: "waterfall" as const,
          orientation: "v" as const,
          measure: measures,
          x,
          y,
          text: textLabels,
          textposition: "outside" as const,
          connector: {
            line: { color: "#3a494b", width: 1, dash: "dot" },
          },
          increasing: { marker: { color: "#4edea3" } },
          decreasing: { marker: { color: "#ef4444" } },
          totals: {
            marker: { color: isPositive ? "#00f2ff" : "#ef4444" },
          },
        },
      ]}
      layout={{
        paper_bgcolor: "#191c1f",
        plot_bgcolor: "#191c1f",
        font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        title: {
          text: "Composição do Resultado Econômico",
          font: { color: "#e1e2e7", size: 14, family: "Manrope, sans-serif" },
        },
        margin: { l: 60, r: 60, t: 60, b: 60 },
        showlegend: false,
        xaxis: {
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        },
        yaxis: {
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
