import getLang from "./languages";

const locales = {
  en: {
    isDefault: true,
    start: `👋 Hello! I'm a translator bot 🤖!
I serve people 👨‍👩‍👦‍👦.
Write something ✍️.
I will translate it into another language 📓`,
    help: `How can I help you man?
I can translate into another language what you write.
I was programmed for this by my creator 👨‍💻.
Here are the commands I am running:
    /to ru - I will translate into this language
    /from ru - I will translate from this language
    /lang - you can see all the languages   I know`,
    toSet: "👌 Now I will translate into this language:",
    fromSet: "👍 Now I will translate from this language:",
    unknown: "Language isn't supported:",
    noTranslate:
      "🤷‍♂️ I'm very embarrassed... I haven't learned this language yet:",
    selectToLangButton: "Translate to 👉",
    selectFromLangButton: "Translate from 👈",
    selectToLang: "👇 Choose which language I want to translate into",
    selectFromLang: "👇 Choose which language I want to translate from",
    to: "👉",
    from: "👈",
    langCorrected: "By the way, I guessed that you wrote in the language:",
    textCorrected: "I found some typos here:",
    lang: getLang("en"),
  },
  ru: {
    start: `👋 Привет! Я бот-переводчик 🤖!
Я служу человекам 👨‍👩‍👦‍👦.
Напиши что-нибудь ✍️.
Я переведу это на другой язык 📓`,
    help: `Чем тебе помочь, человек❓
Я могу перевести на другой язык то что ты напишешь.
Меня для этого запрограммировал мой создатель 👨‍💻.
Вот команды, которые я исполняю:
    /to ru - я буду переводить на этот язык
    /from ru - я буду переводить с этого языка
    /lang - ты можешь посмотреть все языки, которые я знаю`,
    toSet: "👌 Теперь я буду переводить на этот язык:",
    fromSet: "👍 Теперь я буду переводить с этого языка:",
    unknown: "🤷‍♂️ Мне очень неловко... Я еще не выучил этот язык:",
    noTranslate:
      "😱 Ой. Что-то с моими логическими схемами!  Я немного сломался...",
    selectToLangButton: "Переводить на 👉",
    selectFromLangButton: "Переводить с 👈",
    selectToLang: "👇 Выбери, на какой язык мне переводить",
    selectFromLang: "👇 Выбери, с какого языка мне переводить",
    to: "👉",
    from: "👈",
    langCorrected: "By the way, I guessed 🤟! You wrote it in the language:",
    textCorrected: "Hmm... 👀 I just found your typos:",
    lang: getLang("ru"),
  },
};

export default locales;
