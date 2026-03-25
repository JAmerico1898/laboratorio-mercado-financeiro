import { calculateProvisioning } from "../financial-regulation/provisioning-calc";
import type { ProvisioningParams } from "../financial-regulation/types";

describe("calculateProvisioning", () => {
  const baseParams: ProvisioningParams = {
    portfolio: 100,
    interestRate: 10,
    scenario: "Boom",
    model: "Res2682",
  };

  it("Boom + Res2682 → all provisions are 0", () => {
    const result = calculateProvisioning({ ...baseParams, scenario: "Boom", model: "Res2682" });
    result.years.forEach((y) => {
      expect(y.provision).toBe(0);
    });
    expect(result.cumProvisions).toBe(0);
    expect(result.calloutKey).toBe("non-recession-2682");
  });

  it("Boom + Res4966 → provisions equal base IFRS9 rate each year", () => {
    const result = calculateProvisioning({ ...baseParams, scenario: "Boom", model: "Res4966" });
    result.years.forEach((y) => {
      expect(y.provision).toBeCloseTo(1, 1); // 100 * 0.01 = 1
    });
    expect(result.cumProvisions).toBeCloseTo(5, 1);
    expect(result.calloutKey).toBe("non-recession-4966");
  });

  it("Recessão + Res2682 → back-loaded (first year = 0)", () => {
    const result = calculateProvisioning({
      ...baseParams,
      scenario: "Recessão",
      model: "Res2682",
    });
    expect(result.years[0].provision).toBe(0);
    // Last year should have the largest provision
    const lastProvision = result.years[4].provision;
    expect(lastProvision).toBeGreaterThan(result.years[1].provision);
    expect(result.calloutKey).toBe("recession-2682");
  });

  it("Recessão + Res4966 → front-loaded (first year is largest)", () => {
    const result = calculateProvisioning({
      ...baseParams,
      scenario: "Recessão",
      model: "Res4966",
    });
    const firstProvision = result.years[0].provision;
    const lastProvision = result.years[4].provision;
    expect(firstProvision).toBeGreaterThan(lastProvision);
    expect(result.calloutKey).toBe("recession-4966");
  });

  it("verifies cumulative sums are consistent", () => {
    const result = calculateProvisioning({
      ...baseParams,
      scenario: "Recessão",
      model: "Res4966",
    });
    const sumProvisions = result.years.reduce((s, y) => s + y.provision, 0);
    const sumProfit = result.years.reduce((s, y) => s + y.netProfit, 0);
    expect(result.cumProvisions).toBeCloseTo(sumProvisions, 1);
    expect(result.cumProfit).toBeCloseTo(sumProfit, 1);
  });

  it("interest is constant across years", () => {
    const result = calculateProvisioning(baseParams);
    result.years.forEach((y) => {
      expect(y.interest).toBeCloseTo(10, 1); // 100 * 10/100
    });
  });

  it("netProfit = interest - provision each year", () => {
    const result = calculateProvisioning({
      ...baseParams,
      scenario: "Recessão",
      model: "Res4966",
    });
    result.years.forEach((y) => {
      expect(y.netProfit).toBeCloseTo(y.interest - y.provision, 1);
    });
  });
});
