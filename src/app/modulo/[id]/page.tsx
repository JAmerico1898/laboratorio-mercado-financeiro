import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { modules } from "@/data/modules";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return modules.map((mod) => ({ id: String(mod.id) }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const mod = modules.find((m) => m.id === Number(id));
  if (!mod) return { title: "Módulo não encontrado" };
  return {
    title: `${mod.title} | Laboratório de Mercado Financeiro`,
    description: mod.description,
  };
}

export default async function ModuloPage({ params }: Props) {
  const { id } = await params;

  if (id === "1") redirect("/modulo/1");
  if (id === "3") redirect("/modulo/3");
  if (id === "4") redirect("/modulo/4");
  if (id === "6") redirect("/modulo/6");

  const mod = modules.find((m) => m.id === Number(id));

  if (!mod) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <div className="glass-panel p-12 rounded-xl border border-outline-variant/10">
        <span className="material-symbols-outlined text-primary-container text-6xl mb-6 block">
          {mod.icon}
        </span>
        <h1 className="font-headline text-4xl font-bold text-primary mb-4">
          {mod.title}
        </h1>
        <p className="text-on-surface-variant text-lg mb-8">
          {mod.description}
        </p>
        <div className="inline-block glass-panel px-6 py-3 rounded-lg border border-primary-container/20 text-secondary font-semibold text-sm uppercase tracking-wider">
          Em breve
        </div>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 mt-8 text-secondary hover:text-primary-container transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Voltar
      </Link>
    </div>
  );
}
