import { useState, useCallback } from 'react';
import type { Question } from '../data/questions';
import { generateQuestions } from '../data/questions';

export interface Answer {
  questionId: number;
  question: Question;
  selectedSide: 'left' | 'right';
  isCorrect: boolean;
}

export interface GameState {
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  phase: 'home' | 'playing' | 'feedback' | 'result';
  lastAnswer: Answer | null;
}

export function useGame() {
  const [state, setState] = useState<GameState>({
    questions: [],
    currentIndex: 0,
    answers: [],
    phase: 'home',
    lastAnswer: null,
  });

  const startGame = useCallback(() => {
    setState({
      questions: generateQuestions(),
      currentIndex: 0,
      answers: [],
      phase: 'playing',
      lastAnswer: null,
    });
  }, []);

  const submitAnswer = useCallback((selectedSide: 'left' | 'right') => {
    setState((prev) => {
      const currentQuestion = prev.questions[prev.currentIndex];
      // correctSide indicates which side fontA is on
      const isCorrect = selectedSide === currentQuestion.correctSide;

      const answer: Answer = {
        questionId: currentQuestion.id,
        question: currentQuestion,
        selectedSide,
        isCorrect,
      };

      return {
        ...prev,
        answers: [...prev.answers, answer],
        phase: 'feedback',
        lastAnswer: answer,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return { ...prev, phase: 'result' };
      }
      return {
        ...prev,
        currentIndex: nextIndex,
        phase: 'playing',
        lastAnswer: null,
      };
    });
  }, []);

  const goHome = useCallback(() => {
    setState({
      questions: [],
      currentIndex: 0,
      answers: [],
      phase: 'home',
      lastAnswer: null,
    });
  }, []);

  const currentQuestion = state.questions[state.currentIndex] || null;
  const score = state.answers.filter((a) => a.isCorrect).length;
  const total = state.questions.length;

  return {
    state,
    currentQuestion,
    score,
    total,
    startGame,
    submitAnswer,
    nextQuestion,
    goHome,
  };
}
