import { Telegraf, session } from "telegraf";
import TelegrafI18n from "telegraf-i18n";
import commandMiddleware from "telegraf-cmd-args";
import locales from "../configuration/locales";

/**
 * [TelegramBot description]
 *
 */
class TelegramBot {
  bot;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    process.once("SIGINT", () => this.stop("SIGINT"));
    process.once("SIGTERM", () => this.stop("SIGTERM"));
  }

  init(params) {
    this.params = params;
    this.i18n = new TelegrafI18n({
      defaultLanguage: Object.entries(locales).find(
        ([, value]) => value.isDefault
      ),
      allowMissing: false,
    });

    Object.entries(locales).forEach(([key, value]) => {
      this.i18n.loadLocale(key, value);
    });

    const initCtx = (ctx) => {
      ctx.session ??= { to: "en", from: null };
    };

    const translate = async (ctx, text, from, to) => {
      if (params?.onMessage) {
        let result = await params.onMessage(text, from, to);
        return result;
      }
      throw new Error(
        "Bot's onMessage callback isn't set. Define it in init params"
      );
    };

    this.bot.use(session());
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
      ctx.reply(ctx.i18n.t("help"));
    });

    this.bot.command("to", async (ctx) => {
      initCtx(ctx);
      let to = ctx.state.command?.splitArgs[0];
      let message = `${ctx.i18n.t("toSet")} ${to}`;
      let translated = await translate(ctx, message, ctx.session.from, to);
      if (translated) {
        ctx.session.to = to;
        if (params?.onSetTo) {
          await params.onSetTo(to);
        }
        ctx.reply(translated);
      } else {
        ctx.reply(`${ctx.i18n.t("unknown")} ${to}`);
      }
    });

    this.bot.command("from", async (ctx) => {
      initCtx(ctx);
      let from = ctx.state.command?.splitArgs[0];
      let message = `${ctx.i18n.t("fromSet")} ${from}`;
      let translated = await translate(ctx, message, from, ctx.session.to);
      if (translated) {
        ctx.session.from = from;
        if (params?.onSetFrom) {
          await params.onSetFrom(from);
        }
        ctx.reply(translated);
      } else {
        ctx.reply(`${ctx.i18n.t("unknown")} ${from}`);
      }
    });

    this.bot.hears(/(.+)/, async (ctx) => {
      initCtx(ctx);
      let translated = await translate(
        ctx,
        ctx.message.text,
        ctx.session.from,
        ctx.session.to
      );
      if (translated) {
        ctx.reply(translated);
      } else {
        ctx.reply(ctx.i18n.t("noTranslate"));
      }
    });
  }

  start() {
    this.bot.launch();
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
