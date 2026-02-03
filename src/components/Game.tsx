import type { Question } from '../data/questions';
import type { Answer } from '../hooks/useGame';
import { useLanguage } from '../i18n/LanguageContext';

interface GameProps {
  question: Question;
  currentIndex: number;
  total: number;
  phase: 'playing' | 'feedback';
  lastAnswer: Answer | null;
  onAnswer: (side: 'left' | 'right') => void;
  onNext: () => void;
}

export function Game({
  question,
  currentIndex,
  total,
  phase,
  lastAnswer,
  onAnswer,
  onNext,
}: GameProps) {
  const { t } = useLanguage();
  const { fontPair, char, correctSide } = question;

  const leftFont = correctSide === 'left' ? fontPair.fontA : fontPair.fontB;
  const rightFont = correctSide === 'right' ? fontPair.fontA : fontPair.fontB;

  const isPlaying = phase === 'playing';

  return (
    <div className="game">
      <div className="progress">
        Q{currentIndex + 1} / {total}
      </div>

      <div className="question-text">
        {t.questionPrefix}<span className="target-font">{fontPair.fontA.name}</span>{t.questionSuffix}
      </div>

      <div className="font-display">
        <button
          className={`font-box ${isPlaying ? 'selectable' : ''} ${
            phase === 'feedback' && correctSide === 'left' ? 'correct-answer' : ''
          } ${
            phase === 'feedback' && lastAnswer?.selectedSide === 'left' && !lastAnswer.isCorrect ? 'wrong-answer' : ''
          }`}
          style={{ fontFamily: `"${leftFont.family}", sans-serif` }}
          onClick={() => isPlaying && onAnswer('left')}
          disabled={!isPlaying}
        >
          {char}
        </button>

        <div className="vs">VS</div>

        <button
          className={`font-box ${isPlaying ? 'selectable' : ''} ${
            phase === 'feedback' && correctSide === 'right' ? 'correct-answer' : ''
          } ${
            phase === 'feedback' && lastAnswer?.selectedSide === 'right' && !lastAnswer.isCorrect ? 'wrong-answer' : ''
          }`}
          style={{ fontFamily: `"${rightFont.family}", sans-serif` }}
          onClick={() => isPlaying && onAnswer('right')}
          disabled={!isPlaying}
        >
          {char}
        </button>
      </div>

      {phase === 'feedback' && lastAnswer && (
        <div className="feedback">
          <div className={`feedback-result ${lastAnswer.isCorrect ? 'correct' : 'incorrect'}`}>
            {lastAnswer.isCorrect ? t.correct : t.wrong}
          </div>
          <div className="feedback-fonts">
            {leftFont.name} / {rightFont.name}
          </div>
          <button className="btn btn-primary" onClick={onNext}>
            {currentIndex + 1 >= total ? t.result : t.next}
          </button>
        </div>
      )}
    </div>
  );
}
