"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const DARK_LAYOUT = {
  paper_bgcolor: "#191c1f",
  plot_bgcolor: "#191c1f",
  font: { color: "#e1e2e7" },
  margin: { l: 60, r: 30, t: 50, b: 50 },
};

interface RiskBand {
  label: string;
  count: number;
  percentage: number;
}

interface RiskBandChartProps {
  bands: RiskBand[];
}

const BAND_COLORS = ["#22c55e", "#86efac", "#facc15", "#f97316", "#ef4444"];

export default function RiskBandChart({ bands }: RiskBandChartProps) {
  return (
    <Plot
      data={[
        {
          type: "pie" as const,
          labels: bands.map((b) => b.label),
          values: bands.map((b) => b.count),
          text: bands.map((b) => `${b.count} (${b.percentage.toFixed(1)}%)`),
          textinfo: "label+text" as const,
          hoverinfo: "label+value+percent" as const,
          marker: {
            colors: BAND_COLORS.slice(0, bands.length),
          },
          hole: 0.4,
          textfont: { color: "#111417", size: 12, family: "Manrope, sans-serif" },
        },
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: {
          text: "Distribuição por Faixas de Risco",
          font: { color: "#e1e2e7", size: 14 },
        },
        showlegend: true,
        legend: { font: { color: "#e1e2e7" } },
      }}
      config={{ responsive: true }}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
