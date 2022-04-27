import express from "express";
import createError from "http-errors";
import logger from "morgan";

import path from "path";

import Translator from "./easyBot/Translator";
import TelegramBot from "./easyBot/TelegramBot";

const translator = new Translator();
const telegramBot = new TelegramBot();

telegramBot.init({
  onMessage: async (message, from, to) => {
    translator.setFrom(from);
    translator.setTo(to);
    let { translation, langCorrected, textCorrected } = await translator.run(
      message
    );
    console.log(`from ${translator.langFrom} to ${translator.langTo}`);
    console.log(translation);
    console.log(`corrected: lang=${langCorrected} text=${textCorrected}`);
    return { translation, langCorrected, textCorrected };
  },
  // onSetTo: async (lang) => {
  //   translator.setTo(lang);
  //   return translator.langTo;
  // },
  // onSetFrom: async (lang) => {
  //   translator.setFrom(lang);
  //   return translator.langFrom;
  // },
});
telegramBot.start();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/setup/to/:langTo", async (req, res) => {
  translator.setTo(req.params.langTo);
  res.json({
    status: true,
    message: `Set to language: ${req.params.langTo}`,
  });
});

app.get("/setup/from/:langFrom", async (req, res) => {
  translator.setFrom(req.params.langFrom);
  res.json({
    status: true,
    message: `Set from language: ${req.params.langFrom}`,
  });
});

app.get("/translate/:phrase", async (req, res) => {
  const { translation, langCorrected, textCorrected } = await translator.run(
    req.params.phrase
  );
  res.json({
    status: true,
    message: `From: (${req.params.phrase}) to: (${translation}), lang corrected: ${langCorrected}, text corrected: ${textCorrected}`,
  });
});

app.get("/", async (req, res) => {
  res.json({ status: true, message: "Our node.js app works" });
});

// catch 404 and forward to error   handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler //, next
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.end(err.message);
});

export default app;
