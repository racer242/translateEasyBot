import translate from "@iamtraction/google-translate";

class Translator {
  constructor(langFrom = null, langTo = "en") {
    this.langFrom = langFrom;
    this.langTo = langTo;
  }

  async run(phrase) {
    let translation = null;
    let { langFrom } = this;
    try {
      let result = await translate(phrase, {
        from: langFrom,
        to: this.langTo,
      });
      translation = result.text;
      let langCorrected = null;
      let textCorrected = null;

      if (result.from.language.didYouMean) {
        langCorrected = result.from.language.iso;
      }

      if (!langFrom && langCorrected) {
        langFrom = langCorrected;
        result = await translate(phrase, {
          from: langFrom,
          to: this.langTo,
        });
        translation = result.text;
      }
      if (result.from.text.didYouMean) {
        textCorrected = result.from.text.value;
      }

      return {
        translation,
        langCorrected,
        textCorrected,
      };
    } catch (e) {
      console.log(e);
    }
    return translation;
  }

  setTo(langTo) {
    this.langTo = langTo;
  }

  setFrom(langFrom) {
    this.langFrom = langFrom;
  }
}

export default Translator;
