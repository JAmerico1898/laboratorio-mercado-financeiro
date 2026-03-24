"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import type { RegistrationTimeline } from "@/lib/fidc/types";

interface TimelineChartProps {
  timeline: RegistrationTimeline;
}

function formatDatePtBR(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export default function TimelineChart({ timeline }: TimelineChartProps) {
  const { milestones } = timeline;

  const colors = [
    "#00f2ff",
    "#4edea3",
    "#8bc34a",
    "#ff8c00",
    "#9c27b0",
  ];

  const xDates = milestones.map((m) => m.date);
  const yValues = milestones.map(() => 0);
  const labels = milestones.map(
    (m) => `${m.label}<br>${formatDatePtBR(m.date)}<br>+${m.daysFromStart}d`
  );
  const markerColors = milestones.map((_, i) => colors[i % colors.length]);

  // Alternate label positions above/below the line to prevent overlap
  const textPositions = milestones.map((_, i) =>
    i % 2 === 0 ? "top center" : "bottom center"
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traces: any[] = [
    // Horizontal baseline connecting milestones
    {
      type: "scatter",
      mode: "lines",
      x: xDates,
      y: yValues,
      line: { color: "#3a494b", width: 2 },
      hoverinfo: "skip",
      showlegend: false,
    },
    // Milestone markers
    {
      type: "scatter",
      mode: "markers+text",
      x: xDates,
      y: yValues,
      text: labels,
      textposition: textPositions,
      textfont: {
        color: "#e1e2e7",
        family: "Manrope, sans-serif",
        size: 11,
      },
      marker: {
        size: 14,
        color: markerColors,
        line: { color: "#191c1f", width: 2 },
      },
      hovertemplate: milestones.map(
        (m) => `<b>${m.label}</b><br>${formatDatePtBR(m.date)}<br>Dia +${m.daysFromStart}<extra></extra>`
      ),
      showlegend: false,
    },
  ];

  return (
    <Plot
      data={traces}
      layout={{
        paper_bgcolor: "#191c1f",
        plot_bgcolor: "#191c1f",
        font: { color: "#e1e2e7", family: "Manrope, sans-serif" },
        title: {
          text: `Cronograma de Registro — ${timeline.totalDays} dias`,
          font: { color: "#e1e2e7", size: 14, family: "Manrope, sans-serif" },
        },
        margin: { l: 40, r: 40, t: 60, b: 40 },
        showlegend: false,
        xaxis: {
          type: "date" as const,
          gridcolor: "#3a494b",
          zerolinecolor: "#3a494b",
          tickfont: { color: "#9ca3af", family: "Manrope, sans-serif", size: 11 },
          tickformat: "%d/%m/%y",
        },
        yaxis: {
          visible: false,
          range: [-1, 1],
          fixedrange: true,
        },
        height: 260,
      }}
      config={{ responsive: true, displayModeBar: false }}
      style={{ width: "100%" }}
    />
  );
}
