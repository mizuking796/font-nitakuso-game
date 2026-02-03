import type { Answer } from '../hooks/useGame';

interface StatsData {
  score: number;
  total: number;
  answers: {
    questionId: number;
    fontA: string;
    fontB: string;
    char: string;
    selectedSide: 'left' | 'right';
    correctSide: 'left' | 'right';
    isCorrect: boolean;
  }[];
}

export async function sendStats(
  score: number,
  total: number,
  answers: Answer[]
): Promise<void> {
  const gasUrl = import.meta.env.VITE_GAS_URL;

  if (!gasUrl) {
    return;
  }

  const data: StatsData = {
    score,
    total,
    answers: answers.map((a) => ({
      questionId: a.questionId,
      fontA: a.question.fontPair.fontA.name,
      fontB: a.question.fontPair.fontB.name,
      char: a.question.char,
      selectedSide: a.selectedSide,
      correctSide: a.question.correctSide,
      isCorrect: a.isCorrect,
    })),
  };

  try {
    await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Failed to send stats:', error);
  }
}
