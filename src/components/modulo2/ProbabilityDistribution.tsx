"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const DARK_LAYOUT = {
  paper_bgcolor: "#191c1f",
  plot_bgcolor: "#191c1f",
  font: { color: "#e1e2e7" },
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {
          type: "histogram" as const,
          x: probabilities,
          nbinsx: 30,
          marker: { color: "#60a5fa" },
          name: "Probabilidades",
          showlegend: false,
        } as any,
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: {
          text: "Distribuição de Probabilidades de Inadimplência",
          font: { color: "#e1e2e7", size: 14 },
        },
        xaxis: {
          title: { text: "Probabilidade de Inadimplência" },
          range: [0, 1],
          gridcolor: "#2a2d31",
          zerolinecolor: "#2a2d31",
        },
        yaxis: {
          title: { text: "Frequência" },
          gridcolor: "#2a2d31",
          zerolinecolor: "#2a2d31",
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
            fillcolor: "rgba(78, 222, 163, 0.15)",
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
            fillcolor: "rgba(239, 68, 68, 0.15)",
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
            line: { color: "#ef4444", width: 2, dash: "dash" as const },
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
            font: { color: "#4edea3", size: 14, family: "Manrope" },
            yanchor: "bottom" as const,
          },
          {
            x: cutoff + (1 - cutoff) / 2,
            y: 1,
            xref: "x" as const,
            yref: "paper" as const,
            text: "NEGAR",
            showarrow: false,
            font: { color: "#ef4444", size: 14, family: "Manrope" },
            yanchor: "bottom" as const,
          },
        ],
      }}
      config={{ responsive: true }}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
