import translate from "@iamtraction/google-translate";
import Translator from "../../easybot/Translator";

jest.mock("@iamtraction/google-translate");

describe("Translate function run", () => {
  let translator;
  let phrase;
  let result;
  let resp;

  beforeEach(() => {
    translator = new Translator();
  });

  let testFunc = async () => {
    translate.mockImplementation(() => {
      return Promise.resolve(resp);
    });

    let translation = await translator.run(phrase);
    return translation;
  };

  test("should translate correct phrase", async () => {
    phrase = "Проверка";
    result = "Check";
    resp = { text: result };
    const { translation, langCorrected, textCorrected } = await testFunc();
    expect(translation).toBe(result);
    expect(langCorrected).toBeNull();
    expect(textCorrected).toBeNull();
  });

  test("should translate incorrect phrase and correct text", async () => {
    phrase = "Проврка";
    result = "Check";
    resp = {
      text: result,
      from: {
        language: { didYouMean: false, iso: "" },
        text: { didYouMean: true, value: "Check" },
      },
    };
    const { translation, langCorrected, textCorrected } = await testFunc();
    expect(translation).toBe(result);
    expect(langCorrected).toBeNull();
    expect(textCorrected).not.toBeNull();
  });

  test("should translate incorrect phrase and change lang", async () => {
    phrase = "Проврка";
    result = "Check";
    resp = {
      text: result,
      from: {
        language: { didYouMean: true, iso: "sr" },
        text: { didYouMean: false, value: "" },
      },
    };
    const { translation, langCorrected, textCorrected } = await testFunc();
    expect(translation).toBe(result);
    expect(langCorrected).not.toBeNull();
    expect(textCorrected).toBeNull();
  });

  test("should return nulls if empty response", async () => {
    phrase = "Проверка";
    resp = null;
    const { translation, langCorrected, textCorrected } = await testFunc();
    expect(translation).toBeNull();
    expect(langCorrected).toBeNull();
    expect(textCorrected).toBeNull();
  });

  test("should return nulls if exception", async () => {
    phrase = "Проверка";
    translate.mockImplementation(() => {
      throw new Error("Some error occured!");
    });

    const { translation, langCorrected, textCorrected } = await translator.run(
      phrase
    );
    expect(translation).toBeNull();
    expect(langCorrected).toBeNull();
    expect(textCorrected).toBeNull();
  });
});

describe("Setup functions", () => {
  let translator;
  let lang;
  beforeEach(() => {
    translator = new Translator();
    lang = "ru";
  });
  test("should set target language", async () => {
    translator.setTo(lang);
    expect(translator.langTo).toEqual(lang);
  });
  test("should set source language", async () => {
    translator.setFrom(lang);
    expect(translator.langFrom).toEqual(lang);
  });
});
