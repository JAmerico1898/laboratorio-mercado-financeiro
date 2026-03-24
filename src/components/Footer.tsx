export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/30 bg-slate-900/50 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center px-8 py-12 mt-20">
      <p className="text-xs uppercase tracking-widest text-slate-500">
        &copy; 2026 Laboratório de Mercado Financeiro &mdash; Prof. José
        Américo &mdash; COPPEAD-FGV-UCAM
      </p>
      <p className="text-xs uppercase tracking-widest text-slate-500 mt-4 md:mt-0">
        Dúvidas? Sugestões? Entre em contato!
      </p>
    </footer>
  );
}
