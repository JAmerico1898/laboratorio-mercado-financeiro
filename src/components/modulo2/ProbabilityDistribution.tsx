"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const DARK_LAYOUT = {
  paper_bgcolor: "#ffffff",
  plot_bgcolor: "#ffffff",
  font: { color: "#191c1d" },
  margin: { l: 60, r: 30, t: 50, b: 50 },
};

interface ProbabilityDistributionProps {
  probabilities: number[];
  cutoff: number;
}

export default function ProbabilityDistribution({
  probabilities,
  cutoff,
}: ProbabilityDistributionProps) {
  return (
    <Plot
      data={[
        {
          type: "histogram" as const,
          x: probabilities,
          nbinsx: 30,
          marker: { color: "#00314a" },
          name: "Probabilidades",
          showlegend: false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: {
          text: "Distribuição de Probabilidades de Inadimplência",
          font: { color: "#191c1d", size: 14 },
        },
        xaxis: {
          title: { text: "Probabilidade de Inadimplência" },
          range: [0, 1],
          gridcolor: "#bfc9c4",
          zerolinecolor: "#bfc9c4",
        },
        yaxis: {
          title: { text: "Frequência" },
          gridcolor: "#bfc9c4",
          zerolinecolor: "#bfc9c4",
        },
        shapes: [
          // Green region (APROVAR)
          {
            type: "rect" as const,
            xref: "x" as const,
            yref: "paper" as const,
            x0: 0,
            x1: cutoff,
            y0: 0,
            y1: 1,
            fillcolor: "rgba(0, 107, 95, 0.15)",
            line: { width: 0 },
            layer: "below" as const,
          },
          // Red region (NEGAR)
          {
            type: "rect" as const,
            xref: "x" as const,
            yref: "paper" as const,
            x0: cutoff,
            x1: 1,
            y0: 0,
            y1: 1,
            fillcolor: "rgba(220, 38, 38, 0.12)",
            line: { width: 0 },
            layer: "below" as const,
          },
          // Cutoff line
          {
            type: "line" as const,
            xref: "x" as const,
            yref: "paper" as const,
            x0: cutoff,
            x1: cutoff,
            y0: 0,
            y1: 1,
            line: { color: "#dc2626", width: 2, dash: "dash" as const },
          },
        ],
        annotations: [
          {
            x: cutoff / 2,
            y: 1,
            xref: "x" as const,
            yref: "paper" as const,
            text: "APROVAR",
            showarrow: false,
            font: { color: "#006b5f", size: 14, family: "Manrope" },
            yanchor: "bottom" as const,
          },
          {
            x: cutoff + (1 - cutoff) / 2,
            y: 1,
            xref: "x" as const,
            yref: "paper" as const,
            text: "NEGAR",
            showarrow: false,
            font: { color: "#dc2626", size: 14, family: "Manrope" },
            yanchor: "bottom" as const,
          },
        ],
      }}
      config={{ responsive: true }}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
