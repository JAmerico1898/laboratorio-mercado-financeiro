"use client";

import { useState } from "react";

export default function AnimacaoModule() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-on-surface">
            Fluxo Operacional — FIDC Monocedente
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Visualização 3D interativa do ciclo operacional de um FIDC, do
            cenário inicial ao recebimento. Use os botões &quot;Anterior&quot; e
            &quot;Próximo Passo&quot; para navegar pelas etapas.
          </p>
        </div>
        <a
          href="/animations/fidc-flow.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary-container hover:underline shrink-0"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          Abrir em nova aba
        </a>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-outline-variant/15">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container z-10">
            <div className="flex items-center gap-2 text-outline-variant">
              <div className="w-5 h-5 border-2 border-primary-container/30 border-t-primary-container rounded-full animate-spin" />
              <span className="text-sm">Carregando cenário 3D...</span>
            </div>
          </div>
        )}
        <iframe
          src="/animations/fidc-flow.html"
          sandbox="allow-scripts"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full min-h-[600px] md:min-h-[600px] border-0"
          title="Animação 3D do fluxo operacional de um FIDC monocedente"
        />
      </div>
    </div>
  );
}
