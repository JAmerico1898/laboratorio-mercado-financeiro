import type { QuizQuestion, QuizResult } from "./types";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "1. Qual é a principal responsabilidade da instituição prestadora no BaaS?",
    options: ["Marketing", "Licença regulatória e conformidade perante o BCB", "Desenvolvimento de APIs", "Design de UX"],
    correctIndex: 1,
  },
  {
    question: "2. O que a Emenda Durbin nos EUA criou em relação ao BaaS?",
    options: ["Obrigação de oferecer BaaS", "Arbitragem regulatória favorecendo bancos menores", "Proibição de middlewares", "Limite de clientes"],
    correctIndex: 1,
  },
  {
    question: "3. Qual o principal risco demonstrado pelo caso Synapse?",
    options: ["Custos baixos", "Falta de inovação", "Dependência e complexidade em múltiplas camadas", "Excesso de regulação"],
    correctIndex: 2,
  },
  {
    question: "4. Qual prazo foi estabelecido pela CP 115/2025 para contribuições?",
    options: ["31/01/2025", "28/02/2025", "31/03/2025", "30/04/2025"],
    correctIndex: 1,
  },
  {
    question: "5. O que é 'Embedded Finance'?",
    options: ["Financiamento de startups", "Serviços financeiros integrados em plataformas não-financeiras", "Banco digital tradicional", "Regulação de fintechs"],
    correctIndex: 1,
  },
];

export function scoreQuiz(answers: Record<number, number>): QuizResult {
  const total = QUIZ_QUESTIONS.length;
  let score = 0;
  for (let i = 0; i < total; i++) {
    if (answers[i] === QUIZ_QUESTIONS[i].correctIndex) {
      score++;
    }
  }
  return { score, total, percentage: (score / total) * 100 };
}
