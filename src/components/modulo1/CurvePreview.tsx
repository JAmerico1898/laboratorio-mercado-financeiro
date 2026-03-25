export default function CurvePreview() {
  return (
    <div className="p-8 glass-panel rounded-3xl min-h-[400px] flex flex-col w-full border border-outline-variant/15">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-xl font-bold text-on-surface">
            Preview da Curva Spot
          </h4>
          <p className="text-xs text-on-surface-variant mt-1">
            Visualização preliminar baseada no último fechamento disponível.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
          </button>
          <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-sm">
              fullscreen
            </span>
          </button>
        </div>
      </div>

      {/* SVG Curve */}
      <div className="flex-grow relative flex items-center justify-center">
        <svg
          className="w-full h-64 overflow-visible"
          viewBox="0 0 1000 200"
        >
          <defs>
            <linearGradient
              id="lineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#4edea3", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#00f2ff", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <path
            d="M0,180 Q250,170 500,100 T1000,40"
            fill="none"
            stroke="url(#lineGradient)"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <circle cx="0" cy="180" r="4" fill="#4edea3" />
          <circle cx="200" cy="175" r="4" fill="#4edea3" />
          <circle cx="500" cy="100" r="4" fill="#00f2ff" />
          <circle cx="800" cy="60" r="4" fill="#00f2ff" />
          <circle cx="1000" cy="40" r="4" fill="#00f2ff" />
        </svg>
        <div className="absolute bottom-0 left-0 text-[10px] text-outline font-bold">
          CURTO PRAZO
        </div>
        <div className="absolute bottom-0 right-0 text-[10px] text-outline font-bold">
          LONGO PRAZO
        </div>
      </div>
    </div>
  );
}
