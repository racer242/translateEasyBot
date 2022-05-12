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

I can also translate stickers into emoji 🥸 - it's just out of curiosity.
In addition, you can drop audio into the chat 🎵, I will translate the name and musician. God, what am I doing?...
I also accept contacts - this is if you are interested to know how the name and surname are translated

<b>Here are the commands I am running</b>:
    <code>/to     </code> ‒ you can choose the language to translate into
    <code>/from   </code> ‒ you can choose the language from which to translate *
    <code>/to en  </code> ‒ I will translate into this language
    <code>/from ru</code> ‒ I will translate from this language
    <code>/tomy   </code> ‒ I will translate into your native language
    <code>/frommy </code> ‒ I will translate from your native language
    <code>/swap   </code> ‒ I will swap languages
    <code>/lang   </code> ‒ you can see all the languages I know

<b>And there are commands for the English language</b>:
        /verb  ‒ I'll check the verb - what if it's wrong?!

If I am in your group, I will respond to the three dots <code>...</code>

* I'm smart 🤖 I can guess what language you want to translate the phrase from. I will inform you about it.
    `,
    toSet: "👌 Now I will translate into ${l}",
    fromSet: "👍 Now I will translate from ${l}",
    unknown: "🤷‍♂️ I'm really embarrassed... I haven't learned ${l} yet",
    wrong:
      "Pfft... 🤦‍♂️ These stupid people... What kind of language is this? You have to enter the code according to ISO 639‒1",
    noTranslate:
      "😱 Oops. Something's wrong with my logic circuits! I'm a little broken...",
    selectToLang: "👇 Choose which language I want to translate into",
    selectFromLang: "👇 Choose which language I want to translate from",
    to: "👉",
    from: "👈",
    langCorrected: "By the way, I figured it out! 🤟 It's ${l}",
    changeProposal: "Shall I translate from this language?",
    textCorrected: "Hmm... 👀 I just found your typos:",
    lang: getLang("en"),
    cancel: "✖️ cancel",
    canceled: "As you wish 🤖",
    testLanguage: "WOW! 🤟 I speak ",
    commands: {
      toLang: "Translate to native language",
      fromLang: "Translate from native language",
      to: "Select the language to translate into",
      from: "Select the language to translate from",
      swap: "Swap languages",
      lang: "Look at the languages I know",
      verb: "Check English verb",
      help: "I'll help in any way I can",
    },
    onAudio:
      "🎶 Title <code>${t}</code> ‒ <code>${tt}</code> \n🎸 Performer <code>${p}</code> ‒ <code>${tp}</code>",
    onContact: "🐵 First name\n${f}\n${tf}\n\n🙈 Last name\n${l }\n${tl}",
    onCaption:
      "☝️ By the way, a comment has been added to the attachment:\n${t}",
    nobodyKnows: "🤷‍♂️ unknown",
    iDontKnow: "🤷‍♂️ Can't say anything about this attachment yet...",
    selectToLangButton: "Translate to 👉",
    selectFromLangButton: "Translate from 👈",
    changeFromLangButton: "✅ Transfer from it, piece of iron!",
    verbNotSpecified: "🤷‍ Enter the verb then?! 👇",
    verbFound: "Yes! It's an irregular verb! 👽",
    verbNotFound: "The verb is regular! 🦾 Or I don't know something... ",
    verbForms: `Verb forms are as follows: 👇
      <code>1. Iinfinitive: \${pr}</code>
      <code>2. Simple Past: \${pa}</code>
      <code>3. Past participle: \${pf}</code>
    `,
  },
  ru: {
    start: `👋 Привет! Я бот‒переводчик 🤖!
Я служу человекам 👨‍👩‍👦‍👦.
Напиши что‒нибудь ✍️.
Я переведу это на другой язык 📓`,
    help: `Чем тебе помочь, человек❓
Я могу перевести на другой язык то что ты напишешь.
Меня для этого запрограммировал мой создатель 👨‍💻.

