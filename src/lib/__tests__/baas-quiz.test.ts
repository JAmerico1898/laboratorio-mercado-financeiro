import { QUIZ_QUESTIONS, scoreQuiz } from "@/lib/baas/quiz";

describe("QUIZ_QUESTIONS", () => {
  it("has 5 questions with 4 options each", () => {
    expect(QUIZ_QUESTIONS).toHaveLength(5);
    QUIZ_QUESTIONS.forEach((q) => expect(q.options).toHaveLength(4));
  });
  it("correctIndex values match spec", () => {
    expect(QUIZ_QUESTIONS.map((q) => q.correctIndex)).toEqual([1, 1, 2, 1, 1]);
  });
});

describe("scoreQuiz", () => {
  it("100% for all correct", () => {
    const r = scoreQuiz({ 0: 1, 1: 1, 2: 2, 3: 1, 4: 1 });
    expect(r).toEqual({ score: 5, total: 5, percentage: 100 });
  });
  it("0% for all wrong", () => {
    expect(scoreQuiz({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }).percentage).toBe(0);
  });
  it("60% for 3/5 correct", () => {
    expect(scoreQuiz({ 0: 1, 1: 1, 2: 2, 3: 0, 4: 0 }).score).toBe(3);
  });
  it("missing answers count as wrong", () => {
    expect(scoreQuiz({ 0: 1 }).score).toBe(1);
  });
  it("empty answers = 0%", () => {
    expect(scoreQuiz({}).score).toBe(0);
  });
});
