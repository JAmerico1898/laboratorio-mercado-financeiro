import Link from "next/link";

interface OpeningHeroProps {
  onStartAnalysis: () => void;
}

export default function OpeningHero({ onStartAnalysis }: OpeningHeroProps) {
  return (
    <section className="relative px-6 md:px-8 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <Link
        href="/"
        className="absolute top-6 left-6 text-on-surface-variant hover:text-primary-container transition-colors z-20 flex items-center gap-1 text-sm"
        aria-label="Voltar"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Voltar
      </Link>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center relative z-10">
        <div className="lg:col-span-2">
          {/* Module badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-sm bg-surface-container-highest text-secondary text-[10px] font-bold tracking-widest uppercase">
              Módulo 2
            </span>
            <div className="h-[1px] w-12 bg-outline-variant/30" />
            <span className="text-on-surface-variant text-sm font-medium tracking-tight">
              Análise Quantitativa de Crédito
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-8 leading-[1.1] text-glow">
            Modelagem de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
              Risco de Crédito
            </span>
          </h1>

          {/* Description with terminal accent */}
          <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-3xl border-l-2 border-primary-container pl-6 mb-8">
            Desenvolvimento de frameworks estatísticos para avaliação da
            perda esperada (PE).
          </p>

          <button
            onClick={onStartAnalysis}
            className="px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold tracking-tight hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,219,231,0.15)]"
          >
            Iniciar Análise
            <span className="material-symbols-outlined text-xl">
              query_stats
            </span>
          </button>
        </div>

        <div className="hidden lg:block lg:col-span-3 relative w-full aspect-video rounded-2xl overflow-hidden border border-outline-variant/10">
          <video
            src="/videos/hero-risco-credito.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
