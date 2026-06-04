import SafeHtml from "./SafeHtml";

interface ContextPanelProps {
  context: string;
}

export default function ContextPanel({ context }: ContextPanelProps) {
  return (
    <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:p-7">
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
        Contexto
      </h2>
      <SafeHtml
        as="p"
        html={context}
        className="text-[15px] leading-relaxed text-on-surface [&_em]:text-secondary [&_em]:not-italic [&_em]:font-medium"
      />
    </section>
  );
}
