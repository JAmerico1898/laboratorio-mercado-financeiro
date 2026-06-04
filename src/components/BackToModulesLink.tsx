import Link from "next/link";

// Link "Voltar aos módulos" reutilizado no topo dos heroes de todos os módulos.
export default function BackToModulesLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:opacity-70"
    >
      <span className="material-symbols-outlined text-sm">arrow_back</span>
      <span className="text-xs uppercase tracking-widest">Voltar aos módulos</span>
    </Link>
  );
}
