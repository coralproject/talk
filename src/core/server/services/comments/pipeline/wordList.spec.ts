import {
  containsMatchingPhrase,
  containsMatchingPhraseMemoized,
} from "coral-server/services/comments/pipeline/wordList";

const phrases = [
  "cookies",
  "how to do bad things",
  "how to do really bad things",
  "s h i t",
  "$hit",
  "p**ch",
  "p*ch",
];

describe("containsMatchingPhrase", () => {
  it("does match on a word in the list", () => {
    [
      "how to do really bad things",
      "what is cookies",
      "cookies",
      "COOKIES.",
      "how to do bad things",
      "How To do bad things!",
      "This stuff is $hit!",
      "That's a p**ch!",
    ].forEach(word => {
      expect(containsMatchingPhrase(phrases, word)).toEqual(true);
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
    ].forEach(word => {
      expect(containsMatchingPhrase(phrases, word)).toEqual(false);
    });
  });

  it("allows an empty list", () => {
    expect(containsMatchingPhrase([], "test")).toEqual(false);
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
      expect(containsMatchingPhraseMemoized(phrases, word)).toEqual(true);
    });
  });
});
