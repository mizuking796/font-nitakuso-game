// Characters that work well for font comparison
// Mix of letters with distinctive features in different fonts

export const charPool = {
  // Easy: Characters with obvious serif differences
  easy: ['A', 'M', 'W', 'R', 'Q', 'G', 'S', 'B', 'K', 'N'],

  // Medium: Characters where differences are subtler
  medium: ['a', 'e', 'g', 'o', 't', 'l', 'i', 'n', 'r', 's'],

  // Hard: Characters that look very similar across fonts
  hard: ['O', 'C', 'I', 'L', 'U', 'V', 'X', 'Z', 'c', 'x'],

  // Extreme: Characters where weight differences are hard to spot
  extreme: ['H', 'E', 'F', 'T', 'Y', 'P', 'D', 'J', 'h', 'u'],
};

export function getRandomChar(difficulty: 'easy' | 'medium' | 'hard' | 'extreme'): string {
  const pool = charPool[difficulty];
  return pool[Math.floor(Math.random() * pool.length)];
}
