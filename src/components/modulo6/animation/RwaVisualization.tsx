const assets = [
  { label: "Caixa", value: 100, riskWeight: 0, color: "#4edea3" },
  { label: "Títulos Soberanos", value: 200, riskWeight: 20, color: "#00f2ff" },
  { label: "Hipotecas", value: 250, riskWeight: 50, color: "#8b5cf6" },
  { label: "Corporativo", value: 300, riskWeight: 100, color: "#f59e0b" },
  { label: "Alto Risco", value: 100, riskWeight: 150, color: "#ef4444" },
  { label: "Sem Rating", value: 50, riskWeight: 150, color: "#dc2626" },
];

const MAX_VALUE = 400;

export default function RwaVisualization() {
  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-semibold text-on-surface">Ponderação por Risco</h4>
      {assets.map((asset) => {
        const widthPct = Math.min((asset.value / MAX_VALUE) * 100, 100);
        const rwaValue = (asset.value * asset.riskWeight) / 100;
        return (
          <div key={asset.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface font-medium">{asset.label}</span>
              <span className="text-on-surface-variant">
                Peso: {asset.riskWeight}% | R$ {rwaValue}M
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-surface-container-low overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: asset.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
