export default function DualConstraint() {
  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
      {/* CAR Box */}
      <div className="flex-1 rounded-xl bg-surface-container-low p-4 text-center border border-outline-variant/15"
        style={{ borderTopColor: "#00f2ff", borderTopWidth: 3 }}>
        <h5 className="text-sm font-bold" style={{ color: "#00f2ff" }}>CAR (Ponderado)</h5>
        <p className="mt-2 text-xs text-on-surface-variant">Capital / RWA</p>
        <p className="mt-1 text-lg font-bold text-on-surface">&ge; 10,5%</p>
      </div>

      {/* Plus sign */}
      <span className="text-2xl font-bold text-on-surface-variant">+</span>

      {/* Leverage Box */}
      <div className="flex-1 rounded-xl bg-surface-container-low p-4 text-center border border-outline-variant/15"
        style={{ borderTopColor: "#8b5cf6", borderTopWidth: 3 }}>
        <h5 className="text-sm font-bold" style={{ color: "#8b5cf6" }}>Alavancagem</h5>
        <p className="mt-2 text-xs text-on-surface-variant">Tier 1 / Ativos</p>
        <p className="mt-1 text-lg font-bold text-on-surface">&ge; 3%</p>
      </div>
    </div>
  );
}
