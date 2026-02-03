export interface FontDefinition {
  id: string;
  name: string;
  family: string;
}

// Create a font definition from a Google Font name
export function createFontDef(fontName: string): FontDefinition {
  return {
    id: fontName.toLowerCase().replace(/\s+/g, '-'),
    name: fontName,
    family: fontName,
  };
}

// Difficulty is determined by how similar fonts are
// We'll use simple heuristics based on font categories
export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

// Font categories for difficulty matching
const serifFonts = new Set([
  'Noto Serif', 'Playfair Display', 'Merriweather', 'Lora', 'Source Serif Pro',
  'Libre Baskerville', 'Crimson Text', 'EB Garamond', 'Cormorant Garamond',
  'Spectral', 'Bitter', 'Arvo', 'Zilla Slab', 'Cardo', 'Old Standard TT',
  'Libre Bodoni', 'Vollkorn', 'Alegreya', 'Amiri', 'Bree Serif', 'Rokkitt',
  'Faustina', 'Gelasio', 'Literata', 'Newsreader',
]);

const impactFonts = new Set([
  'Anton', 'Bebas Neue', 'Archivo Black', 'Black Ops One', 'Russo One',
  'Righteous', 'Passion One', 'Bowlby One SC', 'Bungee', 'Bangers',
  'Alfa Slab One', 'Titan One', 'Ultra', 'Fjalla One', 'Oswald',
  'Staatliches', 'Teko', 'Yanone Kaffeesatz',
]);

const handwritingFonts = new Set([
  'Lobster', 'Pacifico', 'Dancing Script', 'Shadows Into Light', 'Indie Flower',
  'Permanent Marker', 'Caveat', 'Satisfy', 'Great Vibes', 'Sacramento',
  'Kaushan Script', 'Cookie', 'Courgette', 'Amatic SC', 'Architects Daughter',
  'Patrick Hand', 'Handlee', 'Gloria Hallelujah', 'Yellowtail',
]);

const monoFonts = new Set([
  'Inconsolata', 'IBM Plex Mono', 'Source Code Pro', 'Fira Code', 'Fira Mono',
  'JetBrains Mono', 'Ubuntu Mono', 'Space Mono', 'DM Mono', 'Cousine',
]);

const roundedFonts = new Set([
  'Nunito', 'Quicksand', 'Comfortaa', 'Varela Round', 'M PLUS Rounded 1c',
  'Baloo 2', 'Fredoka One', 'Bubblegum Sans', 'Comic Neue',
]);

function getFontCategory(fontName: string): string {
  if (serifFonts.has(fontName)) return 'serif';
  if (impactFonts.has(fontName)) return 'impact';
  if (handwritingFonts.has(fontName)) return 'handwriting';
  if (monoFonts.has(fontName)) return 'mono';
  if (roundedFonts.has(fontName)) return 'rounded';
  return 'sans';
}

// Determine difficulty based on font categories
export function getDifficulty(fontA: string, fontB: string): Difficulty {
  const catA = getFontCategory(fontA);
  const catB = getFontCategory(fontB);

  // Different categories = easy
  if (catA !== catB) {
    // Serif vs Sans is very easy
    if ((catA === 'serif' && catB === 'sans') || (catA === 'sans' && catB === 'serif')) {
      return 'easy';
    }
    // Handwriting vs anything is easy
    if (catA === 'handwriting' || catB === 'handwriting') {
      return 'easy';
    }
    // Impact vs regular sans is medium
    if (catA === 'impact' || catB === 'impact') {
      return 'medium';
    }
    return 'easy';
  }

  // Same category = harder
  if (catA === 'sans') {
    // Similar sans-serif fonts are hard
    return 'hard';
  }
  if (catA === 'serif') {
    return 'hard';
  }

  return 'medium';
}

// Check if two fonts are from the same family (extreme difficulty)
export function isSameFamily(fontA: string, fontB: string): boolean {
  // Extract base name (e.g., "Noto Sans" from "Noto Sans Display")
  const baseA = fontA.split(' ').slice(0, 2).join(' ');
  const baseB = fontB.split(' ').slice(0, 2).join(' ');
  return baseA === baseB && fontA !== fontB;
}

export interface FontPair {
  fontA: FontDefinition;
  fontB: FontDefinition;
  difficulty: Difficulty;
}

// Create a font pair with calculated difficulty
export function createFontPair(fontAName: string, fontBName: string): FontPair {
  let difficulty: Difficulty;

  if (isSameFamily(fontAName, fontBName)) {
    difficulty = 'extreme';
  } else {
    difficulty = getDifficulty(fontAName, fontBName);
  }

  return {
    fontA: createFontDef(fontAName),
    fontB: createFontDef(fontBName),
    difficulty,
  };
}
