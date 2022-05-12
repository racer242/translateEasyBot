import VerbsLoader from "../../helpers/VerbsLoader";
import settings from "../../configuration/settings";

describe("VerbsLoader", () => {
  let verbsLoader;

  beforeEach(() => {
    verbsLoader = new VerbsLoader(settings.irregularVerbsSourcePath);
  });

  test("should parse", async () => {
    let data = verbsLoader.parse([
      { name: "irregular verbs", data: [["1", "2", "3", "4"]] },
    ]);
    expect(data[0].pr).toBe("1");
    expect(data[0].pa).toBe("2");
    expect(data[0].pf).toBe("3");
  });

  test("should not parse", async () => {
    let data1 = verbsLoader.parse([
      { name: "some name", data: [["1", "2", "3", "4"]] },
    ]);
    let data2 = verbsLoader.parse([{ name: "irregular verbs", data: [] }]);
    expect(data1).toBeNull();
    expect(data2).toEqual([]);
  });

  test("should load verbs file", async () => {
    verbsLoader.load();
    expect(verbsLoader.data).toBeInstanceOf(Array);
    expect(verbsLoader.data.length).toBeGreaterThan(0);
  });

  test("should throw error if wrong path", async () => {
    verbsLoader.path = "";
    expect(() => {
      verbsLoader.load();
    }).toThrow();
  });

  test("should find", async () => {
    verbsLoader.load();
    expect(verbsLoader.find("go").pf).toBe("gone");
  });

  test("shouldn't find", async () => {
    verbsLoader.load();
    expect(verbsLoader.find("test")).toBeNull();
  });
});
