export default function KineticVisual() {
  const barHeights = [
    "20%",
    "25%",
    "35%",
    "45%",
    "50%",
    "55%",
    "58%",
    "60%",
    "62%",
    "63%",
  ];

  return (
    <div className="relative h-[400px] w-full hidden lg:block">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full opacity-40 blur-[80px] bg-primary-container/20 rounded-full absolute -top-20 -right-20" />
        <div className="w-full h-full glass-panel rounded-3xl overflow-hidden p-8 flex flex-col justify-end border border-outline-variant/15">
          <div className="flex items-end gap-1 h-64">
            {barHeights.map((height, i) => (
              <div
                key={i}
                className="w-full bg-gradient-to-t from-primary-container/40 to-primary-container rounded-t-sm"
                style={{ height }}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-between text-[10px] font-bold text-outline uppercase tracking-tighter">
            <span>1 Mes</span>
            <span>6 Meses</span>
            <span>1 Ano</span>
            <span>5 Anos</span>
            <span>10 Anos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
