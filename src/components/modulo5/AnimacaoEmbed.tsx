"use client";
import { useState } from "react";

export default function AnimacaoEmbed() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative rounded-2xl overflow-hidden border border-outline-variant/15 bg-surface-container">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container z-10">
          <div className="flex items-center gap-2 text-outline-variant">
            <div className="w-5 h-5 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin" />
            <span className="text-sm">Carregando animação...</span>
          </div>
        </div>
      )}
      <iframe
        src="/animations/tokenization-journey.html"
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="w-full min-h-[700px] border-0"
        title="Jornada da Tokenização — Animação Interativa"
      />
      <noscript><p className="p-4 text-on-surface-variant">Animação interativa mostrando as 8 etapas da jornada de tokenização de ativos.</p></noscript>
    </div>
  );
}
