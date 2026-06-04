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
          marker: { color: "#00314a", size: 8 },
          name: "Taxas Observadas",
        },
        {
          x: xSmooth,
          y: ySmooth,
          type: "scatter" as const,
          mode: "lines" as const,
          line: { color: "#006b5f", width: 3 },
          name: methodLabel,
        },
      ]}
      layout={{
        title: {
          text: `ETTJ — ${methodLabel} — ${date}`,
          font: { color: "#191c1d" },
          y: 0.97,
          yref: "container" as const,
          yanchor: "top" as const,
        },
        paper_bgcolor: "#ffffff",
        plot_bgcolor: "#ffffff",
        font: { color: "#191c1d" },
        height: 500,
        hovermode: "closest" as const,
        xaxis: {
          title: { text: "Dias Úteis até o Vencimento" },
          gridcolor: "#bfc9c4",
        },
        yaxis: {
          title: { text: "Taxa de Juros (%)" },
          hoverformat: ".4f",
          gridcolor: "#bfc9c4",
        },
        legend: {
          orientation: "h" as const,
          x: 0.5,
          y: 1.04,
          xanchor: "center" as const,
          yanchor: "bottom" as const,
        },
        margin: { l: 70, r: 30, t: 110, b: 50 },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%" }}
    />
  );
}
