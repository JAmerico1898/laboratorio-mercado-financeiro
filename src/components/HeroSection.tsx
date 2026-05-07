export default function HeroSection() {
  return (
    <header className="relative w-full overflow-hidden cyber-river px-4 sm:px-6 pt-12 pb-12 md:pt-20 md:pb-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center">
        <div className="z-10 lg:col-span-2 text-center lg:text-left">
          <span className="font-label text-xs sm:text-sm uppercase tracking-[0.4em] text-secondary font-semibold opacity-80">
            Explorando
          </span>
          <h1 className="mt-4 font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95] text-primary break-words">
            Intermediação e Desintermediação{" "}
            <span className="gradient-text">Financeira</span>
          </h1>
          <p className="mt-6 font-body text-on-surface-variant text-base md:text-lg leading-relaxed opacity-80 max-w-xl lg:max-w-none mx-auto lg:mx-0">
            Explore os fundamentos e as inovações do mercado financeiro com
            análises objetivas e aplicadas.
          </p>
        </div>

        <div className="lg:col-span-3 relative w-full aspect-video rounded-2xl overflow-hidden border border-outline-variant/10 bg-black">
          <video
            src="/videos/hero-landing-page.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
