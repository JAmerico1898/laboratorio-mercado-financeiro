"use client";
import { forwardRef, useState } from "react";
import { QUIZ_QUESTIONS, scoreQuiz } from "@/lib/baas/quiz";
import type { QuizResult } from "@/lib/baas/types";

const QuizSection = forwardRef<HTMLElement>(function QuizSection(_, ref) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const allAnswered = Object.keys(answers).length === QUIZ_QUESTIONS.length;

  const handleSubmit = () => {
    setResult(scoreQuiz(answers));
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-secondary";
    if (percentage >= 60) return "text-[#f59e0b]";
    return "text-[#ef4444]";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return "🎉 Excelente!";
    if (percentage >= 60) return "👍 Bom trabalho!";
    return "📚 Continue estudando!";
  };

  return (
    <section ref={ref} id="quiz" className="scroll-mt-16">
      {/* Section title */}
      <h2 className="text-2xl font-bold font-headline text-on-surface mb-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-container">quiz</span>
        Quiz BaaS
      </h2>
      <p className="text-on-surface-variant mb-8">Teste seus Conhecimentos</p>

      {/* Questions */}
      <div className="space-y-6 mb-8">
        {QUIZ_QUESTIONS.map((q, qIdx) => (
          <div
            key={qIdx}
            className="glass-panel p-6 rounded-xl border border-outline-variant/10"
          >
            <p className="font-bold text-on-surface mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((option, oIdx) => {
                const selected = answers[qIdx] === oIdx;
                const isCorrect = submitted && oIdx === q.correctIndex;
                const isWrong = submitted && selected && oIdx !== q.correctIndex;

                return (
                  <label
                    key={oIdx}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                      isCorrect
                        ? "bg-secondary/10 border-secondary/30"
                        : isWrong
                        ? "bg-[#ef4444]/10 border-[#ef4444]/30"
                        : selected
                        ? "bg-primary-container/10 border-primary-container/30"
                        : "border-transparent hover:bg-surface-container-high/50"
                    } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <input
                      type="radio"
                      name={`question-${qIdx}`}
                      value={oIdx}
                      checked={selected}
                      onChange={() => {
                        if (!submitted) {
                          setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
                        }
                      }}
                      disabled={submitted}
                      className="hidden"
                    />
                    {/* Visual radio indicator */}
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        isCorrect
                          ? "border-secondary bg-secondary/20"
                          : isWrong
                          ? "border-[#ef4444] bg-[#ef4444]/20"
                          : selected
                          ? "border-primary-container bg-primary-container/20"
                          : "border-outline-variant"
                      }`}
                    >
                      {selected && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isWrong
                              ? "bg-[#ef4444]"
                              : isCorrect
                              ? "bg-secondary"
                              : "bg-primary-container"
                          }`}
                        />
                      )}
                      {/* Show correct dot for unselected correct answer after submission */}
                      {isCorrect && !selected && (
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                      )}
                    </span>
                    <span
                      className={`text-sm ${
                        isCorrect
                          ? "text-secondary font-semibold"
                          : isWrong
                          ? "text-[#ef4444]"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      {!submitted && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`bg-gradient-to-r from-primary-container to-secondary text-on-primary px-8 py-3 rounded-xl font-bold transition-opacity ${
              allAnswered ? "opacity-100 hover:opacity-90 cursor-pointer" : "opacity-40 cursor-not-allowed"
            }`}
          >
            Ver Resultado
          </button>
        </div>
      )}

      {/* Score display */}
      {submitted && result && (
        <div className="glass-panel p-8 rounded-xl border border-outline-variant/10 text-center mb-6">
          <p
            className={`text-5xl font-bold mb-2 ${getScoreColor(result.percentage)}`}
          >
            {result.score}/{result.total}
          </p>
          <p className={`text-lg font-semibold mb-1 ${getScoreColor(result.percentage)}`}>
            {result.percentage.toFixed(0)}% de acertos
          </p>
          <p className="text-xl text-on-surface mt-3">
            {getScoreMessage(result.percentage)}
          </p>
        </div>
      )}

      {/* Try again button */}
      {submitted && (
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="glass-panel border border-outline-variant/20 px-8 py-3 rounded-xl font-bold text-on-surface hover:border-primary-container/30 transition-colors cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      )}
    </section>
  );
});

export default QuizSection;
