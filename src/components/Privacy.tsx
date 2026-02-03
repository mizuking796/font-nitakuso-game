import { useLanguage } from '../i18n/LanguageContext';

interface PrivacyProps {
  onBack: () => void;
}

export function Privacy({ onBack }: PrivacyProps) {
  const { t } = useLanguage();

  return (
    <div className="terms">
      <h2>{t.privacyTitle}</h2>

      <p className="terms-intro">{t.privacyIntro}</p>

      <section>
        <h3>{t.privacyCollect}</h3>
        <p>{t.privacyCollectDesc}</p>
        <ul>
          {t.privacyCollectItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>{t.privacyNoPersonal}</h3>
        <p>{t.privacyNoPersonalDesc}</p>
      </section>

      <section>
        <h3>{t.privacyPurpose}</h3>
        <p>{t.privacyPurposeDesc}</p>
      </section>

      <section>
        <h3>{t.privacyThirdParty}</h3>
        <p>{t.privacyThirdPartyDesc}</p>
      </section>

      <button className="btn btn-secondary" onClick={onBack}>
        {t.back}
      </button>
    </div>
  );
}
