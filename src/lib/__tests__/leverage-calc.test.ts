import { calculateLeverage } from "../financial-regulation/leverage-calc";

describe("calculateLeverage", () => {
  it("returns both-ok when both ratios pass", () => {
    const result = calculateLeverage({ capital: 150, totalAssets: 1000, rwaPercent: 70 });
    // rwa = 700, car = 150/700*100 ≈ 21.4, leverage = 15
    expect(result.rwa).toBeCloseTo(700, 0);
    expect(result.car).toBeCloseTo(21.4, 1);
    expect(result.leverage).toBeCloseTo(15, 1);
    expect(result.status).toBe("both-ok");
  });

  it("returns car-violation when only CAR fails", () => {
    const result = calculateLeverage({ capital: 50, totalAssets: 1500, rwaPercent: 70 });
    // rwa = 1050, car = 50/1050*100 ≈ 4.76, leverage = 50/1500*100 ≈ 3.33
    expect(result.car).toBeCloseTo(4.76, 1);
    expect(result.leverage).toBeCloseTo(3.33, 1);
    expect(result.status).toBe("car-violation");
  });

  it("returns leverage-violation when only leverage fails", () => {
    const result = calculateLeverage({ capital: 100, totalAssets: 5000, rwaPercent: 15 });
    // rwa = 750, car = 100/750*100 ≈ 13.3, leverage = 100/5000*100 = 2
    expect(result.car).toBeCloseTo(13.3, 1);
    expect(result.leverage).toBeCloseTo(2, 1);
    expect(result.status).toBe("leverage-violation");
  });

  it("returns both-violation when both fail", () => {
    const result = calculateLeverage({ capital: 30, totalAssets: 5000, rwaPercent: 50 });
    // rwa = 2500, car = 30/2500*100 = 1.2, leverage = 30/5000*100 = 0.6
    expect(result.car).toBeCloseTo(1.2, 1);
    expect(result.leverage).toBeCloseTo(0.6, 1);
    expect(result.status).toBe("both-violation");
  });

  it("handles rwaPercent = 0 (car = 0)", () => {
    const result = calculateLeverage({ capital: 100, totalAssets: 1000, rwaPercent: 0 });
    expect(result.rwa).toBe(0);
    expect(result.car).toBe(0);
    expect(result.leverage).toBe(10);
    expect(result.status).toBe("car-violation");
  });
});
