import {
  computeInvestment,
  computeTTM,
  computeMonthlyRevenue,
  getRiskScore,
  generateRecommendations,
} from "@/lib/baas/simulator";

describe("computeInvestment", () => {
  it("returns base cost for zero services (Parceria Direta)", () => {
    expect(computeInvestment("Parceria Direta", 0)).toBe(500_000);
  });
  it("returns base cost for zero services (Via Middleware)", () => {
    expect(computeInvestment("Via Middleware", 0)).toBe(150_000);
  });
  it("returns base cost for zero services (Banco Nativo API)", () => {
    expect(computeInvestment("Banco Nativo API", 0)).toBe(300_000);
  });
  it("adds 50k per service", () => {
    expect(computeInvestment("Via Middleware", 3)).toBe(300_000);
  });
  it("works for Banco Nativo API with 6 services", () => {
    expect(computeInvestment("Banco Nativo API", 6)).toBe(600_000);
  });
});

describe("computeTTM", () => {
  it("returns base TTM for zero services (Via Middleware)", () => {
    expect(computeTTM("Via Middleware", 0)).toBe(4);
  });
  it("returns base TTM for zero services (Parceria Direta)", () => {
    expect(computeTTM("Parceria Direta", 0)).toBe(12);
  });
  it("returns base TTM for zero services (Banco Nativo API)", () => {
    expect(computeTTM("Banco Nativo API", 0)).toBe(6);
  });
  it("adds 1 month per service", () => {
    expect(computeTTM("Parceria Direta", 3)).toBe(15);
  });
});

describe("computeMonthlyRevenue", () => {
  it("returns all zeros for non-revenue services", () => {
    const r = computeMonthlyRevenue(["Pix"], 100_000, 500);
    expect(r.total).toBe(0);
  });
  it("computes interchange: 100k * 0.015 * 500 * 0.5 = 375k", () => {
    expect(computeMonthlyRevenue(["Cartão de Débito"], 100_000, 500).interchange).toBeCloseTo(375_000);
  });
  it("computes float: 100k * 500 * 0.3 * 0.01 = 150k", () => {
    expect(computeMonthlyRevenue(["Conta de Pagamento"], 100_000, 500).float).toBeCloseTo(150_000);
  });
  it("computes credit: 100k * 0.1 * 2000 * 0.03 = 600k", () => {
    expect(computeMonthlyRevenue(["Crédito/Empréstimo"], 100_000, 500).credit).toBeCloseTo(600_000);
  });
  it("sums all streams", () => {
    const r = computeMonthlyRevenue(["Cartão de Débito", "Conta de Pagamento", "Crédito/Empréstimo"], 100_000, 500);
    expect(r.total).toBeCloseTo(1_125_000);
  });
  it("returns zeros for zero clients", () => {
    expect(computeMonthlyRevenue(["Cartão de Débito"], 0, 500).total).toBe(0);
  });
  it("returns zeros for zero ticket", () => {
    expect(computeMonthlyRevenue(["Cartão de Débito", "Conta de Pagamento"], 100_000, 0).total).toBe(0);
  });
});

describe("getRiskScore", () => {
  it("returns 2 for Parceria Direta", () => {
    expect(getRiskScore("Parceria Direta")).toBe(2);
  });
  it("returns 4 for Via Middleware", () => {
    expect(getRiskScore("Via Middleware")).toBe(4);
  });
  it("returns 2 for Banco Nativo API", () => {
    expect(getRiskScore("Banco Nativo API")).toBe(2);
  });
});

describe("generateRecommendations", () => {
  it("warns direct partnership for middleware + >4 services", () => {
    const r = generateRecommendations("Via Middleware", ["a","b","c","d","e"], 100);
    expect(r.some(s => s.includes("parceria direta"))).toBe(true);
  });
  it("no warning for middleware with <=4 services", () => {
    expect(generateRecommendations("Via Middleware", ["a","b","c","d"], 100).some(s => s.includes("parceria direta"))).toBe(false);
  });
  it("warns about correspondent regulation for credit", () => {
    expect(generateRecommendations("Parceria Direta", ["Crédito/Empréstimo"], 100).some(s => s.includes("correspondente"))).toBe(true);
  });
  it("suggests own infra for volume > 500", () => {
    expect(generateRecommendations("Parceria Direta", ["Pix"], 501).some(s => s.includes("infraestrutura própria"))).toBe(true);
  });
  it("returns empty when no conditions match", () => {
    expect(generateRecommendations("Parceria Direta", ["Pix"], 100)).toHaveLength(0);
  });
  it("returns 3 when all conditions match", () => {
    expect(generateRecommendations("Via Middleware", ["a","b","c","d","e","Crédito/Empréstimo"], 600)).toHaveLength(3);
  });
});
