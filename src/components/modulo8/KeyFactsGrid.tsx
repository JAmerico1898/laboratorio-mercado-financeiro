import type { KeyFact, Tone } from "@/data/regulacao-cenarios/types";

const toneStyles: Record<Tone, string> = {
  default: "border-outline-variant bg-[#eaf3ee]",
  positive: "border-[#bfe6d2] bg-[#e9f6ef]",
  warning: "border-[#f0d6cf] bg-[#fbf0ee]",
};

const valueTone: Record<Tone, string> = {
  default: "text-primary",
  positive: "text-[#1c7a57]",
  warning: "text-[#b23a2e]",
};

function KeyFactTile({ fact }: { fact: KeyFact }) {
  const tone = fact.tone ?? "default";
  return (
    <div className={`rounded-xl border p-4 ${toneStyles[tone]}`}>
      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
        {fact.label}
      </div>
      <div className={`text-base font-bold leading-snug ${valueTone[tone]}`}>{fact.value}</div>
    </div>
  );
}

export default function KeyFactsGrid({ facts }: { facts: KeyFact[] }) {
  return (
    <section>
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
        Fatos-chave
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f, i) => (
          <KeyFactTile key={i} fact={f} />
        ))}
      </div>
    </section>
  );
}
