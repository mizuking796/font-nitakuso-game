import { useLanguage } from '../i18n/LanguageContext';

interface TermsProps {
  onBack: () => void;
}

export function Terms({ onBack }: TermsProps) {
  const { t } = useLanguage();

  return (
    <div className="terms">
      <h2>{t.termsTitle}</h2>

      <p className="terms-intro">{t.termsIntro}</p>
      <p>{t.termsAccept}</p>

      <section>
        <h3>{t.termsService}</h3>
        <p>{t.termsServiceDesc}</p>
      </section>

      <section>
        <h3>{t.termsDisclaimer}</h3>
        <p>{t.termsDisclaimerDesc}</p>
      </section>

      <section>
        <h3>{t.termsChange}</h3>
        <p>{t.termsChangeDesc}</p>
      </section>

      <button className="btn btn-secondary" onClick={onBack}>
        {t.back}
      </button>
    </div>
  );
}
