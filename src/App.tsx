import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { Home } from './components/Home';
import { Game } from './components/Game';
import { Result } from './components/Result';
import { Licenses } from './components/Licenses';
import { Terms } from './components/Terms';
import { Privacy } from './components/Privacy';
import { LanguageProvider } from './i18n/LanguageContext';
import {
  loadPriorityFonts,
  startBackgroundLoading,
  getLoadedFontCount,
  onFontLoaded,
} from './utils/fontLoader';

type Page = 'game' | 'licenses' | 'terms' | 'privacy';

function AppContent() {
  const [page, setPage] = useState<Page>('game');
  const [fontsReady, setFontsReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const {
    state,
    currentQuestion,
    score,
    total,
    startGame,
    submitAnswer,
    nextQuestion,
    goHome,
  } = useGame();

  useEffect(() => {
    const loadFonts = async () => {
      await loadPriorityFonts(15);
      setFontsReady(true);
      setLoadedCount(getLoadedFontCount());
      startBackgroundLoading(15);
    };

    loadFonts();

    const unsubscribe = onFontLoaded(() => {
      setLoadedCount(getLoadedFontCount());
    });

    return unsubscribe;
  }, []);

  if (page === 'licenses') {
    return <Licenses onBack={() => setPage('game')} />;
  }

  if (page === 'terms') {
    return <Terms onBack={() => setPage('game')} />;
  }

  if (page === 'privacy') {
    return <Privacy onBack={() => setPage('game')} />;
  }

  if (!fontsReady) {
    return (
      <div className="loading">
        <h1>FONT NITAKUSO GAME</h1>
        <p>Loading fonts...</p>
        <div className="loading-bar">
          <div
            className="loading-progress"
            style={{ width: `${(loadedCount / 15) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (state.phase === 'home') {
    return (
      <Home
        onStart={startGame}
        onLicenses={() => setPage('licenses')}
        onTerms={() => setPage('terms')}
        onPrivacy={() => setPage('privacy')}
      />
    );
  }

  if ((state.phase === 'playing' || state.phase === 'feedback') && currentQuestion) {
    return (
      <Game
        question={currentQuestion}
        currentIndex={state.currentIndex}
        total={total}
        phase={state.phase}
        lastAnswer={state.lastAnswer}
        onAnswer={submitAnswer}
        onNext={nextQuestion}
      />
    );
  }

  if (state.phase === 'result') {
    return (
      <Result
        score={score}
        total={total}
        answers={state.answers}
        onRetry={startGame}
        onHome={goHome}
      />
    );
  }

  return null;
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
