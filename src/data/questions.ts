import type { FontPair, Difficulty } from './fonts';
import { createFontPair, getDifficulty, isSameFamily } from './fonts';
import { getLoadedFonts } from '../utils/fontLoader';
import { getRandomChar } from './charPool';

export interface Question {
  id: number;
  fontPair: FontPair;
  char: string;
  correctSide: 'left' | 'right';
}

// Shuffle array
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Find font pairs matching a difficulty level
function findPairsForDifficulty(
  fonts: string[],
  targetDifficulty: Difficulty,
  count: number
): [string, string][] {
  const pairs: [string, string][] = [];
  const shuffledFonts = shuffle(fonts);

  for (let i = 0; i < shuffledFonts.length && pairs.length < count; i++) {
    for (let j = i + 1; j < shuffledFonts.length && pairs.length < count; j++) {
      const fontA = shuffledFonts[i];
      const fontB = shuffledFonts[j];

      let difficulty: Difficulty;
      if (isSameFamily(fontA, fontB)) {
        difficulty = 'extreme';
      } else {
        difficulty = getDifficulty(fontA, fontB);
      }

      if (difficulty === targetDifficulty) {
        pairs.push([fontA, fontB]);
      }
    }
  }

  return pairs;
}

// Find same-family pairs (extreme difficulty)
function findSameFamilyPairs(fonts: string[]): [string, string][] {
  const pairs: [string, string][] = [];

  for (let i = 0; i < fonts.length; i++) {
    for (let j = i + 1; j < fonts.length; j++) {
      if (isSameFamily(fonts[i], fonts[j])) {
        pairs.push([fonts[i], fonts[j]]);
      }
    }
  }

  return shuffle(pairs);
}

// Check if two pairs share any font
function sharesFont(pair1: [string, string], pair2: [string, string]): boolean {
  return pair1[0] === pair2[0] || pair1[0] === pair2[1] ||
         pair1[1] === pair2[0] || pair1[1] === pair2[1];
}

// Get unique chars for a set of questions
function getUniqueChars(count: number, difficulty: 'easy' | 'medium' | 'hard' | 'extreme'): string[] {
  const chars: string[] = [];
  const used = new Set<string>();

  while (chars.length < count) {
    const char = getRandomChar(difficulty);
    if (!used.has(char)) {
      used.add(char);
      chars.push(char);
    }
    // Prevent infinite loop if pool is too small
    if (used.size > 20) break;
  }

  // Fill remaining if needed
  while (chars.length < count) {
    chars.push(getRandomChar(difficulty));
  }

  return chars;
}

// Generate 10 questions with specific structure
export function generateQuestions(): Question[] {
  const loadedFonts = getLoadedFonts();

  if (loadedFonts.length < 2) {
    console.error('Not enough fonts loaded');
    return [];
  }

  const questions: Question[] = [];

  // Get candidate pairs
  const easyCandidates = findPairsForDifficulty(loadedFonts, 'easy', 20);
  let hardCandidates = findPairsForDifficulty(loadedFonts, 'hard', 20);
  if (hardCandidates.length < 5) {
    hardCandidates = [...hardCandidates, ...findPairsForDifficulty(loadedFonts, 'medium', 15)];
  }
  const extremeCandidates = findSameFamilyPairs(loadedFonts);

  // Q1-3: Same font pair, different chars
  const pair1 = easyCandidates[0] || [loadedFonts[0], loadedFonts[1]];
  const chars1to3 = getUniqueChars(3, 'easy');
  for (let i = 0; i < 3; i++) {
    questions.push({
      id: i + 1,
      fontPair: createFontPair(pair1[0], pair1[1]),
      char: chars1to3[i],
      correctSide: Math.random() < 0.5 ? 'left' : 'right',
    });
  }

  // Q4-5: Different font pair from Q1-3, same pair for both
  let pair2 = easyCandidates.find(p => !sharesFont(p, pair1)) || easyCandidates[1];
  if (!pair2 || sharesFont(pair2, pair1)) {
    // Fallback: create a random pair
    const available = loadedFonts.filter(f => f !== pair1[0] && f !== pair1[1]);
    if (available.length >= 2) {
      pair2 = [available[0], available[1]];
    } else {
      pair2 = easyCandidates[1] || pair1;
    }
  }
  const chars4to5 = getUniqueChars(2, 'easy');
  for (let i = 0; i < 2; i++) {
    questions.push({
      id: 4 + i,
      fontPair: createFontPair(pair2[0], pair2[1]),
      char: chars4to5[i],
      correctSide: Math.random() < 0.5 ? 'left' : 'right',
    });
  }

  // Q6-8: Each different font pair, no consecutive sharing
  const usedFonts = new Set([pair1[0], pair1[1], pair2[0], pair2[1]]);
  const hardPairs: [string, string][] = [];

  for (const candidate of hardCandidates) {
    if (hardPairs.length >= 3) break;

    // Check not sharing with used fonts
    if (usedFonts.has(candidate[0]) || usedFonts.has(candidate[1])) continue;

    // Check not sharing with previous hard pair
    if (hardPairs.length > 0 && sharesFont(candidate, hardPairs[hardPairs.length - 1])) continue;

    hardPairs.push(candidate);
    usedFonts.add(candidate[0]);
    usedFonts.add(candidate[1]);
  }

  // Fill if not enough
  while (hardPairs.length < 3) {
    const shuffled = shuffle(loadedFonts);
    for (let i = 0; i < shuffled.length - 1; i++) {
      const candidate: [string, string] = [shuffled[i], shuffled[i + 1]];
      if (hardPairs.length > 0 && sharesFont(candidate, hardPairs[hardPairs.length - 1])) continue;
      hardPairs.push(candidate);
      break;
    }
    if (hardPairs.length < 3 && shuffled.length >= 2) {
      hardPairs.push([shuffled[0], shuffled[1]]);
    }
  }

  const chars6to8 = getUniqueChars(3, 'hard');
  for (let i = 0; i < 3; i++) {
    questions.push({
      id: 6 + i,
      fontPair: createFontPair(hardPairs[i][0], hardPairs[i][1]),
      char: chars6to8[i],
      correctSide: Math.random() < 0.5 ? 'left' : 'right',
    });
  }

  // Q9-10: Same family pairs (extreme), different from each other
  let extremePair1: [string, string] | undefined = extremeCandidates[0];
  let extremePair2: [string, string] | undefined;

  // Fallback if not enough same-family pairs
  if (!extremePair1) {
    const shuffled = shuffle(loadedFonts);
    extremePair1 = [shuffled[0], shuffled[1]];
  }

  extremePair2 = extremeCandidates.find(p => p && extremePair1 && !sharesFont(p, extremePair1));

  if (!extremePair2) {
    const available = loadedFonts.filter(f => f !== extremePair1![0] && f !== extremePair1![1]);
    if (available.length >= 2) {
      extremePair2 = [available[0], available[1]];
    } else {
      extremePair2 = extremePair1;
    }
  }

  const chars9to10 = getUniqueChars(2, 'extreme');
  questions.push({
    id: 9,
    fontPair: createFontPair(extremePair1[0], extremePair1[1]),
    char: chars9to10[0],
    correctSide: Math.random() < 0.5 ? 'left' : 'right',
  });
  questions.push({
    id: 10,
    fontPair: createFontPair(extremePair2[0], extremePair2[1]),
    char: chars9to10[1],
    correctSide: Math.random() < 0.5 ? 'left' : 'right',
  });

  return questions;
}
