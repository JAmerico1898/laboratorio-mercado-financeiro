import { calculateRwa } from "../financial-regulation/rwa-calc";
import type { AssetAllocation } from "../financial-regulation/types";

describe("calculateRwa", () => {
  it("returns rwaTotal=0 and well-capitalized for all-cash portfolio", () => {
    const allocation: AssetAllocation = {
      cash: 100, govBonds: 0, mortgages: 0, corpLoans: 0, highYield: 0, unrated: 0,
    };
    const result = calculateRwa(allocation);
    expect(result.rwaTotal).toBe(0);
    expect(result.car).toBe(100); // edge case: rwaTotal=0 → car=100
    expect(result.status).toBe("well-capitalized");
  });

  it("returns undercapitalized for all-unrated portfolio", () => {
    const allocation: AssetAllocation = {
      cash: 0, govBonds: 0, mortgages: 0, corpLoans: 0, highYield: 0, unrated: 100,
    };
    const result = calculateRwa(allocation);
    expect(result.rwaTotal).toBe(150); // 100 * 1.5
    expect(result.car).toBeCloseTo(7.0, 1); // 10.5/150 * 100 = 7%
    expect(result.status).toBe("undercapitalized");
  });

  it("computes correct values for mixed portfolio", () => {
    const allocation: AssetAllocation = {
      cash: 20, govBonds: 15, mortgages: 30, corpLoans: 20, highYield: 10, unrated: 5,
    };
    const result = calculateRwa(allocation);

    // Expected RWA: 0 + 1.5 + 15 + 20 + 12 + 7.5 = 56
    expect(result.rwaTotal).toBeCloseTo(56, 1);
    expect(result.requiredCapital).toBeCloseTo(56 * 0.105, 1);
    expect(result.car).toBeCloseTo((10.5 / 56) * 100, 1); // ~18.75%
    expect(result.status).toBe("well-capitalized");
  });

  it("returns details array with correct labels and contributions", () => {
    const allocation: AssetAllocation = {
      cash: 10, govBonds: 20, mortgages: 0, corpLoans: 0, highYield: 0, unrated: 0,
    };
    const result = calculateRwa(allocation);
    expect(result.details).toHaveLength(6);

    const cashDetail = result.details.find((d) => d.label === "Caixa");
    expect(cashDetail).toBeDefined();
    expect(cashDetail!.rwaContribution).toBe(0);

    const govDetail = result.details.find((d) => d.label === "Títulos Públicos");
    expect(govDetail).toBeDefined();
    expect(govDetail!.rwaContribution).toBe(2); // 20 * 0.1
  });

  it("returns adequate status for CAR between 8 and 10.5", () => {
    // Need rwaTotal such that 8 <= (10.5/rwaTotal)*100 < 10.5
    // 10.5/rwaTotal*100 = 9 → rwaTotal = 10.5/0.09 ≈ 116.67
    // All corpLoans at weight 1.0 → allocation of ~116.67
    const allocation: AssetAllocation = {
      cash: 0, govBonds: 0, mortgages: 0, corpLoans: 116.67, highYield: 0, unrated: 0,
    };
    const result = calculateRwa(allocation);
    expect(result.car).toBeCloseTo(9.0, 0);
    expect(result.status).toBe("adequate");
  });
});
