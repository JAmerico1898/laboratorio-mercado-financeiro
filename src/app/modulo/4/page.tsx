"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import OpeningHero from "@/components/modulo4/OpeningHero";
import SectionNav from "@/components/modulo4/SectionNav";
import IntroducaoSection from "@/components/modulo4/sections/IntroducaoSection";
import EcossistemaSection from "@/components/modulo4/sections/EcossistemaSection";
import ModelosNegocioSection from "@/components/modulo4/sections/ModelosNegocioSection";
import ServicosSection from "@/components/modulo4/sections/ServicosSection";
import RegulacaoSection from "@/components/modulo4/sections/RegulacaoSection";
import RiscosSection from "@/components/modulo4/sections/RiscosSection";
import OportunidadesSection from "@/components/modulo4/sections/OportunidadesSection";
import CenarioGlobalSection from "@/components/modulo4/sections/CenarioGlobalSection";
import SimuladorSection from "@/components/modulo4/sections/SimuladorSection";
import QuizSection from "@/components/modulo4/sections/QuizSection";

export default function Module4Page() {
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // IntersectionObserver to track active section on scroll
  useEffect(() => {
    if (!showContent) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(
              entry.target as HTMLElement
            );
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [showContent]);

  const handleStartJourney = useCallback(() => {
    setShowContent(true);
    setTimeout(() => {
      sectionRefs.current[0]?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const handleSectionClick = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const setSectionRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      sectionRefs.current[index] = el;
    },
    []
  );

  return (
    <div className="min-h-screen">
      <OpeningHero onStartJourney={handleStartJourney} />

      {showContent && (
        <>
          <SectionNav
            activeSection={activeSection}
            onSectionClick={handleSectionClick}
          />

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-16">
            <IntroducaoSection ref={setSectionRef(0)} />
            <EcossistemaSection ref={setSectionRef(1)} />
            <ModelosNegocioSection ref={setSectionRef(2)} />
            <ServicosSection ref={setSectionRef(3)} />
            <RegulacaoSection ref={setSectionRef(4)} />
            <RiscosSection ref={setSectionRef(5)} />
            <OportunidadesSection ref={setSectionRef(6)} />
            <CenarioGlobalSection ref={setSectionRef(7)} />
            <SimuladorSection ref={setSectionRef(8)} />
            <QuizSection ref={setSectionRef(9)} />
          </div>
        </>
      )}
    </div>
  );
}
