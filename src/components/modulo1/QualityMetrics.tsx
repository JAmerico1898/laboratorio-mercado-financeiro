"use client";

import { QualityMetrics as QualityMetricsType } from "@/lib/types";
import { QUALITY_THRESHOLD_R2 } from "@/lib/constants";

interface QualityMetricsProps {
  metrics: QualityMetricsType;
}

export default function QualityMetricsPanel({ metrics }: QualityMetricsProps) {
  const isGoodRmse = metrics.rmse < 0.001;
  const isGoodR2 = metrics.r2 > QUALITY_THRESHOLD_R2;

  const cards = [
    {
      label: "RMSE",
      value: `${(metrics.rmse * 100).toFixed(4)}%`,
      good: isGoodRmse,
    },
    {
      label: "MAE",
      value: `${(metrics.mae * 100).toFixed(4)}%`,
      good: isGoodRmse, // same threshold logic
    },
    {
      label: "R\u00B2",
      value: metrics.r2.toFixed(6),
      good: isGoodR2,
    },
    {
      label: "ERRO M\u00C1X",
      value: `${(metrics.maxError * 100).toFixed(4)}%`,
      good: metrics.maxError < 0.001,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="glass-panel p-4 rounded-lg text-center">
          <div className="text-xs text-outline uppercase tracking-wider mb-2">
            {card.label}
          </div>
          <div
            className={`text-2xl font-bold ${
              card.good ? "text-secondary" : "text-on-surface"
            }`}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
