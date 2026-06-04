"use client";

import { useState } from "react";

// Toca os dois vídeos em sequência (BaaS → Tokenização) e repete o par em loop.
// Cada vídeo roda até o fim (onEnded) e então avança para o próximo; ao terminar
// o segundo, volta ao primeiro. A `key` força o remount do <video> a cada troca,
// garantindo o autoplay do novo src.
const SOURCES = ["/videos/hero_baas.mp4", "/videos/hero-tokenizacao.mp4"];

export default function HeroVideoSequence() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative hidden aspect-video w-full overflow-hidden rounded-2xl border border-outline-variant/40 lg:col-span-3 lg:block">
      <video
        key={current}
        src={SOURCES[current]}
        autoPlay
        muted
        playsInline
        onEnded={() => setCurrent((c) => (c + 1) % SOURCES.length)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/40 via-transparent to-transparent" />
    </div>
  );
}
