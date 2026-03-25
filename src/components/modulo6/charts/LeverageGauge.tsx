"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface LeverageGaugeProps {
  value: number;
  label: string;
  threshold: number;
  maxRange: number;
}

export default function LeverageGauge({ value, label, threshold, maxRange }: LeverageGaugeProps) {
  const isAbove = value >= threshold;

  return (
    <div className="glass-panel rounded-xl p-4 border border-outline-variant/10">
      <Plot
        data={[
          {
            type: "indicator",
            mode: "gauge+number",
            value: value,
            title: { text: label },
            gauge: {
              axis: { range: [0, maxRange] },
              bar: { color: isAbove ? "#4edea3" : "#ff4444" },
              threshold: {
                line: { color: "#ff4444", width: 4 },
                thickness: 0.75,
                value: threshold,
              },
            },
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
