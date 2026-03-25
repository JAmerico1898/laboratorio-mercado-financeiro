"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface YieldCurveChartProps {
  xObserved: number[];
  yObserved: number[];
  xSmooth: number[];
  ySmooth: number[];
  date: string;
  methodLabel: string;
}

export default function YieldCurveChart({
  xObserved,
  yObserved,
  xSmooth,
  ySmooth,
  date,
  methodLabel,
}: YieldCurveChartProps) {
  return (
    <Plot
      data={[
        {
          x: xObserved,
          y: yObserved,
          type: "scatter" as const,
          mode: "markers" as const,
          marker: { color: "royalblue", size: 8 },
          name: "Taxas Observadas",
        },
        {
          x: xSmooth,
          y: ySmooth,
          type: "scatter" as const,
          mode: "lines" as const,
          line: { color: "crimson", width: 3 },
          name: methodLabel,
        },
      ]}
      layout={{
        title: {
          text: `ETTJ — ${methodLabel} — ${date}`,
          font: { color: "#e1e2e7" },
        },
        paper_bgcolor: "#191c1f",
        plot_bgcolor: "#191c1f",
        font: { color: "#e1e2e7" },
        height: 500,
        hovermode: "closest" as const,
        xaxis: {
          title: { text: "Dias Úteis até o Vencimento" },
          gridcolor: "#3a494b",
        },
        yaxis: {
          title: { text: "Taxa de Juros (%)" },
          hoverformat: ".4f",
          gridcolor: "#3a494b",
        },
        legend: {
          x: 1,
          y: 1,
          xanchor: "right" as const,
        },
        margin: { l: 60, r: 30, t: 50, b: 50 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%" }}
    />
  );
}
