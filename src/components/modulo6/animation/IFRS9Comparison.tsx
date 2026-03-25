const scenarios = [
  { period: "Expansão", ias39: 10, ifrs9: 25 },
  { period: "Normal", ias39: 15, ifrs9: 30 },
  { period: "Recessão", ias39: 80, ifrs9: 45 },
];

const MAX_BAR = 80;

export default function IFRS9Comparison() {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-on-surface mb-3">
        Provisão como % do Portfólio
      </h4>

      <div className="space-y-4">
        {scenarios.map((s) => (
          <div key={s.period}>
            <span className="text-xs font-medium text-on-surface-variant">{s.period}</span>
            <div className="mt-1 space-y-1.5">
              {/* IAS 39 */}
              <div className="flex items-center gap-2">
                <span className="w-14 text-right text-xs text-on-surface-variant">IAS 39</span>
                <div className="flex-1 h-4 rounded bg-surface-container-low overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-700"
                    style={{
                      width: `${(s.ias39 / MAX_BAR) * 100}%`,
                      backgroundColor: "#f59e0b",
                    }}
                  />
                </div>
                <span className="w-10 text-xs text-on-surface-variant">{s.ias39}%</span>
              </div>
              {/* IFRS 9 */}
              <div className="flex items-center gap-2">
                <span className="w-14 text-right text-xs text-on-surface-variant">IFRS 9</span>
                <div className="flex-1 h-4 rounded bg-surface-container-low overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-700"
                    style={{
                      width: `${(s.ifrs9 / MAX_BAR) * 100}%`,
                      backgroundColor: "#4edea3",
                    }}
                  />
                </div>
                <span className="w-10 text-xs text-on-surface-variant">{s.ifrs9}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#f59e0b" }} />
          IAS 39 (Perda Incorrida)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#4edea3" }} />
          IFRS 9 (Perda Esperada)
        </span>
      </div>
    </div>
  );
}
