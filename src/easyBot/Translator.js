import translate from "@iamtraction/google-translate";

class Translator {
  /**
   * Source language like "en", "fr", "ru"
   * @type {String}
   */
  langFrom;

  /**
   * Terget language like "en", "fr", "ru"
   * @type {String}
   */
  langTo;

  /**
   * Class constructor
   * @param {String} langFrom=null  Source language
   * @param {String} langTo="en"    Terget language
   */
  constructor(langFrom = null, langTo = "en") {
    this.langFrom = langFrom;
    this.langTo = langTo;
  }

  /**
   * Start translation
   * @param  {String}  phrase               Source phrase to translate
   * @return {Promise}        Translated phrase
   */
  async run(phrase) {
    let translation = null;
    let langCorrected = null;
    let textCorrected = null;
    try {
      let { langFrom } = this;
      let result = await translate(phrase, {
        from: langFrom,
        to: this.langTo,
      });
      translation = result.text;

      if (result?.from?.language?.didYouMean) {
        langCorrected = result.from.language.iso;
      }
      if (result?.from?.text?.didYouMean) {
        textCorrected = result.from.text.value;
      }
      if (!langFrom && langCorrected) {
        langFrom = langCorrected;
        result = await translate(phrase, {
          from: langFrom,
          to: this.langTo,
        });
        translation = result.text;
      }
      if (!textCorrected && result?.from?.text?.didYouMean) {
        textCorrected = result.from.text.value;
      }
    } catch (e) {
      console.log(e);
    }
    return {
      translation,
      langCorrected,
      textCorrected,
    };
  }

  /**
   * Set target language
   * @param {String} langTo  Target language
   */
  setTo(langTo) {
    this.langTo = langTo;
  }

  /**
   * Set source language
   * @param {String} langTo  Source language
   */
  setFrom(langFrom) {
    this.langFrom = langFrom;
  }
}

export default Translator;
