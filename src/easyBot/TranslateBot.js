import { Markup } from "telegraf"; // , Extra
import locales from "../configuration/locales";
import TelegramBot from "./TelegramBot";
/**
 * [TelegramBot description]
 *
 */
class TranslateBot extends TelegramBot {
  async initCtx(ctx) {
    ctx.session ??= { to: this.defaultLocale, from: null };
  }

  async getCommandsMenu(ctx) {
    return [
      { command: "/to", description: ctx.i18n.t("commands.to") },
      { command: "/from", description: ctx.i18n.t("commands.from") },
      {
        command: `/tomy`,
        description: ctx.i18n.t("commands.toLang"),
      },
      {
        command: `/frommy`,
        description: ctx.i18n.t("commands.fromLang"),
      },
      {
        command: `/swap`,
        description: ctx.i18n.t("commands.swap"),
      },
      { command: "/lang", description: ctx.i18n.t("commands.lang") },
      { command: "/help", description: ctx.i18n.t("commands.help") },
    ];
  }

  async replyHelp(ctx) {
    await ctx.replyWithHTML(
      ctx.i18n.t("help"),
      Markup.inlineKeyboard([
        Markup.button.callback(
          ctx.i18n.t("selectToLangButton") +
            (ctx.session.to ? ` (${ctx.session.to})` : ""),
          "selectToLang"
        ),
        Markup.button.callback(
          ctx.i18n.t("selectFromLangButton") +
            (ctx.session.from ? ` (${ctx.session.from})` : ""),
          "selectFromLang"
        ),
      ])
    );
  }

  async translate(ctx, text, from, to) {
    if (this.params?.onMessage) {
      let result = await this.params.onMessage(text, from, to);
      return result;
    }
    throw new Error(
      "Bot's onMessage callback isn't set. Define it in init params"
    );
  }

  getLangMenu(ctx, direction) {
    let languages = (locales[ctx.i18n.locale()] ?? locales[this.defaultLocale])
      .lang;
    delete languages.unknown;
    let langs = Object.entries(languages).map(([key, value]) => {
      return [`${direction} ${value} (${key})`];
    });
    langs.splice(0, 0, [ctx.i18n.t("cancel")]);
    return langs;
  }

  selectLang(ctx, dir) {
    ctx.replyWithHTML(
      ctx.i18n.t(dir === "to" ? "selectToLang" : "selectFromLang"),
      Markup.keyboard(this.getLangMenu(ctx, ctx.i18n.t(dir)))
        .oneTime()
        .resize()
    );
  }

  async testTranslation(ctx, lang) {
    let message = `${locales[this.defaultLocale].testLanguage} ${
      locales[this.defaultLocale].lang[lang]
    }`;
    let { translation } = await this.translate(
      ctx,
      message,
      this.defaultLocale,
      lang
    );
    return translation;
  }

  async switchLang(ctx, lang, dir) {
    if (!lang) {
      this.selectLang(ctx, dir);
      return;
    }
    let translation = await this.testTranslation(ctx, lang);
    if (translation) {
      ctx.session[dir] = lang;
      if (this.params?.onSetLang) {
        await this.params.onSetLang(lang, dir);
      }
      await ctx.replyWithHTML(translation);
      await ctx.replyWithHTML(
        ctx.i18n.t(dir === "to" ? "toSet" : "fromSet", {
          l: ctx.i18n.t(`lang.${lang}`),
        }),
        // `${ctx.i18n.t("toSet")} ${ctx.i18n.t(`lang.${lang}`)}`,
        Markup.removeKeyboard()
      );
    } else {
      let languages = (
        locales[ctx.i18n.locale()] ?? locales[this.defaultLocale]
      ).lang;
      if (languages[lang]) {
        ctx.replyWithHTML(
          ctx.i18n.t("unknown", { l: languages[lang] }),
          Markup.removeKeyboard()
        );
      } else {
        ctx.replyWithHTML(ctx.i18n.t("wrong"), Markup.removeKeyboard());
      }
    }
  }

