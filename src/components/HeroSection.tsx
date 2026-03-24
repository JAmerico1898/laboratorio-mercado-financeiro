import Image from "next/image";

export default function HeroSection() {
  return (
    <header className="relative w-full min-h-[819px] flex flex-col items-center justify-center px-6 cyber-river overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ1eWTAJll7K4yA_GoGWKXeoLUgtxZlgBqXeUILgANkg-tzhE4YUYrnQ65wlkMNGE2IkiN7aNvZBNZfQrz8vyLkigdDTSNxMVZtbmENiHkzLWc05GSA14al10iW1feEQtqlvalbmV2pFJT2v3nTDBzL-H0BmBhfmjfwu3FOdbacQrYM_mT8L9A-Q38E9o9c9xovsk4eEFditU32j67KJsfB8oObZDhB-4L3XSsfg5WvoVfRCwSZvtN_2r31K08koXAG3nbFa0MLg8"
          alt="Digital data streams"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
        <span className="font-label text-sm uppercase tracking-[0.4em] text-secondary font-semibold opacity-80">
          Explorando
        </span>
        <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.9] text-primary">
          A Ciência da <br />
          <span className="gradient-text">Intermediação</span>
        </h1>
        <p className="font-body text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-80">
          Explore os fundamentos e as inovações do mercado financeiro com
          análises objetivas e aplicadas.
        </p>
      </div>
    </header>
  );
}
