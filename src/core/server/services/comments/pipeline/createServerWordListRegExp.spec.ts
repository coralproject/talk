import RE2 from "re2";

import createServerWordListRegEx from "coral-server/services/comments/pipeline/createServerWordListRegEx";

const buildTester = (re: RE2) => (str: string) => re.test(str);

const buildSplitter = (re: RE2) => (str: string) => str.split(re);

describe("en-US", () => {
  const re = createServerWordListRegEx("en-US", [
    "bad",
    "french fries",
    "worse",
    "jalapeño",
    "1km",
  ]);

  const test = buildTester(re);

  it("test words in the list", () => {
    expect(test("bad")).toBeTruthy();
    expect(test("worse")).toBeTruthy();
    expect(test("1km")).toBeTruthy();
  });

  it("test repeated words in the list", () => {
    expect(test("bad bad bad")).toBeTruthy();
    expect(test("worse worse worse")).toBeTruthy();
  });

  it("test words not in the list", () => {
    expect(test("fine")).toBeFalsy();
    expect(test("ok")).toBeFalsy();
  });

  it("test words that end with a unicode character", () => {
    expect(test("I have one jalapeño.")).toBeTruthy();
    expect(test("I have two jalapeños.")).toBeFalsy();
  });

  it("test words in the list while being case insensitive", () => {
    expect(test("Bad")).toBeTruthy();
    expect(test("BAd")).toBeTruthy();
    expect(test("BAD")).toBeTruthy();
    expect(test("bAD")).toBeTruthy();
    expect(test("baD")).toBeTruthy();
    expect(test("bAd")).toBeTruthy();
    expect(test("1KM")).toBeTruthy();
  });

  it("test multi-words", () => {
    expect(test("french fries")).toBeTruthy();
    expect(test("french!fries")).toBeTruthy();
    expect(test("french.fries")).toBeTruthy();
    expect(test("french?fries")).toBeTruthy();
    expect(test("french¿fries")).toBeTruthy();
    expect(test("french:fries")).toBeTruthy();
    expect(test("french;fries")).toBeTruthy();
  });

  it("test words at the end of a sentence", () => {
    expect(test("this sentence is bad.")).toBeTruthy();
    expect(test("this sentence is worse.")).toBeTruthy();
    expect(test("this sentence has french fries.")).toBeTruthy();
    expect(test("this sentence has french!fries.")).toBeTruthy();
    expect(test("this sentence has french.fries.")).toBeTruthy();
    expect(test("this sentence has french?fries.")).toBeTruthy();
    expect(test("this sentence has french¿fries.")).toBeTruthy();
    expect(test("this sentence has french:fries.")).toBeTruthy();
    expect(test("this sentence has french;fries.")).toBeTruthy();
  });

  it("test words at the start of a sentence", () => {
    expect(test("bad is the start of the sentence.")).toBeTruthy();
    expect(test("worse is the start of the sentence.")).toBeTruthy();
    expect(test("french fries is the start of the sentence.")).toBeTruthy();
  });

  it("test does not preserve state", () => {
    expect(test("bad 1")).toBeTruthy();
    expect(test("bad 2")).toBeTruthy();
    expect(test("more bad 3")).toBeTruthy();
    expect(test("more bad 4")).toBeTruthy();
  });

  it("test repeated words", () => {
    expect(test("This is bad bad, very bad")).toBeTruthy();
  });

  it("test does not match substrings", () => {
    expect(test("baddd")).toBeFalsy();
    expect(test("wwworse")).toBeFalsy();
    expect(test("fffrench fries")).toBeFalsy();
  });

  it("test handles when there are numbers", () => {
    expect(test("bad3")).toBeTruthy();
    expect(test("3bad")).toBeTruthy();
  });

  const split = buildSplitter(re);

  it("splits the words in a sentence correctly", () => {
    expect(split("this sentence is bad.")).toMatchInlineSnapshot(`
      Array [
        "this sentence is",
        " ",
        "bad",
        ".",
        "",
      ]
    `);
    expect(split("this sentence is worse.")).toMatchInlineSnapshot(`
      Array [
        "this sentence is",
        " ",
        "worse",
        ".",
        "",
      ]
    `);
  });

  it("splits words when there are repeat words", () => {
    expect(split("This is bad bad, very BAD.")).toMatchInlineSnapshot(`
      Array [
        "This is",
        " ",
        "bad",
        " ",
        "bad, very",
        " ",
        "BAD",
        ".",
        "",
      ]
    `);
  });

  it("splits the words with unicode in a sentence correctly", () => {
    expect(split("this sentence has one jalapeño.")).toMatchInlineSnapshot(`
      Array [
        "this sentence has one",
        " ",
        "jalapeño",
        ".",
        "",
      ]
    `);
    expect(split("this sentence has many jalapeños.")).toMatchInlineSnapshot(`
      Array [
        "this sentence has many jalapeños.",
      ]
    `);
  });

  it("splits the multi-words in a sentence correctly", () => {
    expect(split("this sentence has french fries.")).toMatchInlineSnapshot(`
      Array [
        "this sentence has",
        " ",
        "french fries",
        ".",
        "",
      ]
    `);
    expect(split("this sentence has french;fries.")).toMatchInlineSnapshot(`
      Array [
        "this sentence has",
        " ",
        "french;fries",
        ".",
        "",
      ]
    `);
    expect(split("this sentence has french!fries.")).toMatchInlineSnapshot(`
      Array [
        "this sentence has",
        " ",
        "french!fries",
        ".",
        "",
      ]
    `);
    expect(split("this sentence has french.fries.")).toMatchInlineSnapshot(`
      Array [
        "this sentence has",
        " ",
        "french.fries",
        ".",
        "",
      ]
    `);
    expect(split("this sentence has french?fries.")).toMatchInlineSnapshot(`
      Array [
        "this sentence has",
        " ",
        "french?fries",
        ".",
        "",
      ]
    `);
    expect(split("this sentence has french¿fries.")).toMatchInlineSnapshot(`
      Array [
        "this sentence has",
        " ",
        "french¿fries",
        ".",
        "",
      ]
    `);
    expect(split("this sentence has french:fries.")).toMatchInlineSnapshot(`
      Array [
        "this sentence has",
        " ",
        "french:fries",
        ".",
        "",
      ]
    `);
  });
});

