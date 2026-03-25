"use client";

import { useEffect, useRef } from "react";
import { SECTIONS } from "@/lib/baas/constants";

interface SectionNavProps {
  activeSection: number;
  onSectionClick: (index: number) => void;
}

export default function SectionNav({ activeSection, onSectionClick }: SectionNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active pill into view
  useEffect(() => {
    if (activeButtonRef.current) {
      activeButtonRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeSection]);

  return (
    <nav className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="Seções do módulo BaaS"
          className="flex items-center gap-1 py-2 overflow-x-auto"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          } as React.CSSProperties}
        >
          {SECTIONS.map((section, i) => {
            const isActive = activeSection === i;
            return (
              <button
                key={section.id}
                ref={isActive ? activeButtonRef : null}
                role="tab"
                aria-selected={isActive}
                aria-controls={`section-panel-${section.id}`}
                onClick={() => onSectionClick(i)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary-container/15 text-primary-container border border-primary-container/30"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 border border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[14px] leading-none">
                  {section.icon}
                </span>
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollbar hiding styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}
