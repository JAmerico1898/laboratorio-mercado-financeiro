"use client";

export default function FidcKinetic() {
  return (
    <div className="relative h-[400px] w-full hidden lg:block">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full opacity-40 blur-[80px] bg-primary-container/20 rounded-full absolute -top-20 -right-20" />
        <div className="w-full h-full glass-panel rounded-3xl overflow-hidden p-8 flex flex-col justify-between border border-outline-variant/15">
          {/* FIDC Flow Diagram */}
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-xl bg-[#1e3a5f] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(0,242,255,0.15)]">
                🏪
              </div>
              <span className="text-[9px] text-outline-variant font-bold uppercase tracking-wide">
                Cedente
              </span>
            </div>
            <div className="flex-1 mx-3 h-[2px] bg-gradient-to-r from-primary-container/60 to-primary-container/20 relative">
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-xl bg-[#3a2a1f] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(255,140,0,0.15)]">
                🏦
              </div>
              <span className="text-[9px] text-outline-variant font-bold uppercase tracking-wide">
                FIDC
              </span>
            </div>
            <div className="flex-1 mx-3 h-[2px] bg-gradient-to-r from-secondary/60 to-secondary/20 relative">
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-xl bg-[#1f3a2a] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(78,222,163,0.15)]">
                👥
              </div>
              <span className="text-[9px] text-outline-variant font-bold uppercase tracking-wide">
                Sacados
              </span>
            </div>
          </div>

          {/* Waterfall Bars */}
          <div className="flex items-end gap-1 h-32 mt-4">
            {[
              { h: "70%", color: "from-secondary/40 to-secondary" },
              { h: "50%", color: "from-[#ff8c00]/40 to-[#ff8c00]" },
              { h: "30%", color: "from-[#ff4444]/40 to-[#ff4444]" },
              { h: "80%", color: "from-secondary/40 to-secondary" },
              { h: "55%", color: "from-[#ff8c00]/40 to-[#ff8c00]" },
              { h: "25%", color: "from-[#ff4444]/40 to-[#ff4444]" },
              { h: "85%", color: "from-secondary/40 to-secondary" },
              { h: "60%", color: "from-[#ff8c00]/40 to-[#ff8c00]" },
              { h: "20%", color: "from-[#ff4444]/40 to-[#ff4444]" },
            ].map((bar, i) => (
              <div
                key={i}
                className={`w-full bg-gradient-to-t ${bar.color} rounded-t-sm`}
                style={{ height: bar.h }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-tighter mt-2">
            <span>Sênior</span>
            <span>Mezanino</span>
            <span>Subordinada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
