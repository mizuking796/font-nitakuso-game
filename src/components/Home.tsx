import { useLanguage } from '../i18n/LanguageContext';

interface HomeProps {
  onStart: () => void;
  onLicenses: () => void;
  onTerms: () => void;
  onPrivacy: () => void;
}

export function Home({ onStart, onLicenses, onTerms, onPrivacy }: HomeProps) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="home">
      <div className="lang-toggle">
        <button
          className={`lang-btn ${lang === 'ja' ? 'active' : ''}`}
          onClick={() => setLang('ja')}
        >
          JP
        </button>
        <button
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => setLang('en')}
        >
          EN
        </button>
      </div>

      <div className="home-content">
        <h1 className="title">
          <span className="title-font">{t.title}</span>
          <span className="title-nitakuso">{t.titleSub}</span>
          <span className="title-game">{t.titleGame}</span>
        </h1>

        <button className="btn btn-start" onClick={onStart}>
          {t.start}
        </button>

        <p className="terms-agreement">{t.termsAgreement}</p>
      </div>

      <footer className="home-footer">
        <div className="footer-links">
          <button className="link-btn" onClick={onTerms}>
            {t.terms}
          </button>
          <span className="divider">|</span>
          <button className="link-btn" onClick={onPrivacy}>
            {t.privacy}
          </button>
          <span className="divider">|</span>
          <button className="link-btn" onClick={onLicenses}>
            {t.licenses}
          </button>
        </div>
        <p className="developer">
          {t.developer}: 特定非営利活動法人リハビリコラボレーション
        </p>
      </footer>
    </div>
  );
}
