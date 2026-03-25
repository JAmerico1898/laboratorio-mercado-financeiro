"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const darkLayout = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
};

interface RevenueBreakdownProps {
  interchange: number;
  float: number;
  credit: number;
}

export default function RevenueBreakdown({ interchange, float, credit }: RevenueBreakdownProps) {
  const total = interchange + float + credit;

  if (total <= 0) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = [
    {
      type: "pie",
      labels: ["Intercâmbio", "Float", "Crédito"],
      values: [interchange, float, credit],
      hole: 0.6,
      marker: {
        colors: ["#0ea5e9", "#10b981", "#f59e0b"],
        line: { color: "rgba(0,0,0,0)", width: 0 },
      },
      textfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
      hovertemplate: "%{label}: R$ %{value:,.0f}<extra></extra>",
    },
  ];

  return (
    <Plot
      data={traces}
      layout={{
        ...darkLayout,
        annotations: [
          {
            text: "Receita",
            x: 0.5,
            y: 0.5,
            font: { size: 14, color: "#ffffff", family: "Manrope, sans-serif" },
            showarrow: false,
          },
        ],
        legend: {
          font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          bgcolor: "rgba(0,0,0,0)",
          orientation: "h",
          x: 0.5,
          xanchor: "center",
          y: -0.1,
        },
        height: 250,
        margin: { l: 20, r: 20, t: 20, b: 60 },
        showlegend: true,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "250px" }}
    />
  );
}
