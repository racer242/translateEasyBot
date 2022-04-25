const locales = {
  en: {
    isDefault: true,
    start: "Hey! Write a phrase, and I will translate it!",
    help: `To translate phrase, you need just write it!
    /to - set target Language
    /from - set source language`,
    toSet: "Target language set successfully",
    fromSet: "Source language set successfully",
    unknown: "Language is unknown:",
    noTranslate: "I cant't :(",
  },
  ru: {
    start: "Привет! Напиши какую-нибудь фразу, а я её переведу!",
    help: `Чтобы перевести фразу, просто напиши ее!
    /to lang - set target Language
    /from lang - set source language`,
    toSet: "Целевой язык успешно установлен на",
    fromSet: "Исходный язык успешно установлен на",
    unknown: "Этот язык неизвестен:",
    noTranslate: "У меня не получается :(",
  },
};

export default locales;
