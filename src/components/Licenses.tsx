import { useLanguage } from '../i18n/LanguageContext';

interface LicensesProps {
  onBack: () => void;
}

export function Licenses({ onBack }: LicensesProps) {
  const { t } = useLanguage();

  return (
    <div className="licenses">
      <h2>{t.licensesTitle}</h2>

      <p className="license-intro">{t.licensesIntro}</p>

      <div className="font-list">
        <div className="font-item">
          <h3>Google Fonts</h3>
          <p>{t.fontsUsed}</p>
          <p>
            <a href="https://scripts.sil.org/OFL" target="_blank" rel="noopener noreferrer">
              SIL Open Font License
            </a>
            {' / '}
            <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer">
              Apache License 2.0
            </a>
          </p>
          <p>
            <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">
              fonts.google.com
            </a>
          </p>
        </div>
      </div>

      <button className="btn btn-secondary" onClick={onBack}>
        {t.back}
      </button>
    </div>
  );
}
