"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const DARK_LAYOUT = {
  paper_bgcolor: "#191c1f",
  plot_bgcolor: "#191c1f",
  font: { color: "#e1e2e7" },
  margin: { l: 60, r: 30, t: 50, b: 50 },
};

interface ConfusionMatrixChartProps {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
  title?: string;
}

export default function ConfusionMatrixChart({
  tp,
  tn,
  fp,
  fn,
  title = "Matriz de Confusão",
}: ConfusionMatrixChartProps) {
  const z = [
    [tn, fp],
    [fn, tp],
  ];

  const xLabels = ["Predito: Bom Pagador", "Predito: Inadimplente"];
  const yLabels = ["Real: Bom Pagador", "Real: Inadimplente"];

  const annotations: Array<{
    x: string;
    y: string;
    text: string;
    font: { color: string; size: number };
    showarrow: boolean;
  }> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      annotations.push({
        x: xLabels[j],
        y: yLabels[i],
        text: String(z[i][j]),
        font: { color: z[i][j] > (tp + tn + fp + fn) / 4 ? "#111417" : "#e1e2e7", size: 20 },
        showarrow: false,
      });
    }
  }

  return (
    <Plot
      data={[
        {
          type: "heatmap" as const,
          z,
          x: xLabels,
          y: yLabels,
          colorscale: "Blues" as const,
          showscale: false,
        },
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: { text: title, font: { color: "#e1e2e7", size: 14 } },
        annotations,
        xaxis: { side: "bottom" as const },
        yaxis: { autorange: "reversed" as const },
      }}
      config={{ responsive: true }}
      style={{ width: "100%", height: "450px" }}
    />
  );
}
