import {
  isForbiddenCombination,
  determineRegistrationType,
  calculateTimeline,
  getComplianceStatus,
} from "../fidc/checklist-logic";

describe("isForbiddenCombination", () => {
  it("returns true for varejo + dcnp", () => {
    expect(isForbiddenCombination("varejo", "dcnp")).toBe(true);
  });

  it("returns false for profissional + dcnp", () => {
    expect(isForbiddenCombination("profissional", "dcnp")).toBe(false);
  });

  it("returns false for varejo + dcp", () => {
    expect(isForbiddenCombination("varejo", "dcp")).toBe(false);
  });
});

describe("determineRegistrationType", () => {
  it("returns simplified for profissional", () => {
    expect(determineRegistrationType("profissional", true)).toBe("simplified");
    expect(determineRegistrationType("profissional", false)).toBe("simplified");
  });

  it("returns automatic for varejo with anbima", () => {
    expect(determineRegistrationType("varejo", true)).toBe("automatic");
  });

  it("returns ordinary for varejo without anbima", () => {
    expect(determineRegistrationType("varejo", false)).toBe("ordinary");
  });
});

describe("calculateTimeline", () => {
  it("returns correct milestones for automatic registration", () => {
    const timeline = calculateTimeline("automatic", "2026-04-01");
    expect(timeline.totalDays).toBe(90);
    expect(timeline.milestones.length).toBe(4);
    expect(timeline.milestones[0].label).toBe("Protocolo CVMWeb");
    expect(timeline.milestones[0].date).toBe("2026-04-01");
  });

  it("returns correct milestones for simplified registration", () => {
    const timeline = calculateTimeline("simplified", "2026-04-01");
    expect(timeline.totalDays).toBe(60);
  });
});

describe("getComplianceStatus", () => {
  it("returns full compliance when all 6 items checked", () => {
    const items: Record<string, boolean> = {
      rating: true, seniorOnly: true, maturity: true,
      diversification: true, periodicInfo: true, distributor: true,
    };
    const status = getComplianceStatus(items);
    expect(status.completed).toBe(6);
    expect(status.total).toBe(6);
    expect(status.percentage).toBe(100);
    expect(status.level).toBe("approved");
  });

  it("returns partial compliance", () => {
    const items: Record<string, boolean> = {
      rating: true, seniorOnly: true, maturity: false,
      diversification: false, periodicInfo: true, distributor: false,
    };
    const status = getComplianceStatus(items);
    expect(status.completed).toBe(3);
    expect(status.percentage).toBe(50);
    expect(status.level).toBe("pending");
  });
});
