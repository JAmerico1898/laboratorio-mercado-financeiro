import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="relative w-full flex items-center justify-start px-6 py-8 max-w-7xl mx-auto">
      <Link
        href="/"
        className="text-xl font-bold tracking-tighter text-slate-100 font-headline"
      >
        Laboratório de Mercado Financeiro
      </Link>
    </nav>
  );
}
