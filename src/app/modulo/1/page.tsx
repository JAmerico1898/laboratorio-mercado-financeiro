import OpeningHero from "@/components/modulo1/OpeningHero";
import CurvePreview from "@/components/modulo1/CurvePreview";
import MethodologyCards from "@/components/modulo1/MethodologyCards";

export const metadata = {
  title: "ETTJ | Laboratório de Mercado Financeiro",
  description: "Modelagem da Estrutura a Termo - Taxa DI (CDI)",
};

export default function Module1Page() {
  return (
    <div className="min-h-screen">
      <OpeningHero />
      <div className="max-w-7xl mx-auto px-6 pb-16 space-y-8">
        <CurvePreview />
        <MethodologyCards />
      </div>
    </div>
  );
}
