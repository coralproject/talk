import {
  Options,
  WordList,
} from "coral-server/services/comments/pipeline/wordList";

describe("en-US", () => {
  const list = new WordList();
  const options: Options = {
    id: "tenant_1",
    locale: "en-US",
    wordList: {
      banned: [
        "cookies",
        "how to do bad things",
        "how to do really bad things",
        "s h i t",
        "$hit",
        "p**ch",
        "p*ch",
        "banned",
        "ban",
      ],
      suspect: [],
    },
  };

  describe("containsMatchingPhrase", () => {
    it("does match on a word in the list", () => {
      [
        "how to do really bad things",
        "what is cookies",
        "cookies",
        "COOKIES.",
        "how to do bad things",
        "How To do bad things!",
        "How.To.do.bad.things!",
        "This stuff is $hit!",
        "This is a test.\nTo see if cookies are found, in the second line.",
        "That's a p**ch!",
        "Banned words should be detected",
      ].forEach(word => {
        expect(list.test(options, "banned", word)).toEqual(true);
      });
    });

    it("does not match on a word not in the list", () => {
      [
        "how to",
        "cookie",
        "how to be a great person?",
        "how to not do really bad things?",
        "i have $100 dollars.",
        "I have bad $ hit lling",
        "That's a p***ch!",
        "When bann is spelt wrong, it won't be caught.",
      ].forEach(word => {
        expect(list.test(options, "banned", word)).toEqual(false);
      });
    });

    it("allows an empty list", () => {
      expect(list.test(options, "banned", "test")).toEqual(false);
    });
  });

  describe("containsMatchingPhraseMemoized", () => {
    it("return true for all cases after memoizing the first result", () => {
      [
        "cookies 1",
        "cookies 2",
        "cookies 4",
        "cookies 5",
        "this is for cookies 6",
        "this is for cookies 7",
        "this is for cookies 8",
        "this is for cookies 9",
      ].forEach(word => {
        expect(list.test(options, "banned", word)).toEqual(true);
      });
    });
  });
});

describe("pt-BR", () => {
  const list = new WordList();
  const options: Options = {
    id: "tenant_1",
    locale: "pt-BR",
    wordList: {
      banned: ["bi", "outro", "café", "m e r d a", "Como fazer coisas ruins"],
      suspect: [],
    },
  };

  describe("containsMatchingPhrase", () => {
    it("does match on a word in the list (considering Brazilian Portuguese accented characters not to be word separators)", () => {
      [
        "biólogo se soletra com: bi ",
        "m.e.r.d.a",
        "não tomo café pois faz mal",
        "Como fazer coisas ruins",
      ].forEach(word => {
        expect(list.test(options, "banned", word)).toEqual(true);
      });
    });

    it("does not match on a word not in the list", () => {
      [
        "O biólogo recomenda este artigo",
        "cafe",
        "Ser banido é uma merda",
      ].forEach(word => {
        expect(list.test(options, "banned", word)).toEqual(false);
      });
    });

    it("allows an empty list", () => {
      expect(list.test(options, "banned", "test")).toEqual(false);
    });
  });

  describe("containsMatchingPhraseMemoized", () => {
    it("return true for all cases after memoizing the first result", () => {
      [
        "bi 1",
        "bi 2",
        "bi 4",
        "bi 5",
        "this is for bi 6",
        "this is for bi 7",
        "this is for bi 8",
        "this is for bi 9",
      ].forEach(word => {
        expect(list.test(options, "banned", word)).toEqual(true);
      });
    });
  });
});
