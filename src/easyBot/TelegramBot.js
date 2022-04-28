import { Telegraf, session, Markup, Telegram } from "telegraf"; // , Extra
import TelegrafI18n from "telegraf-i18n";
import commandMiddleware from "telegraf-cmd-args";
import axios from "axios";
import fs from "fs";
import locales from "../configuration/locales";
/**
 * [TelegramBot description]
 *
 */
class TelegramBot {
  bot;

  defaultLocale;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    process.once("SIGINT", () => this.stop("SIGINT"));
    process.once("SIGTERM", () => this.stop("SIGTERM"));
  }

  initCtx(ctx) {
    ctx.session ??= { to: this.defaultLocale, from: null };
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
    return langs;
  }

  async switchTo(ctx, to) {
    let message = `${locales[this.defaultLocale].toSet} ${
      locales[this.defaultLocale].lang[to]
    }`;
    let { translation } = await this.translate(
      ctx,
      message,
      this.defaultLocale,
      to
    );
    if (translation) {
      ctx.session.to = to;
      if (this.params?.onSetTo) {
        await this.params.onSetTo(to);
      }
      ctx.reply(translation, Markup.removeKeyboard());
    } else {
      ctx.reply(
        `${ctx.i18n.t("unknown")} ${locales[this.defaultLocale].lang[to]}`,
        Markup.removeKeyboard()
      );
    }
  }

  async switchFrom(ctx, from) {
    let message = `${locales[this.defaultLocale].fromSet} ${
      locales[this.defaultLocale].lang[from]
    }`;
    let { translation } = await this.translate(
      ctx,
      message,
      this.defaultLocale,
      from
    );
    if (translation) {
      ctx.session.from = from;
      if (this.params?.onSetFrom) {
        await this.params.onSetFrom(from);
      }
      ctx.reply(translation, Markup.removeKeyboard());
    } else {
      ctx.reply(
        `${ctx.i18n.t("unknown")} ${locales[this.defaultLocale].lang[from]}`,
        Markup.removeKeyboard()
      );
    }
  }

  init(params) {
    this.params = params;
    [this.defaultLocale] = Object.entries(locales).find(
      ([, value]) => value.isDefault
    );
    this.i18n = new TelegrafI18n({
      defaultLanguage: this.defaultLocale,
      allowMissing: false,
    });

    let cloneLocales = structuredClone(locales);

    Object.entries(cloneLocales).forEach(([key, value]) => {
      this.i18n.loadLocale(key, value);
    });

    this.bot.use(session());
    this.bot.use((ctx, next) => {
      this.initCtx(ctx);
      next();
    });
    this.bot.use(this.i18n.middleware());
    this.bot.use(commandMiddleware);

    this.bot.start((ctx) => {
      ctx.reply(
        ctx.i18n.t("start", {
          username: ctx.from.username,
        })
      );
    });

    this.bot.help((ctx) => {
      ctx.reply(
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
    });

    this.bot.command("to", (ctx) => {
      let to = ctx.state.command?.splitArgs[0];
      return this.switchTo(ctx, to);
    });

    this.bot.command("from", (ctx) => {
      let from = ctx.state.command?.splitArgs[0];
      return this.switchFrom(ctx, from);
    });

    this.bot.command("lang", async (ctx) => {
      ctx.reply(
        ctx.i18n.t("selectToLangButton"),
        Markup.keyboard(this.getLangMenu(ctx, ctx.i18n.t("to")))
          .oneTime()
          .resize()
      );
    });

    this.bot.action("selectToLang", async (ctx) => {
      ctx.reply(
        ctx.i18n.t("selectToLang"),
        Markup.keyboard(this.getLangMenu(ctx, ctx.i18n.t("to")))
          .oneTime()
          .resize()
      );
    });

    this.bot.action("selectFromLang", async (ctx) => {
      ctx.reply(
        ctx.i18n.t("selectFromLang"),
        Markup.keyboard(this.getLangMenu(ctx, ctx.i18n.t("from")))
          .oneTime()
          .resize()
      );
    });

    this.bot.action(/changeFromLang (.+)/, async (ctx) => {
      let lang = ctx.match[1];
      this.switchFrom(ctx, lang);
    });

    this.bot.hears(/(.+) .+ \((.+)\)/, async (ctx) => {
      let direction = ctx.match[1];
      let lang = ctx.match[2];
      if (direction === ctx.i18n.t("from")) {
        return this.switchFrom(ctx, lang);
      }
      return this.switchTo(ctx, lang);
    });

    this.bot.hears(/(.+)/, async (ctx) => {
      let { translation, langCorrected, textCorrected } = await this.translate(
        ctx,
        ctx.message.text,
        ctx.session.from,
        ctx.session.to
      );
      if (translation) {
        await ctx.reply(translation);
      } else {
        await ctx.reply(ctx.i18n.t("noTranslate"));
      }
      if (langCorrected) {
        await ctx.reply(
          `${ctx.i18n.t("langCorrected")} ${ctx.i18n.t(
            `lang.${langCorrected}`
          )}`
        );
        await ctx.reply(
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
        await ctx.reply(`${ctx.i18n.t("textCorrected")} ${textCorrected}`);
      }
    });
  }

  startDevMode() {
    console.log("Starting a bot in development mode");

    axios
      .get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/deleteWebhook`)
      .then(() => {
        this.bot.launch();
      });
  }

  async startProdMode() {
    console.log("Starting a bot in production mode without SSL");

    await this.bot.telegram.setWebhook(
      `${process.env.SERVER_URL}:${process.env.PORT}/${process.env.SECRET_URL}`
    );

    await this.bot.startWebhook(process.env.SECRET_URL, null, process.env.PORT);

    const webhookStatus = await Telegram.getWebhookInfo();
    console.log("Webhook status", webhookStatus);
  }

  async startSSLProdMode() {
    console.log("Starting a bot in production mode with SSL ");

    const tlsOptions = {
      key: fs.readFileSync("/credentials/server-key.pem"),
      cert: fs.readFileSync("/credentials/server-cert.pem"),
    };

    await this.bot.telegram.setWebhook(
      `${process.env.SERVER_URL}:${process.env.PORT}/${process.env.SECRET_URL}`
    );

    await this.bot.startWebhook(
      process.env.SECRET_URL,
      tlsOptions,
      process.env.PORT
    );

    const webhookStatus = await Telegram.getWebhookInfo();
    console.log("Webhook status", webhookStatus);
  }

  start() {
    if (process.env.NODE_ENV === "production") {
      if (process.env.USE_SSL) {
        this.startSSLProdMode();
      } else {
        this.startProdMode();
      }
    } else {
      this.startDevMode();
    }
  }

  webhookCallback() {
    return this.bot.webhookCallback(process.env.PROD_SECRET_SERVER_URL);
  }
}

export default TelegramBot;

/*
https://telegraf.js.org/classes/Context.html



https://telegraf.js.org/classes/Telegraf.html

bot methods:

action
catch
command
drop
email
gameQuery
guard
hashtag
hears
help
inlineQuery
launch
mention
phone
settings
spoiler
start
stop
textLink
textMention
url
use




on events:

"text"
"callback_query"
"message"
"channel_post"
"chat_member"
"chosen_inline_result"
"edited_channel_post"
"edited_message"
"inline_query"
"my_chat_member"
"pre_checkout_query"
"poll_answer"
"poll"
"shipping_query"
"chat_join_request"
"channel_chat_created"
"connected_website"
"delete_chat_photo"
"group_chat_created"
"invoice"
"left_chat_member"
"message_auto_delete_timer_changed"
"migrate_from_chat_id"
"migrate_to_chat_id"
"new_chat_members"
"new_chat_photo"
"new_chat_title"
"passport_data"
"proximity_alert_triggered"
"pinned_message"
"successful_payment"
"supergroup_chat_created"
"voice_chat_scheduled"
"voice_chat_started"
"voice_chat_ended"
"voice_chat_participants_invited"
"forward_date"
"animation"
"document"
"audio"
"contact"
"dice"
"game"
"location"
"photo"
"sticker"
"venue"
"video"
"video_note"
"voice"
*/
