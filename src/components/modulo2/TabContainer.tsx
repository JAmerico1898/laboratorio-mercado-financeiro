"use client";

import { CreditRecord, ModelResults, ProductionResults } from "@/lib/credit-risk";
import ModelAnalysisTab from "./tabs/ModelAnalysisTab";
import ProductionTab from "./tabs/ProductionTab";
import ReferenceTab from "./tabs/ReferenceTab";

type TabKey = "analysis" | "production" | "reference";

interface TabContainerProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  modelResults: ModelResults;
  productionResults: ProductionResults;
  cutoff: number;
  selectedFeatures: string[];
  trainingData: CreditRecord[] | null;
  productionData: CreditRecord[] | null;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "analysis", label: "Análise do Modelo", icon: "monitoring" },
  { key: "production", label: "Produção", icon: "precision_manufacturing" },
  { key: "reference", label: "Referência", icon: "menu_book" },
];

export default function TabContainer({
  activeTab,
  onTabChange,
  modelResults,
  productionResults,
  cutoff,
  selectedFeatures,
  trainingData,
  productionData,
}: TabContainerProps) {
  return (
    <div className="px-4 md:px-8 pb-16">
      {/* Tab headers */}
      <div className="flex gap-1 border-b border-outline-variant/20 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? "border-primary-container text-primary-container"
                : "border-transparent text-outline hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "analysis" && (
        <ModelAnalysisTab
          modelResults={modelResults}
          cutoff={cutoff}
          selectedFeatures={selectedFeatures}
        />
      )}
      {activeTab === "production" && (
        <ProductionTab
          modelResults={modelResults}
          productionResults={productionResults}
          cutoff={cutoff}
        />
      )}
      {activeTab === "reference" && (
        <ReferenceTab
          modelResults={modelResults}
          selectedFeatures={selectedFeatures}
          trainingData={trainingData}
          productionData={productionData}
        />
      )}
    </div>
  );
}
