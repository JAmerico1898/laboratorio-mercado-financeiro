import { fit, transform, fitTransform } from "../credit-risk/standardization";

describe("standardization", () => {
  describe("fit", () => {
    it("computes correct means and stds for known data", () => {
      const data = [
        [1, 10],
        [3, 20],
        [5, 30],
      ];
      const params = fit(data);
      expect(params.means[0]).toBeCloseTo(3, 10);
      expect(params.means[1]).toBeCloseTo(20, 10);
      // population std of [1,3,5] = sqrt(((1-3)^2+(3-3)^2+(5-3)^2)/3) = sqrt(8/3) ≈ 1.6330
      expect(params.stds[0]).toBeCloseTo(Math.sqrt(8 / 3), 10);
      // population std of [10,20,30] = sqrt(200/3) ≈ 8.1650
      expect(params.stds[1]).toBeCloseTo(Math.sqrt(200 / 3), 10);
    });

    it("handles zero-variance column by setting std to 1", () => {
      const data = [
        [5, 1],
        [5, 2],
        [5, 3],
      ];
      const params = fit(data);
      expect(params.means[0]).toBeCloseTo(5, 10);
      expect(params.stds[0]).toBe(1); // zero variance → 1
    });

    it("returns empty arrays for empty data", () => {
      const params = fit([]);
      expect(params.means).toEqual([]);
      expect(params.stds).toEqual([]);
    });
  });

  describe("transform", () => {
    it("standardizes data correctly", () => {
      const data = [
        [1, 10],
        [3, 20],
        [5, 30],
      ];
      const params = fit(data);
      const result = transform(data, params);

      // Mean of each column should be ~0 after standardization
      const col0Mean =
        result.reduce((sum, row) => sum + row[0], 0) / result.length;
      const col1Mean =
        result.reduce((sum, row) => sum + row[1], 0) / result.length;
      expect(col0Mean).toBeCloseTo(0, 10);
      expect(col1Mean).toBeCloseTo(0, 10);

      // Std of each column should be ~1 (population std)
      const col0Std = Math.sqrt(
        result.reduce((sum, row) => sum + row[0] ** 2, 0) / result.length
      );
      expect(col0Std).toBeCloseTo(1, 10);
    });

    it("handles zero-variance column without NaN", () => {
      const data = [
        [5, 1],
        [5, 2],
      ];
      const params = fit(data);
      const result = transform(data, params);
      // With std=1, result = (5-5)/1 = 0
      expect(result[0][0]).toBe(0);
      expect(result[1][0]).toBe(0);
      // No NaN values
      result.forEach((row) =>
        row.forEach((val) => expect(Number.isNaN(val)).toBe(false))
      );
    });
  });

  describe("fitTransform", () => {
    it("produces same result as fit then transform", () => {
      const data = [
        [2, 4],
        [4, 8],
        [6, 12],
      ];
      const params = fit(data);
      const manual = transform(data, params);
      const { transformed, params: ftParams } = fitTransform(data);

      expect(ftParams.means).toEqual(params.means);
      expect(ftParams.stds).toEqual(params.stds);
      expect(transformed).toEqual(manual);
    });
  });
});
