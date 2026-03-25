"use client";

import dynamic from "next/dynamic";
import type { ProvisioningYearResult } from "@/lib/financial-regulation";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ProvisioningChartProps {
  years: ProvisioningYearResult[];
}

export default function ProvisioningChart({ years }: ProvisioningChartProps) {
  return (
    <div className="glass-panel rounded-xl p-4 border border-outline-variant/10">
      <Plot
        data={[
          {
            type: "bar",
            x: years.map((y) => y.year),
            y: years.map((y) => y.interest),
            name: "Receita de Juros",
            marker: { color: "#4edea3" },
          },
          {
            type: "bar",
            x: years.map((y) => y.year),
            y: years.map((y) => -y.provision),
            name: "Provisões",
            marker: { color: "#ff4444" },
          },
        ]}
        layout={{
          barmode: "relative",
          title: { text: "Receita de Juros x Provisões", font: { color: "#e1e2e7", family: "Manrope", size: 14 } },
          paper_bgcolor: "#191c1f",
          plot_bgcolor: "#191c1f",
          font: { color: "#e1e2e7", family: "Manrope" },
          margin: { t: 40, r: 20, b: 40, l: 60 },
          yaxis: { title: { text: "$ milhões" }, gridcolor: "#3a494b" },
          xaxis: { dtick: 1 },
          legend: { orientation: "h", y: -0.2 },
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "420px" }}
      />
    </div>
  );
}
