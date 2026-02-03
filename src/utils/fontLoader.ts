import { googleFonts, getPriorityFonts, getRemainingFonts } from '../data/fontList';

// Track loaded fonts
const loadedFonts = new Set<string>();
const loadingFonts = new Set<string>();
const failedFonts = new Set<string>();

// Listeners for font load events
type FontLoadListener = (fontName: string) => void;
const listeners: FontLoadListener[] = [];

export function onFontLoaded(callback: FontLoadListener) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

function notifyListeners(fontName: string) {
  listeners.forEach(cb => cb(fontName));
}

// Timeout helper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}

// Load a single font via Google Fonts
async function loadFont(fontName: string): Promise<boolean> {
  if (loadedFonts.has(fontName) || loadingFonts.has(fontName)) {
    return loadedFonts.has(fontName);
  }

  loadingFonts.add(fontName);

  try {
    // Create link element for Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName).replace(/%20/g, '+')}&display=swap`;

    // Wait for stylesheet to load with timeout
    await withTimeout(
      new Promise<void>((resolve, reject) => {
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load font: ${fontName}`));
        document.head.appendChild(link);
      }),
      5000
    );

    // Wait for font to be ready with timeout
    await withTimeout(document.fonts.load(`16px "${fontName}"`), 3000);

    loadedFonts.add(fontName);
    loadingFonts.delete(fontName);
    notifyListeners(fontName);
    return true;
  } catch (error) {
    console.warn(`Failed to load font: ${fontName}`, error);
    loadingFonts.delete(fontName);
    failedFonts.add(fontName);
    return false;
  }
}

// Load multiple fonts in parallel with concurrency limit
async function loadFontsBatch(fonts: string[], concurrency: number = 5): Promise<void> {
  const queue = [...fonts];
  const workers: Promise<void>[] = [];

  for (let i = 0; i < concurrency; i++) {
    workers.push((async () => {
      while (queue.length > 0) {
        const font = queue.shift();
        if (font) await loadFont(font);
      }
    })());
  }

  await Promise.all(workers);
}

// Get list of currently loaded fonts
export function getLoadedFonts(): string[] {
  return Array.from(loadedFonts);
}

// Check if a specific font is loaded
export function isFontLoaded(fontName: string): boolean {
  return loadedFonts.has(fontName);
}

// Get loaded font count
export function getLoadedFontCount(): number {
  return loadedFonts.size;
}

// Get total font count
export function getTotalFontCount(): number {
  return googleFonts.length;
}

// Load priority fonts (for initial game start)
export async function loadPriorityFonts(count: number = 10): Promise<string[]> {
  const priorityFonts = getPriorityFonts(count);
  await loadFontsBatch(priorityFonts, 5);
  return getLoadedFonts();
}

// Start loading remaining fonts in background
let backgroundLoadingStarted = false;
export function startBackgroundLoading(priorityCount: number = 10): void {
  if (backgroundLoadingStarted) return;
  backgroundLoadingStarted = true;

  const remainingFonts = getRemainingFonts(priorityCount);

  // Load in small batches with delays to not block the main thread
  const batchSize = 10;
  let currentIndex = 0;

  const loadNextBatch = async () => {
    if (currentIndex >= remainingFonts.length) return;

    const batch = remainingFonts.slice(currentIndex, currentIndex + batchSize);
    currentIndex += batchSize;

    await loadFontsBatch(batch, 3);

    // Small delay between batches
    setTimeout(loadNextBatch, 100);
  };

  // Start loading after a short delay to let the game initialize
  setTimeout(loadNextBatch, 500);
}

// Get a random pair of loaded fonts for a question
export function getRandomFontPair(): [string, string] | null {
  const loaded = getLoadedFonts();
  if (loaded.length < 2) return null;

  // Shuffle and pick two different fonts
  const shuffled = [...loaded].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

// Reset loader state (for testing)
export function resetLoader(): void {
  loadedFonts.clear();
  loadingFonts.clear();
  failedFonts.clear();
  backgroundLoadingStarted = false;
}
