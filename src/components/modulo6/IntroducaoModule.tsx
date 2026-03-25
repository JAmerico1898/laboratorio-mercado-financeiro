"use client";

export default function IntroducaoModule() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left column — balance sheet image */}
        <div>
          <img
            src="https://www.datocms-assets.com/17507/1606822567-balancopatrimonialestruturaeelementos.png"
            alt="Balanço Patrimonial Simplificado"
            className="rounded-xl w-full"
          />
        </div>

        {/* Right column — educational content */}
        <div className="glass-panel rounded-xl p-6 border border-outline-variant/10">
          <h2 className="text-xl font-bold text-on-surface mb-4">
            Por que os bancos precisam de capital?
          </h2>

          <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
            <p>
              O capital próprio funciona como um{" "}
              <strong className="text-on-surface">amortecedor</strong> contra
              perdas inesperadas.
            </p>

            <p>
              Em 2008, muitos bancos tinham capital insuficiente para absorver as
              perdas com hipotecas subprime &rarr;{" "}
              <strong className="text-on-surface">
                crise financeira global
              </strong>
              .
            </p>

            <div>
              <p className="mb-2">
                Os{" "}
                <strong className="text-on-surface">
                  Acordos de Basileia
                </strong>{" "}
                (I, II, III e IV) foram criados pelo Comitê de Basileia para:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Garantir que os bancos tenham capital suficiente</li>
                <li>Reduzir o risco de falências bancárias</li>
                <li>Proteger depositantes e a economia</li>
              </ul>
            </div>

            <p>
              Neste módulo você vai{" "}
              <strong className="text-on-surface">aprender fazendo</strong>:
              construindo portfólios, simulando crises e gerenciando bancos
              virtuais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