Еще я умею переводить стикеры в эмоджи 🥸 ‒ это просто из любознательности.
Кроме того, Можешь закинуть в чат 🎵 аудио, я переведу название и музыканта. Боже, 🤔 чем я занимаюсь?...
Еще принимаю контакты ‒ это если интересно узнать как переводятся имя и фамилия

<b>Вот команды, которые я исполняю</b>:
    <code>/to     </code> ‒ можешь выбрать язык на который переводить
    <code>/from   </code> ‒ можешь выбрать язык с которого переводить *
    <code>/swap   </code> ‒ я поменяю языки местами
    <code>/to ru  </code> ‒ я буду переводить на этот язык
    <code>/from ru</code> ‒ я буду переводить с этого языка
    <code>/tomy   </code> ‒ я буду переводить на твой родной язык
    <code>/frommy </code> ‒ я буду переводить с твоего родного языка
    <code>/lang   </code> ‒ ты можешь посмотреть все языки, которые я знаю

<b>А еще есть команды для Английского языка</b>:
    <code>/verb   </code> ‒ я проверю глагол - вдруг он неправильный?!

Если я сижу в твоей группе, буду откликаться на троеточе <code>...</code>

* Я умный 🤖 Я могу сам догадаться, с какого языка ты хочешь перевести фразу. Я сообщу тебе об этом.
    `,
    toSet: "👌 Теперь я буду переводить на ${l} язык",
    fromSet: "👍 Теперь язык, с которого я буду переводить ‒ ${l}",
    unknown: "🤷‍♂️ Мне очень неловко... Я еще не выучил ${l} язык",
    wrong:
      "Пфф... 🤦‍♂️ Эти несмышлёные человеки... Что это вообще за язык такой? Надо вводить код по ISO 639‒1",
    noTranslate:
      "😱 Ой. Что‒то с моими логическими схемами!  Я немного сломался...",
    selectToLang: "👇 Выбери, на какой язык мне переводить",
    selectFromLang: "👇 Выбери, с какого языка мне переводить",
    to: "👉",
    from: "👈",
    langCorrected: "Кстати, я догадался! 🤟 Это ${l} язык",
    changeProposal: "Давай буду переводить с этого языка?",
    textCorrected: "Хмм... 👀 Я тут обнаружил у тебя опечатки:",
    lang: getLang("ru"),
    cancel: "✖️ отменить",
    canceled: "Как пожелаешь 🤖",
    testLanguage: "ОГО! 🤟 Я говорю по‒",
    commands: {
      toLang: "Переводить на родной язык",
      fromLang: "Переводить с родного языка",
      to: "Выбери язык, на который переводить",
      from: "Выбери язык, с которого переводить",
      swap: "Меняю языки местами",
      lang: "Посмотри языки, которые я знаю",
      verb: "Проверить английский глагол",
      help: "Помогу, чем смогу",
    },
    onAudio:
      "🎶 <b>Песня</b>\n<code>${t}</code>\n<code>${tt}</code>\n\n🎸 Исполняет\n<code>${p}</code>\n<code>${tp}</code>",
    onContact:
      "🐵 <b>Имя</b>\n<code>${f}</code>\n<code>${tf}</code>\n\n🙈 Фамилия\n<code>${l}</code>\n<code>${tl}</code>",
    onCaption: "☝️ Кстати, к вложению добавлен комметарий:\n<code>${t}</code>",
    nobodyKnows: "🤷‍♂️ неизвестно",
    iDontKnow: "🤷‍♂️ Пока ничего не могу сказать по поводу этого вложения...",
    selectToLangButton: "Переводить на 👉",
    selectFromLangButton: "Переводить с 👈",
    changeFromLangButton: "✅ Переводи с него, железяка!",
    verbNotSpecified: "🤷‍ Ты глагол то введи?! 👇",
    verbFound: "Есть! Это неправильный глагол! 👽",
    verbNotFound: "А глагол-то правильный! 🦾 Или я чего-то не знаю...",
    verbForms: `Формы у глагола получаются такие: 👇
      <code>1. Iinfinitive:     \${pr}</code>
      <code>2. Simple Past:     \${pa}</code>
      <code>3. Past participle: \${pf}</code>
    `,
  },
};

export default locales;