describe("es", () => {
  const re = createServerWordListRegEx("es", ["adónde vas", "tú"]);

  const test = buildTester(re);

  it("test words in the list", () => {
    expect(test("Pablo, ¿adónde vas?")).toBeTruthy();
    expect(test("Estoy cansado, ¿y tú?")).toBeTruthy();
    expect(test("¿tú?")).toBeTruthy();
  });
});

describe("pt-BR", () => {
  const re = createServerWordListRegEx("pt-BR", [
    "bi",
    "outro",
    "café",
    "m e r d a",
    "Como fazer coisas ruins",
  ]);

  const test = buildTester(re);

  it("test words in the list", () => {
    expect(test("biólogo se soletra com: bi ")).toBeTruthy();
    expect(test("m.e.r.d.a")).toBeTruthy();
    expect(test("não tomo café pois faz mal")).toBeTruthy();
    expect(test("Como fazer coisas ruins")).toBeTruthy();
  });

  it("test words not in the list", () => {
    expect(test("O biólogo recomenda este artigo")).toBeFalsy();
    expect(test("cafe")).toBeFalsy();
    expect(test("Ser banido é uma merda")).toBeFalsy();
  });

  const split = buildSplitter(re);

  it("splits the words with unicode in a sentence correctly", () => {
    expect(split("biólogo se soletra com: bi ")).toMatchInlineSnapshot(`
      Array [
        "biólogo se soletra com",
        ": ",
        "bi",
        " ",
        "",
      ]
    `);
    expect(split("m.e.r.d.a")).toMatchInlineSnapshot(`
      Array [
        "",
        "",
        "m.e.r.d.a",
        "",
        "",
      ]
    `);
    expect(split("não tomo café pois faz mal")).toMatchInlineSnapshot(`
      Array [
        "não tomo",
        " ",
        "café",
        " ",
        "pois faz mal",
      ]
    `);
    expect(split("Como fazer coisas ruins")).toMatchInlineSnapshot(`
      Array [
        "",
        "",
        "Como fazer coisas ruins",
        "",
        "",
      ]
    `);
    expect(split("O biólogo recomenda este artigo")).toMatchInlineSnapshot(`
      Array [
        "O biólogo recomenda este artigo",
      ]
    `);
    expect(split("cafe")).toMatchInlineSnapshot(`
      Array [
        "cafe",
      ]
    `);
    expect(split("Ser banido é uma merda")).toMatchInlineSnapshot(`
      Array [
        "Ser banido é uma merda",
      ]
    `);
  });
});
