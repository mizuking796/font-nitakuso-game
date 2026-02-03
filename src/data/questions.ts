import type { FontPair, Difficulty } from './fonts';
import { createFontPair, getDifficulty, isSameFamily, isSameFamilyGroup, getFontBaseName, extremePairs } from './fonts';
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

// Track usage of font family groups (max 2 per game)
class FamilyGroupTracker {
  private usageCount: Map<string, number> = new Map();
  private maxPerGroup: number;

  constructor(maxPerGroup: number = 2) {
    this.maxPerGroup = maxPerGroup;
  }

  canUse(fontName: string): boolean {
    const baseName = getFontBaseName(fontName);
    const count = this.usageCount.get(baseName) || 0;
    return count < this.maxPerGroup;
  }

  canUsePair(fontA: string, fontB: string): boolean {
    const baseA = getFontBaseName(fontA);
    const baseB = getFontBaseName(fontB);

    // If same family group, count as 1 usage
    if (baseA === baseB) {
      const count = this.usageCount.get(baseA) || 0;
      return count + 1 <= this.maxPerGroup;
    }

    // Different groups, check both
    const countA = this.usageCount.get(baseA) || 0;
    const countB = this.usageCount.get(baseB) || 0;
    return countA < this.maxPerGroup && countB < this.maxPerGroup;
  }

  markUsed(fontName: string): void {
    const baseName = getFontBaseName(fontName);
    const count = this.usageCount.get(baseName) || 0;
    this.usageCount.set(baseName, count + 1);
  }

  markPairUsed(fontA: string, fontB: string): void {
    this.markUsed(fontA);
    // Don't double-count if same family group
    if (getFontBaseName(fontA) !== getFontBaseName(fontB)) {
      this.markUsed(fontB);
    }
  }
}

