import { GQLWordlistMatch } from "coral-framework/schema";
import markPhrasesHTML from "./markHTMLNode";

describe("markHTMLNode", () => {
  it("result is equal to input with no marked words", () => {
    const text = "No bad words here.";
    const words: GQLWordlistMatch[] = [];

    const result = markPhrasesHTML(text, words);

    expect(result).toEqual(text);
  });

  it("correctly marks result with one bad word", () => {
    const text = "There is a bad word in here.";
    const words: GQLWordlistMatch[] = [
      {
        index: 11,
        length: 3,
        value: "bad",
      },
    ];

    const result = markPhrasesHTML(text, words);
    expect(result).toEqual("There is a <mark>bad</mark> word in here.");
  });

  it("correctly marks result with same bad word twice", () => {
    const text =
      "There is a bad word in here. There is a bad word over here too.";
    const words: GQLWordlistMatch[] = [
      {
        index: 11,
        length: 3,
        value: "bad",
      },
      {
        index: 40,
        length: 3,
        value: "bad",
      },
    ];

    const result = markPhrasesHTML(text, words);
    expect(result).toEqual(
      "There is a <mark>bad</mark> word in here. There is a <mark>bad</mark> word over here too."
    );
  });

  it("correctly marks result with same bad word repeated multiple times", () => {
    const text = "I am a sheep and I'm bad bad bad bad bad bad (get it?).";
    const words: GQLWordlistMatch[] = [
      {
        index: 21,
        length: 3,
        value: "bad",
      },
      {
        index: 25,
        length: 3,
        value: "bad",
      },
      {
        index: 29,
        length: 3,
        value: "bad",
      },
      {
        index: 33,
        length: 3,
        value: "bad",
      },
      {
        index: 37,
        length: 3,
        value: "bad",
      },
      {
        index: 41,
        length: 3,
        value: "bad",
      },
    ];

    const result = markPhrasesHTML(text, words);
    expect(result).toEqual(
      "I am a sheep and I'm <mark>bad</mark> <mark>bad</mark> <mark>bad</mark> <mark>bad</mark> <mark>bad</mark> <mark>bad</mark> (get it?)."
    );
  });

  it("correctly marks result with many different bad words", () => {
    const text =
      "This could be really suspect. It could also be banned. No one really knows what a bad word could be.";
    const words: GQLWordlistMatch[] = [
      {
        index: 21,
        length: 7,
        value: "suspect",
      },
      {
        index: 47,
        length: 6,
        value: "banned",
      },
      {
        index: 82,
        length: 3,
        value: "bad",
      },
    ];

    const result = markPhrasesHTML(text, words);
    expect(result).toEqual(
      "This could be really <mark>suspect</mark>. It could also be <mark>banned</mark>. No one really knows what a <mark>bad</mark> word could be."
    );
  });

  it("correctly marks result with markup in the source text", () => {
    const text = `<a href="somelinksomewhere"><b>This is bolded, but also has a troublesome word in it.</b></a>`;
    const words: GQLWordlistMatch[] = [
      {
        index: 62,
        length: 11,
        value: "troublesome",
      },
    ];

    const result = markPhrasesHTML(text, words);
    expect(result).toEqual(
      `<a href="somelinksomewhere"><b>This is bolded, but also has a <mark>troublesome</mark> word in it.</b></a>`
    );
  });

  it("correctly marks result with multiple lines", () => {
    const text = `
      I would like to share a really cool video, here is my YouTube channel:
      
      <a href="somelinksomewhere">SOME SUPER BAD CHANNEL THAT IS TERRIBLE</a>
      
      All y'all should totally click this link and horrible stuff totally won't happen, y'know?
      `;
    const words: GQLWordlistMatch[] = [
      {
        index: 130,
        length: 3,
        value: "BAD",
      },
      {
        index: 221,
        length: 8,
        value: "horrible",
      },
    ];

    const result = markPhrasesHTML(text, words);
    expect(result).toEqual(
      `
      I would like to share a really cool video, here is my YouTube channel:
      
      <a href="somelinksomewhere">SOME SUPER <mark>BAD</mark> CHANNEL THAT IS TERRIBLE</a>
      
      All y'all should totally click this link and <mark>horrible</mark> stuff totally won't happen, y'know?
      `
    );
  });
});
