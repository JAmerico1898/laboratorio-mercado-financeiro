"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface CarGaugeProps {
  car: number;
}

export default function CarGauge({ car }: CarGaugeProps) {
  return (
    <div className="glass-panel rounded-xl p-4 border border-outline-variant/10">
      <Plot
        data={[
          {
            type: "indicator",
            mode: "gauge+number+delta",
            value: car,
            delta: { reference: 10.5 },
            gauge: {
              axis: { range: [0, 25] },
              bar: { color: "#00f2ff" },
              steps: [
                { range: [0, 8], color: "#ff4444" },
                { range: [8, 10.5], color: "#f59e0b" },
                { range: [10.5, 25], color: "#4edea3" },
              ],
              threshold: {
                line: { color: "#ff4444", width: 4 },
                thickness: 0.75,
                value: 8,
              },
            },
            title: { text: "Índice de Basileia (CAR) (%)" },
          } as Plotly.Data,
        ]}
        layout={{
          paper_bgcolor: "#191c1f",
          plot_bgcolor: "#191c1f",
          font: { color: "#e1e2e7", family: "Manrope" },
          margin: { t: 40, r: 20, b: 0, l: 20 },
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "300px" }}
      />
    </div>
  );
}