// Find font pairs matching a difficulty level (excluding same family group for non-extreme)
function findPairsForDifficulty(
  fonts: string[],
  targetDifficulty: Difficulty,
  count: number,
  tracker: FamilyGroupTracker
): [string, string][] {
  const pairs: [string, string][] = [];
  const shuffledFonts = shuffle(fonts);

  for (let i = 0; i < shuffledFonts.length && pairs.length < count; i++) {
    for (let j = i + 1; j < shuffledFonts.length && pairs.length < count; j++) {
      const fontA = shuffledFonts[i];
      const fontB = shuffledFonts[j];

      // Skip same family group for non-extreme difficulties
      if (targetDifficulty !== 'extreme' && isSameFamilyGroup(fontA, fontB)) {
        continue;
      }

      // Check family group usage limit
      if (!tracker.canUsePair(fontA, fontB)) {
        continue;
      }

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

// Check if a pair can be used considering family group tracker and used fonts
function canUsePairWithConstraints(
  pair: [string, string],
  tracker: FamilyGroupTracker,
  usedFonts: Set<string>,
  allowSameFamilyGroup: boolean
): boolean {
  // Check if fonts are already used
  if (usedFonts.has(pair[0]) || usedFonts.has(pair[1])) {
    return false;
  }

  // Check family group constraint
  if (!allowSameFamilyGroup && isSameFamilyGroup(pair[0], pair[1])) {
    return false;
  }

  // Check tracker limit
  return tracker.canUsePair(pair[0], pair[1]);
}

// Generate 10 questions with specific structure
export function generateQuestions(): Question[] {
  const loadedFonts = getLoadedFonts();

  if (loadedFonts.length < 2) {
    console.error('Not enough fonts loaded');
    return [];
  }

  const questions: Question[] = [];
  const tracker = new FamilyGroupTracker(2); // Max 2 usages per family group
  const usedFonts = new Set<string>();

  // Helper to select and mark a pair
  const selectPair = (
    candidates: [string, string][],
    allowSameFamilyGroup: boolean,
    previousPair?: [string, string]
  ): [string, string] | null => {
    for (const pair of candidates) {
      if (!canUsePairWithConstraints(pair, tracker, usedFonts, allowSameFamilyGroup)) {
        continue;
      }
      if (previousPair && sharesFont(pair, previousPair)) {
        continue;
      }
      return pair;
    }
    return null;
  };

  const markPairUsed = (pair: [string, string]) => {
    tracker.markPairUsed(pair[0], pair[1]);
    usedFonts.add(pair[0]);
    usedFonts.add(pair[1]);
  };

  // Get all candidate pairs (without marking them as used yet)
  const tempTracker = new FamilyGroupTracker(999); // No limit for candidate generation
  const easyCandidates = findPairsForDifficulty(loadedFonts, 'easy', 50, tempTracker);
  let hardCandidates = findPairsForDifficulty(loadedFonts, 'hard', 50, tempTracker);
  if (hardCandidates.length < 10) {
    hardCandidates = [...hardCandidates, ...findPairsForDifficulty(loadedFonts, 'medium', 30, tempTracker)];
  }

  // Q1-2: Same font pair, different chars (easy, no same family group)
  let pair1 = selectPair(easyCandidates, false);
  if (!pair1) {
    // Fallback: use first two different fonts
    const shuffled = shuffle(loadedFonts);
    pair1 = [shuffled[0], shuffled[1]];
  }
  markPairUsed(pair1);

  const chars1to2 = getUniqueChars(2, 'easy');
  for (let i = 0; i < 2; i++) {
    questions.push({
      id: i + 1,
      fontPair: createFontPair(pair1[0], pair1[1]),
      char: chars1to2[i],
      correctSide: Math.random() < 0.5 ? 'left' : 'right',
    });
  }

  // Q3-4: Different font pair from Q1-2 (easy, no same family group)
  let pair2 = selectPair(easyCandidates, false, pair1);
  if (!pair2) {
    // Fallback
    const available = loadedFonts.filter(f => !usedFonts.has(f));
    if (available.length >= 2) {
      pair2 = [available[0], available[1]];
    } else {
      pair2 = [loadedFonts[0], loadedFonts[1]];
    }
  }
  markPairUsed(pair2);

  const chars3to4 = getUniqueChars(2, 'easy');
  for (let i = 0; i < 2; i++) {
    questions.push({
      id: 3 + i,
      fontPair: createFontPair(pair2[0], pair2[1]),
      char: chars3to4[i],
      correctSide: Math.random() < 0.5 ? 'left' : 'right',
    });
  }

  // Q5-8: Each different font pair (hard, no same family group)
  const hardPairs: [string, string][] = [];
  let prevHardPair: [string, string] | undefined;

  for (let i = 0; i < 4; i++) {
    let pair = selectPair(hardCandidates, false, prevHardPair);
    if (!pair) {
      // Fallback: find any available pair
      const available = loadedFonts.filter(f => !usedFonts.has(f) && tracker.canUse(f));
      if (available.length >= 2) {
        pair = [available[0], available[1]];
      } else {
        // Last resort
        const shuffled = shuffle(loadedFonts);
        pair = [shuffled[0], shuffled[1]];
      }
    }
    hardPairs.push(pair);
    markPairUsed(pair);
    prevHardPair = pair;
  }

  const chars5to8 = getUniqueChars(4, 'hard');
  for (let i = 0; i < 4; i++) {
    questions.push({
      id: 5 + i,
      fontPair: createFontPair(hardPairs[i][0], hardPairs[i][1]),
      char: chars5to8[i],
      correctSide: Math.random() < 0.5 ? 'left' : 'right',
    });
  }

  // Q9-10: Extreme difficulty - use hardcoded same-family pairs
  // Filter to pairs where both fonts are loaded
  const loadedFontSet = new Set(loadedFonts);
  const availableExtremePairs = shuffle(
    extremePairs.filter(([a, b]) => loadedFontSet.has(a) && loadedFontSet.has(b))
  );

  // Select first extreme pair
  let extremePair1: [string, string] | null = null;
  for (const pair of availableExtremePairs) {
    if (tracker.canUsePair(pair[0], pair[1])) {
      extremePair1 = pair;
      break;
    }
  }
  if (!extremePair1) {
    // Fallback: find any same-family pair from loaded fonts
    for (let i = 0; i < loadedFonts.length && !extremePair1; i++) {
      for (let j = i + 1; j < loadedFonts.length && !extremePair1; j++) {
        if (isSameFamily(loadedFonts[i], loadedFonts[j]) &&
            tracker.canUsePair(loadedFonts[i], loadedFonts[j])) {
          extremePair1 = [loadedFonts[i], loadedFonts[j]];
        }
      }
    }
  }
  if (!extremePair1) {
    // Last fallback
    const shuffled = shuffle(loadedFonts);
    extremePair1 = [shuffled[0], shuffled[1]];
  }
  markPairUsed(extremePair1);

  // Select second extreme pair (different from first)
  let extremePair2: [string, string] | null = null;
  for (const pair of availableExtremePairs) {
    if (!sharesFont(pair, extremePair1) && tracker.canUsePair(pair[0], pair[1])) {
      extremePair2 = pair;
      break;
    }
  }
  if (!extremePair2) {
    // Fallback: find any same-family pair from loaded fonts
    for (let i = 0; i < loadedFonts.length && !extremePair2; i++) {
      for (let j = i + 1; j < loadedFonts.length && !extremePair2; j++) {
        if (isSameFamily(loadedFonts[i], loadedFonts[j]) &&
            !sharesFont([loadedFonts[i], loadedFonts[j]], extremePair1) &&
            tracker.canUsePair(loadedFonts[i], loadedFonts[j])) {
          extremePair2 = [loadedFonts[i], loadedFonts[j]];
        }
      }
    }
  }
  if (!extremePair2) {
    // Last fallback
    const shuffled = shuffle(loadedFonts.filter(f => !extremePair1!.includes(f)));
    extremePair2 = shuffled.length >= 2 ? [shuffled[0], shuffled[1]] : extremePair1;
  }
  markPairUsed(extremePair2);

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
