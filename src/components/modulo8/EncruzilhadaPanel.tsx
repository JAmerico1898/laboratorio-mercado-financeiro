import type { Branch } from "@/data/regulacao-cenarios/types";
import SafeHtml from "./SafeHtml";

interface EncruzilhadaPanelProps {
  prompt: string;
  branches: Branch[];
  chosen: "A" | "B" | "C" | null;
  onChoose: (id: "A" | "B" | "C") => void;
}

export default function EncruzilhadaPanel({ prompt, branches, chosen, onChoose }: EncruzilhadaPanelProps) {
  return (
    <section className="rounded-2xl border-2 border-[#c2592e]/40 bg-surface-container-lowest p-6 shadow-sm sm:p-7">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c2592e]">
        Encruzilhada — Escolha sua decisão
      </h2>
      <p className="mb-5 mt-1 text-[15px] leading-relaxed text-on-surface">{prompt}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {branches.map((b) => {
          const active = chosen === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onChoose(b.id)}
              aria-pressed={active}
              className={`flex flex-col gap-3 rounded-xl border p-5 text-left transition-all ${
                active
                  ? "border-primary bg-[#dcebf8] shadow-md"
                  : "border-outline-variant bg-surface-container-lowest hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-base font-bold ${
                  active ? "bg-primary text-on-primary" : "bg-surface-container-high text-primary"
                }`}
              >
                {b.id}
              </span>
              <span className="font-bold text-primary">{b.title}</span>
              <SafeHtml
                html={b.summary}
                className="text-sm leading-relaxed text-on-surface-variant [&_em]:not-italic [&_em]:font-medium"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