  async init(params) {
    await super.init(params);

    this.bot.command("to", (ctx) => {
      let to = ctx.state.command?.splitArgs[0];
      this.switchLang(ctx, to, "to");
    });

    this.bot.command("from", (ctx) => {
      let from = ctx.state.command?.splitArgs[0];
      this.switchLang(ctx, from, "from");
    });

    this.bot.command("tomy", (ctx) => {
      let to = ctx.i18n.locale();
      this.switchLang(ctx, to, "to");
    });

    this.bot.command("frommy", (ctx) => {
      let from = ctx.i18n.locale();
      this.switchLang(ctx, from, "from");
    });

    this.bot.command("swap", async (ctx) => {
      let to = ctx.session.from ?? ctx.i18n.locale();
      let from = ctx.session.to ?? ctx.i18n.locale();
      await this.switchLang(ctx, to, "to");
      await this.switchLang(ctx, from, "from");
    });

    this.bot.command("lang", async (ctx) => {
      ctx.replyWithHTML(
        ctx.i18n.t("selectToLang"),
        Markup.keyboard(this.getLangMenu(ctx, ctx.i18n.t("to")))
          .oneTime()
          .resize()
      );
    });

    this.bot.action("selectToLang", async (ctx) => {
      ctx.replyWithHTML(
        ctx.i18n.t("selectToLang"),
        Markup.keyboard(this.getLangMenu(ctx, ctx.i18n.t("to")))
          .oneTime()
          .resize()
      );
    });

    this.bot.action("selectFromLang", async (ctx) => {
      ctx.replyWithHTML(
        ctx.i18n.t("selectFromLang"),
        Markup.keyboard(this.getLangMenu(ctx, ctx.i18n.t("from")))
          .oneTime()
          .resize()
      );
    });

    this.bot.action(/changeFromLang (.+)/, async (ctx) => {
      let lang = ctx.match[1];
      this.switchLang(ctx, lang, "from");
    });

    this.bot.on("sticker", (ctx) => {
      if (ctx.update?.message?.sticker?.emoji) {
        ctx.reply(ctx.update.message.sticker.emoji);
      } else {
        ctx.reply("🤷‍♂️");
      }
    });

    const captionReply = async (ctx) => {
      if (ctx.message?.caption) {
        let { translation: t } = await this.translate(
          ctx,
          ctx.message.caption,
          null,
          ctx.session.to
        );
        ctx.replyWithHTML(ctx.i18n.t("onCaption", { t }));
      }
    };

    this.bot.on("audio", async (ctx) => {
      if (ctx.update?.message?.audio) {
        let t = ctx.update.message.audio.title ?? ctx.i18n.t("nobodyKnows");
        let p = ctx.update.message.audio.performer ?? ctx.i18n.t("nobodyKnows");
        let { translation: tt } = await this.translate(
          ctx,
          t,
          null,
          ctx.session.to
        );
        let { translation: tp } = await this.translate(
          ctx,
          p,
          null,
          ctx.session.to
        );
        ctx.replyWithHTML(ctx.i18n.t("onAudio", { t, p, tt, tp }));
      } else {
        ctx.reply("🤷‍♂️");
      }
      captionReply(ctx);
    });
    this.bot.on("contact", async (ctx) => {
      if (ctx.update?.message?.contact) {
        let f =
          ctx.update.message.contact.first_name ?? ctx.i18n.t("nobodyKnows");
        let l =
          ctx.update.message.contact.last_name ?? ctx.i18n.t("nobodyKnows");
        let { translation: tf } = await this.translate(
          ctx,
          f,
          null,
          ctx.session.to
        );
        let { translation: tl } = await this.translate(
          ctx,
          l,
          null,
          ctx.session.to
        );
        ctx.replyWithHTML(ctx.i18n.t("onContact", { f, l, tf, tl }));
      } else {
        ctx.reply("🤷‍♂️");
      }
      captionReply(ctx);
    });

    const otherFormatsReply = async (ctx) => {
      ctx.replyWithHTML(ctx.i18n.t("iDontKnow"));
      captionReply(ctx);
    };

    this.bot.on("animation", otherFormatsReply);
    this.bot.on("document", otherFormatsReply);
    this.bot.on("dice", otherFormatsReply);
    this.bot.on("game", otherFormatsReply);
    this.bot.on("location", otherFormatsReply);
    this.bot.on("photo", otherFormatsReply);
    this.bot.on("venue", otherFormatsReply);
    this.bot.on("video", otherFormatsReply);
    this.bot.on("video_note", otherFormatsReply);
    this.bot.on("voice", otherFormatsReply);

    this.bot.hears(
      new RegExp(
        `^(${locales[this.defaultLocale].from}|${
          locales[this.defaultLocale].to
        }) .+ \\((.+)\\)`,
        "ig"
      ),
      // /^(.+) .+ \((.+)\)/
      async (ctx) => {
        let direction = ctx.match[1];
        let lang = ctx.match[2];
        if (direction === ctx.i18n.t("from")) {
          return this.switchLang(ctx, lang, "from");
        }
        if (direction === ctx.i18n.t("to")) {
          return this.switchLang(ctx, lang, "to");
        }
        return false;
      }
    );

    this.bot.hears(/✖️ .+/, async (ctx) => {
      ctx.replyWithHTML(ctx.i18n.t("canceled"), Markup.removeKeyboard());
    });

    const runTranslate = async (ctx) => {
      let { translation, langCorrected, textCorrected } = await this.translate(
        ctx,
        ctx.message.text,
        ctx.session.from,
        ctx.session.to
      );
      if (translation) {
        await ctx.replyWithHTML(translation);
      } else {
        await ctx.replyWithHTML(ctx.i18n.t("noTranslate"));
      }
      if (langCorrected) {
        await ctx.replyWithHTML(
          ctx.i18n.t("langCorrected", {
            l: ctx.i18n.t(`lang.${langCorrected}`),
          })
        );
        await ctx.replyWithHTML(
          ctx.i18n.t("changeProposal"),
          Markup.inlineKeyboard([
            Markup.button.callback(
              ctx.i18n.t("changeFromLangButton"),
              `changeFromLang ${langCorrected}`
            ),
          ])
        );
      }
      if (textCorrected) {
        await ctx.replyWithHTML(
          `${ctx.i18n.t("textCorrected")} ${textCorrected}`
        );
      }
    };

    this.bot.hears(/^\.\.\./, (ctx) => {
      if (ctx?.chat?.type === "group") {
        runTranslate(ctx);
      }
    });

    this.bot.hears(/(.+)/, (ctx) => {
      if (ctx?.chat?.type === "group") return;
      runTranslate(ctx);
    });
  }
}

export default TranslateBot;
