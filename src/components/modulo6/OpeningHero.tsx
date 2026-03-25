"use client";

interface OpeningHeroProps {
  onStartJourney: () => void;
}

export default function OpeningHero({ onStartJourney }: OpeningHeroProps) {
  return (
    <section className="relative px-6 md:px-8 pt-24 pb-16 overflow-hidden">
      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          {/* badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-sm bg-surface-container-highest text-secondary text-[10px] font-bold tracking-widest uppercase">
              Módulo 6
            </span>
            <div className="h-[1px] w-12 bg-outline-variant/30" />
            <span className="text-on-surface-variant text-sm font-medium tracking-tight">
              Regulação Bancária
            </span>
          </div>
          {/* title */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-primary mb-6 leading-[1.1]">
            Regulação{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary">
              Bancária
            </span>
          </h1>
          {/* description */}
          <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl border-l-2 border-primary-container/30 pl-4 mb-8">
            Explore os fundamentos da regulação bancária — dos Acordos de Basileia I ao IV, passando por
            análises de capital regulatório, alavancagem, provisões e uma simulação completa de gestão
            bancária. Aprenda na prática como os requisitos de capital protegem depositantes e a
            estabilidade do sistema financeiro.
          </p>
          {/* CTA button */}
          <button
            onClick={onStartJourney}
            className="px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold tracking-tight hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,219,231,0.15)]"
          >
            Iniciar Jornada
            <span className="material-symbols-outlined text-xl">rocket_launch</span>
          </button>
        </div>

        {/* Decorative kinetic element */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative animate-float">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary-container/20 to-secondary/10 blur-xl" />
            {/* Glass panel */}
            <div className="relative w-64 h-64 rounded-3xl bg-surface-container/40 backdrop-blur-xl border border-outline-variant/15 flex flex-col items-center justify-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <span className="material-symbols-outlined text-7xl text-primary-container">
                verified_user
              </span>
              <span className="text-on-surface-variant text-sm font-semibold tracking-wide uppercase">
                Basileia I–IV
              </span>
              {/* Accent bar */}
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* Float animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
