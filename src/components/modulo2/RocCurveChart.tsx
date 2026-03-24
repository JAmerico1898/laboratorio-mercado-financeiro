"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const DARK_LAYOUT = {
  paper_bgcolor: "#191c1f",
  plot_bgcolor: "#191c1f",
  font: { color: "#e1e2e7" },
  margin: { l: 60, r: 30, t: 50, b: 50 },
};

interface RocCurveChartProps {
  fpr: number[];
  tpr: number[];
  auc: number;
  title?: string;
}

export default function RocCurveChart({
  fpr,
  tpr,
  auc,
  title = "Curva ROC",
}: RocCurveChartProps) {
  return (
    <Plot
      data={[
        {
          type: "scatter" as const,
          mode: "lines" as const,
          x: fpr,
          y: tpr,
          name: `Modelo (AUC = ${auc.toFixed(4)})`,
          line: { color: "#3b82f6", width: 2 },
        },
        {
          type: "scatter" as const,
          mode: "lines" as const,
          x: [0, 1],
          y: [0, 1],
          name: "Classificador Aleatório",
          line: { color: "#ef4444", width: 2, dash: "dash" as const },
        },
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: { text: title, font: { color: "#e1e2e7", size: 14 } },
        xaxis: {
          title: { text: "Taxa de Falsos Positivos (1 - Especificidade)" },
          range: [0, 1],
          gridcolor: "#2a2d31",
          zerolinecolor: "#2a2d31",
        },
        yaxis: {
          title: { text: "Taxa de Verdadeiros Positivos (Sensibilidade)" },
          range: [0, 1],
          gridcolor: "#2a2d31",
          zerolinecolor: "#2a2d31",
        },
        showlegend: true,
        legend: { x: 0.4, y: 0.1 },
      }}
      config={{ responsive: true }}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
