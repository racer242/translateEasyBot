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
    <code>/to     </code> - you can choose the language to translate into
    <code>/from   </code> - you can choose the language from which to translate *
    <code>/to en  </code> - I will translate into this language
    <code>/from ru</code> - I will translate from this language
    <code>/tomy   </code> - I will translate into your native language
    <code>/frommy </code> - I will translate from your native language
    <code>/swap   </code> - I will swap languages
    <code>/lang   </code> - you can see all the languages I know

* I'm smart 🤖 I can guess what language you want to translate the phrase from. I will inform you about it.
    `,
    toSet: "👌 Now I will translate into this language:",
    fromSet: "👍 Now I will translate from this language:",
    unknown: "Language isn't supported:",
    noTranslate:
      "🤷‍♂️ I'm very embarrassed... I haven't learned this language yet:",
    selectToLangButton: "Translate to 👉",
    selectFromLangButton: "Translate from 👈",
    changeFromLangButton: "✅ Yes, translate from it! ",
    selectToLang: "👇 Choose which language I want to translate into",
    selectFromLang: "👇 Choose which language I want to translate from",
    to: "👉",
    from: "👈",
    langCorrected: "By the way, I guessed 🤟 what language you write in:",
    changeProposal: "Let me translate from this language?",
    textCorrected: "I found some typos here:",
    lang: getLang("en"),
    cancel: "✖️ cancel",
    canceled: "As you wish 🤖",
    commands: {
      toLang: "Translate to native language",
      fromLang: "Translate from native language",
      to: "Select the language to translate into",
      from: "Select the language to translate from",
      swap: "Swap languages",
      lang: "Look at the languages   I know",
      help: "I'll help in any way I can",
    },
  },
  ru: {
    start: `👋 Привет! Я бот-переводчик 🤖!
Я служу человекам 👨‍👩‍👦‍👦.
Напиши что-нибудь ✍️.
Я переведу это на другой язык 📓`,
    help: `Чем тебе помочь, человек❓
Я могу перевести на другой язык то что ты напишешь.
Меня для этого запрограммировал мой создатель 👨‍💻.

<b>Вот команды, которые я исполняю</b>:
    <code>/to     </code> - можешь выбрать язык на который переводить
    <code>/from   </code> - можешь выбрать язык с которого переводить *
    <code>/to ru  </code> - я буду переводить на этот язык
    <code>/from ru</code> - я буду переводить с этого языка
    <code>/tomy   </code> - я буду переводить на твой родной язык
    <code>/frommy </code> - я буду переводить с твоего родного языка
    <code>/swap   </code> - я поменяю языки местами
    <code>/lang   </code> - ты можешь посмотреть все языки, которые я знаю

* Я умный 🤖 Я могу сам догадаться, с какого языка ты хочешь перевести фразу. Я сообщу тебе об этом.
    `,
    toSet: "👌 Теперь я буду переводить на этот язык:",
    fromSet: "👍 Теперь я буду переводить с этого языка:",
    unknown: "🤷‍♂️ Мне очень неловко... Я еще не выучил этот язык:",
    noTranslate:
      "😱 Ой. Что-то с моими логическими схемами!  Я немного сломался...",
    selectToLangButton: "Переводить на 👉",
    selectFromLangButton: "Переводить с 👈",
    changeFromLangButton: "✅ Да, переводи с него!",
    selectToLang: "👇 Выбери, на какой язык мне переводить",
    selectFromLang: "👇 Выбери, с какого языка мне переводить",
    to: "👉",
    from: "👈",
    langCorrected: "Кстати, я догадался 🤟 на каком языке ты пишешь:",
    changeProposal: "Давай буду переводить с этого языка?",
    textCorrected: "Хмм... 👀 Я тут обнаружил у тебя опечатки:",
    lang: getLang("ru"),
    cancel: "✖️ отменить",
    canceled: "Как пожелаешь 🤖",
    commands: {
      toLang: "Переводить на родной язык",
      fromLang: "Переводить с родного языка",
      to: "Выбери язык, на который переводить",
      from: "Выбери язык, с которого переводить",
      swap: "Меняю языки местами",
      lang: "Посмотри языки, которые я знаю",
      help: "Помогу, чем смогу",
    },
  },
};

export default locales;
