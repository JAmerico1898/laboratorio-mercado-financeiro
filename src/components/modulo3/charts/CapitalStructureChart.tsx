"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import type { WaterfallResult } from "@/lib/fidc/types";

interface CapitalStructureChartProps {
  result: WaterfallResult;
}

function fmtM(value: number): string {
  return `R$ ${(value / 1_000_000).toFixed(1)}M`;
}

function fmtPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

export default function CapitalStructureChart({ result }: CapitalStructureChartProps) {
  const { senior, mezanino, junior } = result;

  const plInitial = senior.initial + (mezanino?.initial ?? 0) + junior.initial;
  const plFinal = senior.final + (mezanino?.final ?? 0) + junior.final;

  const xCategories = ["Estrutura Inicial", "Após Perda"];

  // Junior trace (bottom, red)
  const juniorInitialPct = plInitial > 0 ? (junior.initial / plInitial) * 100 : 0;
  const juniorFinalPct = plFinal > 0 ? (junior.final / plFinal) * 100 : 0;
  const juniorTrace = {
    type: "bar" as const,
    name: "Junior",
    x: xCategories,
    y: [junior.initial / 1_000_000, junior.final / 1_000_000],
    text: [
      `${fmtM(junior.initial)}<br>${fmtPct(juniorInitialPct)}`,
      `${fmtM(junior.final)}<br>${fmtPct(juniorFinalPct)}`,
    ],
    textposition: "inside" as const,
    insidetextanchor: "middle" as const,
    marker: { color: "#ff4444" },
    hovertemplate:
      "<b>Junior</b><br>Valor: R$ %{y:.1f}M<br>%{text}<extra></extra>",
  };

  const traces: object[] = [juniorTrace];

  // Mezanino trace (middle, yellow) — only if present
  if (mezanino) {
    const mezInitialPct = plInitial > 0 ? (mezanino.initial / plInitial) * 100 : 0;
    const mezFinalPct = plFinal > 0 ? (mezanino.final / plFinal) * 100 : 0;
    traces.push({
      type: "bar" as const,
      name: "Mezanino",
      x: xCategories,
      y: [mezanino.initial / 1_000_000, mezanino.final / 1_000_000],
      text: [
        `${fmtM(mezanino.initial)}<br>${fmtPct(mezInitialPct)}`,
        `${fmtM(mezanino.final)}<br>${fmtPct(mezFinalPct)}`,
      ],
      textposition: "inside" as const,
      insidetextanchor: "middle" as const,
      marker: { color: "#ffb74d" },
      hovertemplate:
        "<b>Mezanino</b><br>Valor: R$ %{y:.1f}M<br>%{text}<extra></extra>",
    });
  }

  // Senior trace (top, green)
  const seniorInitialPct = plInitial > 0 ? (senior.initial / plInitial) * 100 : 0;
  const seniorFinalPct = plFinal > 0 ? (senior.final / plFinal) * 100 : 0;
  traces.push({
    type: "bar" as const,
    name: "Sênior",
    x: xCategories,
    y: [senior.initial / 1_000_000, senior.final / 1_000_000],
    text: [
      `${fmtM(senior.initial)}<br>${fmtPct(seniorInitialPct)}`,
      `${fmtM(senior.final)}<br>${fmtPct(seniorFinalPct)}`,
    ],
    textposition: "inside" as const,
    insidetextanchor: "middle" as const,
    marker: { color: "#4edea3" },
    hovertemplate:
      "<b>Sênior</b><br>Valor: R$ %{y:.1f}M<br>%{text}<extra></extra>",
  });

  return (
    <Plot
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data={traces as any}
      layout={{
        barmode: "stack" as const,
        paper_bgcolor: "#191c1f",
        plot_bgcolor: "#191c1f",
        font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        title: {
          text: "Estrutura de Capital: Antes e Depois",
          font: { color: "#e1e2e7", size: 14, family: "Manrope, sans-serif" },
        },
        margin: { l: 60, r: 40, t: 60, b: 60 },
        showlegend: true,
        legend: {
          x: 0.98,
          y: 0.98,
          xanchor: "right" as const,
          yanchor: "top" as const,
          font: { color: "#e1e2e7", size: 11, family: "Manrope, sans-serif" },
          bgcolor: "rgba(25, 28, 31, 0.8)",
        },
        xaxis: {
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        },
        yaxis: {
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          title: {
            text: "Valor (R$ Milhões)",
            font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
          },
          ticksuffix: "M",
        },
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%", height: "380px" }}
    />
  );
}
