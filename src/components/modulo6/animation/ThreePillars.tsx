const pillars = [
  { number: 1, title: "Capital Mínimo", desc: "Requerimentos quantitativos", color: "#00f2ff" },
  { number: 2, title: "Revisão Supervisória", desc: "Avaliação qualitativa", color: "#8b5cf6" },
  { number: 3, title: "Disciplina de Mercado", desc: "Transparência e divulgação", color: "#4edea3" },
];

export default function ThreePillars() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {pillars.map((pillar) => (
        <div
          key={pillar.number}
          className="rounded-xl bg-surface-container-low p-4 text-center border border-outline-variant/15"
          style={{ borderTopColor: pillar.color, borderTopWidth: 3 }}
        >
          <div
            className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: `${pillar.color}20`, color: pillar.color }}
          >
            {pillar.number}
          </div>
          <h5 className="text-sm font-semibold text-on-surface">{pillar.title}</h5>
          <p className="mt-1 text-xs text-on-surface-variant">{pillar.desc}</p>
        </div>
      ))}
    </div>
  );
}
