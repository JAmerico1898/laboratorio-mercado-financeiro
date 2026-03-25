"use client";

import dynamic from "next/dynamic";
import type { SimulationYearResult } from "@/lib/financial-regulation";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface SimulationChartProps {
  history: SimulationYearResult[];
}

export default function SimulationChart({ history }: SimulationChartProps) {
  return (
    <div className="glass-panel rounded-xl p-4 border border-outline-variant/10">
      <Plot
        data={[
          {
            type: "scatter",
            mode: "lines+markers",
            x: history.map((h) => h.year),
            y: history.map((h) => h.car),
            marker: { color: "#00f2ff", size: 8 },
            line: { color: "#00f2ff", width: 2 },
            name: "CAR",
          },
        ]}
        layout={{
          paper_bgcolor: "#191c1f",
          plot_bgcolor: "#191c1f",
          font: { color: "#e1e2e7", family: "Manrope" },
          title: { text: "Evolução do CAR", font: { color: "#e1e2e7", family: "Manrope", size: 14 } },
          xaxis: { title: { text: "Ano" }, dtick: 1 },
          yaxis: { title: { text: "CAR (%)" } },
          shapes: [
            {
              type: "line",
              y0: 10.5,
              y1: 10.5,
              x0: 0,
              x1: 1,
              xref: "paper",
              line: { color: "#f59e0b", width: 2, dash: "dash" },
            },
            {
              type: "line",
              y0: 8,
              y1: 8,
              x0: 0,
              x1: 1,
              xref: "paper",
              line: { color: "#ff4444", width: 2, dash: "dash" },
            },
          ],
          annotations: [
            {
              x: 1,
              xref: "paper",
              y: 10.5,
              text: "Mínimo 10.5%",
              showarrow: false,
              font: { color: "#f59e0b", size: 10 },
            },
            {
              x: 1,
              xref: "paper",
              y: 8,
              text: "Regulatório 8%",
              showarrow: false,
              font: { color: "#ff4444", size: 10 },
            },
          ],
          margin: { t: 40, r: 80, b: 40, l: 60 },
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "350px" }}
      />
    </div>
  );
}
