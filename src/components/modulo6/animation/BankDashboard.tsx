import type { BankMetrics } from "@/lib/financial-regulation/types";

interface BankDashboardProps {
  metrics: BankMetrics;
}

function CircleGauge({
  label,
  value,
  unit,
  min,
  target,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  target: number;
}) {
  const percentage = Math.min((value / (target * 1.5)) * 100, 100);
  const dasharray = `${percentage * 2.51} 251`;
  const color = value >= target ? "#4edea3" : value >= min ? "#f59e0b" : "#ff4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="96" height="96" viewBox="0 0 96 96">
        {/* Background circle */}
        <circle
          cx="48" cy="48" r="40"
          fill="none"
          stroke="rgba(225,226,231,0.1)"
          strokeWidth="8"
        />
        {/* Value arc */}
        <circle
          cx="48" cy="48" r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={dasharray}
          transform="rotate(-90 48 48)"
          className="transition-all duration-700"
        />
        {/* Value text */}
        <text x="48" y="44" textAnchor="middle" fill={color} fontSize="16" fontWeight="700">
          {value.toFixed(1)}
        </text>
        <text x="48" y="60" textAnchor="middle" fill="rgba(225,226,231,0.6)" fontSize="10">
          {unit}
        </text>
      </svg>
      <span className="mt-1 text-xs font-medium text-on-surface-variant">{label}</span>
    </div>
  );
}

function MetricCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-lg bg-surface-container-low p-2.5 text-center">
      <p className="text-xs text-on-surface-variant">{label}</p>
      <p className="text-sm font-bold text-on-surface">
        {unit}
        {value.toLocaleString("pt-BR")}M
      </p>
    </div>
  );
}

export default function BankDashboard({ metrics }: BankDashboardProps) {
  const isCompliant = metrics.car >= 10.5 && metrics.leverage >= 3;

  return (
    <div className="rounded-xl bg-surface-container p-4 border border-outline-variant/15 space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-lg text-primary-container">
          monitoring
        </span>
        <h4 className="text-sm font-bold text-on-surface">Painel do Banco</h4>
      </div>

      {/* Gauges */}
      <div className="flex justify-around">
        <CircleGauge label="CAR" value={metrics.car} unit="%" min={8} target={10.5} />
        <CircleGauge label="Alavancagem" value={metrics.leverage} unit="%" min={3} target={3} />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="Capital" value={metrics.capital} unit="R$ " />
        <MetricCard label="Ativos Totais" value={metrics.assets} unit="R$ " />
        <MetricCard label="RWA" value={metrics.rwa} unit="R$ " />
        <MetricCard label="Provisões" value={metrics.provisions} unit="R$ " />
      </div>

      {/* Status */}
      <div
        className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
        style={{
          backgroundColor: isCompliant ? "rgba(78,222,163,0.12)" : "rgba(255,68,68,0.12)",
          color: isCompliant ? "#4edea3" : "#ff4444",
        }}
      >
        <span className="material-symbols-outlined text-base">
          {isCompliant ? "check_circle" : "warning"}
        </span>
        {isCompliant ? "Em Conformidade" : "Atenção Regulatória"}
      </div>
    </div>
  );
}
