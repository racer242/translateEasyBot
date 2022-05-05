import { Telegraf, session } from "telegraf"; // , Extra
import TelegrafI18n from "telegraf-i18n";
import commandMiddleware from "telegraf-cmd-args";
import axios from "axios";
import fs from "fs";
import _ from "lodash";

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
    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }

  /**
   */
  async initCtx(ctx) {
    ctx.session ??= {};
  }

  /**
   */
  async getCommandsMenu(ctx) {
    return ctx ? [] : null;
  }

  async setCommandsMenu(ctx) {
    this.bot.telegram.setMyCommands(await this.getCommandsMenu(ctx));
  }

  async replyHelp(ctx) {
    ctx.replyWithHTML(ctx.i18n.t("help"));
  }

  /**
   */
  init(params) {
    this.params = params;

    [this.defaultLocale] = Object.entries(locales).find(
      ([, value]) => value.isDefault
    );

    this.i18n = new TelegrafI18n({
      defaultLanguage: this.defaultLocale,
      allowMissing: false,
    });

    let cloneLocales = _.cloneDeep(locales);

    Object.entries(cloneLocales).forEach(([key, value]) => {
      this.i18n.loadLocale(key, value);
    });

    this.bot.use(Telegraf.log());
    this.bot.use(session());
    this.bot.use(this.i18n.middleware());
    this.bot.use(commandMiddleware);
    this.bot.use((ctx, next) => {
      this.initCtx(ctx);
      next();
    });

    this.bot.start((ctx) => {
      this.setCommandsMenu(ctx);
      ctx.replyWithHTML(
        ctx.i18n.t("start", {
          username: ctx.from.username,
        })
      );
      ctx.replyWithHTML(ctx.i18n.t("help"));
    });

    this.bot.help((ctx) => {
      this.setCommandsMenu(ctx);
      this.replyHelp(ctx);
    });
  }

  async startDevMode() {
    console.log("Starting a bot in development mode");

    axios
      .get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/deleteWebhook`)
      .then(() => {
        this.bot.launch();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async startProdMode() {
    console.log("Starting a bot in production mode without SSL");

    this.bot.launch({
      webhook: {
        domain: process.env.SERVER_URL,
        port: process.env.PORT,
      },
    });
  }

  async startSSLProdMode() {
    console.log("Starting a bot in production mode with SSL");

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
  }

  start() {
    if (process.env.NODE_ENV === "production") {
      if (process.env.USE_SSL === "true") {
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
