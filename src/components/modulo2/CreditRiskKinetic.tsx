export default function CreditRiskKinetic() {
  // Sigmoid-shaped bar heights: low → steep rise → plateau
  const barHeights = [
    "5%", "6%", "8%", "12%", "20%",
    "35%", "55%", "72%", "82%", "88%",
    "92%", "94%", "95%",
  ];

  return (
    <div className="relative h-[400px] w-full hidden lg:block">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full opacity-40 blur-[80px] bg-secondary/20 rounded-full absolute -top-20 -right-20" />
        <div className="w-full h-full glass-panel rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-outline-variant/15">
          <div className="text-[10px] uppercase tracking-widest font-bold text-outline mb-4">
            Curva Sigmóide — P(inadimplência)
          </div>
          <div className="flex items-end gap-1 h-64">
            {barHeights.map((height, i) => (
              <div
                key={i}
                className="w-full rounded-t-sm"
                style={{
                  height,
                  background: `linear-gradient(to top, ${
                    i < 5
                      ? "rgba(78,222,163,0.4), rgba(78,222,163,0.8)"
                      : i < 8
                      ? "rgba(0,242,255,0.4), rgba(0,242,255,0.8)"
                      : "rgba(255,100,100,0.4), rgba(255,100,100,0.8)"
                  })`,
                }}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-between text-[10px] font-bold text-outline uppercase tracking-tighter">
            <span>Baixo Risco</span>
            <span>Médio</span>
            <span>Alto Risco</span>
          </div>
        </div>
      </div>
    </div>
  );
}
