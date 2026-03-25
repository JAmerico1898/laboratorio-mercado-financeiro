"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface TokenDistributionChartProps {
  distribution: Array<{ stakeholder: string; quantidade: number }>;
  assetName: string;
}

export default function TokenDistributionChart({
  distribution,
  assetName,
}: TokenDistributionChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = [
    {
      type: "pie",
      hole: 0.4,
      values: distribution.map((d) => d.quantidade),
      labels: distribution.map((d) => d.stakeholder),
      marker: {
        colors: ["#00f2ff", "#4edea3", "#8b5cf6", "#ef4444"],
      },
      textinfo: "label+percent",
      textfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
      hovertemplate: "%{label}: %{value:,.0f} tokens (%{percent})<extra></extra>",
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
          text: `Distribuição de Tokens: ${assetName}`,
          font: { color: "#e1e2e7", size: 14, family: "Manrope, sans-serif" },
        },
        margin: { l: 40, r: 40, t: 60, b: 40 },
        showlegend: true,
        legend: { font: { color: "#b9cacb" } },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "350px" }}
    />
  );
}
