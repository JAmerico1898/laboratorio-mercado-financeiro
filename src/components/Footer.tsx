import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/30 bg-slate-900/50 backdrop-blur-xl flex flex-col items-center px-8 py-12 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
        <p className="text-xs uppercase tracking-widest text-slate-300 text-center md:text-left">
          &copy; 2026 Laboratório de Mercado Financeiro
          <br />
          Prof. José Américo &mdash; COPPEAD-FGV-UCAM
        </p>
        <Link
          href="/contato"
          className="text-xs uppercase tracking-widest text-slate-300 hover:text-primary transition-colors text-center md:text-right"
        >
          Dúvidas, Erros, Sugestões?
          <br />
          Entre em contato!
        </Link>
      </div>
    </footer>
  );
}
