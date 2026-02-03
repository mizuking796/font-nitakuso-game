import { useEffect } from 'react';
import type { Answer } from '../hooks/useGame';
import { sendStats } from '../utils/stats';
import { useLanguage } from '../i18n/LanguageContext';

interface ResultProps {
  score: number;
  total: number;
  answers: Answer[];
  onRetry: () => void;
  onHome: () => void;
}

export function Result({ score, total, answers, onRetry, onHome }: ResultProps) {
  const { t } = useLanguage();
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    sendStats(score, total, answers);
  }, [score, total, answers]);

  const handleShare = () => {
    const text = t.shareText
      .replace('{total}', String(total))
      .replace('{score}', String(score))
      .replace('{percentage}', String(percentage));

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert(t.copied);
    }
  };

  return (
    <div className="result">
      <h2>{t.resultTitle}</h2>

      <div className="score-display">
        <div className="score-number">
          {score} / {total}
        </div>
        <div className="score-percentage">{t.accuracy}: {percentage}%</div>
      </div>

      <div className="answer-table-container">
        <table className="answer-table">
          <thead>
            <tr>
              <th>Q</th>
              <th>{t.left}</th>
              <th>{t.right}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer) => {
              const { fontPair, char, correctSide } = answer.question;
              const leftFont = correctSide === 'left' ? fontPair.fontA : fontPair.fontB;
              const rightFont = correctSide === 'right' ? fontPair.fontA : fontPair.fontB;
              return (
                <tr key={answer.questionId}>
                  <td>{answer.questionId}</td>
                  <td>
                    <span
                      className="table-char"
                      style={{ fontFamily: `"${leftFont.family}", sans-serif` }}
                    >
                      {char}
                    </span>
                    <span className="font-name">{leftFont.name}</span>
                  </td>
                  <td>
                    <span
                      className="table-char"
                      style={{ fontFamily: `"${rightFont.family}", sans-serif` }}
                    >
                      {char}
                    </span>
                    <span className="font-name">{rightFont.name}</span>
                  </td>
                  <td className={answer.isCorrect ? 'correct' : 'incorrect'}>
                    {answer.isCorrect ? '○' : '×'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="result-actions">
        <button className="btn btn-primary" onClick={onRetry}>
          {t.retry}
        </button>
        <button className="btn btn-secondary" onClick={handleShare}>
          {t.share}
        </button>
        <button className="btn btn-link" onClick={onHome}>
          {t.home}
        </button>
      </div>
    </div>
  );
}
