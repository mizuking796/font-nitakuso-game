export type Language = 'ja' | 'en';

export const translations = {
  ja: {
    // Home
    title: 'FONT',
    titleSub: 'ニタクソ',
    titleGame: 'GAME',
    subtitle: '2つのフォント、見分けられる？',
    start: 'START',
    termsAgreement: 'STARTを押すと利用規約・プライバシーポリシーに同意したものとみなします',
    licenses: 'ライセンス',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
    developer: '開発',

    // Game
    questionPrefix: '「',
    questionSuffix: '」はどっち？',
    correct: '正解！',
    wrong: '不正解...',
    next: '次へ',
    result: '結果を見る',

    // Result
    resultTitle: '結果発表',
    accuracy: '正答率',
    retry: 'もう一度',
    share: 'シェア',
    home: 'ホーム',
    left: '左',
    right: '右',

    // Licenses
    licensesTitle: 'ライセンス',
    licensesIntro: 'このゲームで使用しているフォントは全てGoogle Fontsから提供されており、SIL Open Font License (OFL) または Apache License 2.0 の下で配布されています。',
    fontsUsed: '約500種類のフォントを使用',
    back: '戻る',

    // Terms
    termsTitle: '利用規約',
    termsIntro: '本利用規約は、特定非営利活動法人リハビリコラボレーション（以下「当法人」）が提供する「フォントニタクソゲー」（以下「本サービス」）の利用条件を定めるものです。',
    termsAccept: '本サービスを利用することで、本規約に同意したものとみなします。',
    termsService: 'サービス内容',
    termsServiceDesc: '本サービスは、フォントの違いを当てるクイズゲームです。無料でご利用いただけます。',
    termsDisclaimer: '免責事項',
    termsDisclaimerDesc: '本サービスの利用により生じた損害について、当法人は一切の責任を負いません。',
    termsChange: '規約の変更',
    termsChangeDesc: '当法人は、必要に応じて本規約を変更することがあります。変更後の規約は、本サービス上に掲載した時点で効力を生じます。',

    // Privacy
    privacyTitle: 'プライバシーポリシー',
    privacyIntro: '特定非営利活動法人リハビリコラボレーション（以下「当法人」）は、本サービスにおける個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。',
    privacyCollect: '収集する情報',
    privacyCollectDesc: '本サービスでは、ゲーム改善を目的として以下の情報を収集する場合があります：',
    privacyCollectItems: ['各問題への回答結果（正解/不正解）', '正答率', '回答日時'],
    privacyNoPersonal: '個人情報について',
    privacyNoPersonalDesc: '本サービスでは、個人を特定できる情報（氏名、メールアドレス、IPアドレス等）は一切収集しません。',
    privacyPurpose: '利用目的',
    privacyPurposeDesc: '収集した情報は、問題の難易度調整やゲームバランスの改善にのみ使用します。',
    privacyThirdParty: '第三者提供',
    privacyThirdPartyDesc: '収集した情報を第三者に提供することはありません。',

    shareText: 'フォントニタクソゲーで{total}問中{score}問正解！（正答率: {percentage}%）\n\n{url}',
    copied: '結果をコピーしました！',
  },
  en: {
    // Home
    title: 'FONT',
    titleSub: 'NITAKUSO',
    titleGame: 'GAME',
    subtitle: 'Can you tell the difference?',
    start: 'START',
    termsAgreement: 'By pressing START, you agree to the Terms of Service and Privacy Policy',
    licenses: 'Licenses',
    terms: 'Terms',
    privacy: 'Privacy',
    developer: 'Developed by',

    // Game
    questionPrefix: 'Which is "',
    questionSuffix: '"?',
    correct: 'Correct!',
    wrong: 'Wrong...',
    next: 'Next',
    result: 'See Result',

    // Result
    resultTitle: 'Result',
    accuracy: 'Accuracy',
    retry: 'Retry',
    share: 'Share',
    home: 'Home',
    left: 'Left',
    right: 'Right',

    // Licenses
    licensesTitle: 'Licenses',
    licensesIntro: 'All fonts used in this game are provided by Google Fonts and distributed under the SIL Open Font License (OFL) or Apache License 2.0.',
    fontsUsed: 'Using approximately 500 fonts',
    back: 'Back',

    // Terms
    termsTitle: 'Terms of Service',
    termsIntro: 'These Terms of Service govern the use of "Font Nitakuso Game" (the "Service") provided by NPO Rehab Collaboration (the "Organization").',
    termsAccept: 'By using this Service, you agree to these Terms.',
    termsService: 'Service Description',
    termsServiceDesc: 'This Service is a quiz game where you guess the difference between fonts. It is free to use.',
    termsDisclaimer: 'Disclaimer',
    termsDisclaimerDesc: 'The Organization is not liable for any damages arising from the use of this Service.',
    termsChange: 'Changes to Terms',
    termsChangeDesc: 'The Organization may modify these Terms as necessary. Modified Terms become effective upon posting on this Service.',

    // Privacy
    privacyTitle: 'Privacy Policy',
    privacyIntro: 'NPO Rehab Collaboration (the "Organization") establishes the following Privacy Policy regarding the handling of information in this Service.',
    privacyCollect: 'Information Collected',
    privacyCollectDesc: 'This Service may collect the following information for game improvement purposes:',
    privacyCollectItems: ['Answer results for each question (correct/incorrect)', 'Accuracy rate', 'Answer timestamp'],
    privacyNoPersonal: 'Personal Information',
    privacyNoPersonalDesc: 'This Service does not collect any personally identifiable information (name, email address, IP address, etc.).',
    privacyPurpose: 'Purpose of Use',
    privacyPurposeDesc: 'Collected information is used only for adjusting question difficulty and improving game balance.',
    privacyThirdParty: 'Third Party Disclosure',
    privacyThirdPartyDesc: 'Collected information will not be disclosed to third parties.',

    shareText: 'Font Nitakuso Game: {score}/{total} correct! (Accuracy: {percentage}%)\n\n{url}',
    copied: 'Result copied!',
  },
} as const;

export type TranslationKey = keyof typeof translations.ja;
