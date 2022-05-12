import xlsx from "node-xlsx";

class VerbsLoader {
  path = "";

  data = [];

  constructor(path) {
    this.path = path;
  }

  read(path) {
    let result = null;
    try {
      result = xlsx.parse(path);
      if (!result) {
        console.log("Empty verbs file", path);
      }
    } catch (error) {
      console.log(error);
      result = null;
    }
    return result;
  }

  parse(raw) {
    let data = null;
    let sheet = raw.filter((v) => v.name === "irregular verbs")[0]?.data;
    if (sheet) {
      data = sheet.map(([pr, pa, pf]) => {
        return { pr, pa, pf };
      });
    }
    return data;
  }

  load() {
    let raw = this.read(this.path);
    if (raw) {
      this.data = this.parse(raw) ?? [];
    } else {
      throw new Error("Unable to load irregular verbs");
    }
  }

  find(verb) {
    let result = this.data.filter(
      (v) => v.pr === verb || v.pa === verb || v.pf === verb
    );
    return result.length > 0 ? result[0] : null;
  }
}

export default VerbsLoader;
