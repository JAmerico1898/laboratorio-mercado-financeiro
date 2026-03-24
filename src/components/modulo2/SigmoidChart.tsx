"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const DARK_LAYOUT = {
  paper_bgcolor: "#191c1f",
  plot_bgcolor: "#191c1f",
  font: { color: "#e1e2e7" },
  margin: { l: 60, r: 30, t: 50, b: 50 },
};

interface SigmoidChartProps {
  linearCombinations: number[];
  probabilities: number[];
  yTrain: number[];
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export default function SigmoidChart({
  linearCombinations,
  probabilities,
  yTrain,
}: SigmoidChartProps) {
  // Theoretical sigmoid curve
  const minLC = Math.min(...linearCombinations) - 2;
  const maxLC = Math.max(...linearCombinations) + 2;
  const step = (maxLC - minLC) / 299;
  const xTheory = Array.from({ length: 300 }, (_, i) => minLC + i * step);
  const yTheory = xTheory.map(sigmoid);

  // Sample up to 1000 random data points for scatter
  const maxSamples = Math.min(1000, linearCombinations.length);
  const indices = Array.from({ length: linearCombinations.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const sampledIndices = indices.slice(0, maxSamples);

  const scatterX0: number[] = [];
  const scatterY0: number[] = [];
  const scatterX1: number[] = [];
  const scatterY1: number[] = [];

  for (const idx of sampledIndices) {
    if (yTrain[idx] === 0) {
      scatterX0.push(linearCombinations[idx]);
      scatterY0.push(probabilities[idx]);
    } else {
      scatterX1.push(linearCombinations[idx]);
      scatterY1.push(probabilities[idx]);
    }
  }

  // Histogram data
  const probClass0 = probabilities.filter((_, i) => yTrain[i] === 0);
  const probClass1 = probabilities.filter((_, i) => yTrain[i] === 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = [
    // Theoretical sigmoid curve
    {
          type: "scatter" as const,
          mode: "lines" as const,
          x: xTheory,
          y: yTheory,
          name: "Curva Sigmóide",
          line: { color: "#00f2ff", width: 2 },
          xaxis: "x",
          yaxis: "y",
        },
        // Class 0 scatter
        {
          type: "scatter" as const,
          mode: "markers" as const,
          x: scatterX0,
          y: scatterY0,
          name: "Bom Pagador (0)",
          marker: { color: "#4edea3", size: 4, opacity: 0.6 },
          xaxis: "x",
          yaxis: "y",
        },
        // Class 1 scatter
        {
          type: "scatter" as const,
          mode: "markers" as const,
          x: scatterX1,
          y: scatterY1,
          name: "Inadimplente (1)",
          marker: { color: "#ef4444", size: 4, opacity: 0.6 },
          xaxis: "x",
          yaxis: "y",
        },
        // Histogram class 0
        {
          type: "histogram" as const,
          x: probClass0,
          name: "Bom Pagador (0)",
          marker: { color: "#4edea3" },
          opacity: 0.7,
          nbinsx: 30,
          xaxis: "x2",
          yaxis: "y2",
          showlegend: false,
        },
        // Histogram class 1
        {
          type: "histogram" as const,
          x: probClass1,
          name: "Inadimplente (1)",
          marker: { color: "#ef4444" },
          opacity: 0.7,
          nbinsx: 30,
          xaxis: "x2",
          yaxis: "y2",
          showlegend: false,
        },
  ];

  return (
    <Plot
      data={traces}
      layout={{
        ...DARK_LAYOUT,
        title: {
          text: "Análise da Função Sigmóide do Modelo de Regressão Logística",
          font: { color: "#e1e2e7", size: 14 },
        },
        barmode: "overlay" as const,
        showlegend: true,
        legend: { x: 0, y: -0.2, orientation: "h" as const },
        xaxis: {
          domain: [0, 0.48],
          title: { text: "Combinação Linear (β₀ + β₁X₁ + β₂X₂ + ...)" },
          gridcolor: "#2a2d31",
          zerolinecolor: "#2a2d31",
        },
        yaxis: {
          title: { text: "Probabilidade de Inadimplência" },
          gridcolor: "#2a2d31",
          zerolinecolor: "#2a2d31",
        },
        xaxis2: {
          domain: [0.52, 1],
          anchor: "y2",
          title: { text: "Probabilidade Predita" },
          gridcolor: "#2a2d31",
          zerolinecolor: "#2a2d31",
        },
        yaxis2: {
          anchor: "x2",
          title: { text: "Frequência" },
          gridcolor: "#2a2d31",
          zerolinecolor: "#2a2d31",
        },
      }}
      config={{ responsive: true }}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
