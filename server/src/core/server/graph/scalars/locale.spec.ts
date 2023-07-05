import { Kind } from "graphql";

import Locale from "./locale";

describe("parseLiteral", () => {
  it("parses a valid locale from a string", () => {
    expect(
      Locale.parseLiteral(
        {
          kind: Kind.STRING,
          value: "en-US",
        },
        null
      )
    ).toBe("en-US");
  });
  it("parses an unsupported locale from a string", () => {
    expect(() =>
      Locale.parseLiteral(
        {
          kind: Kind.STRING,
          value: "xyz",
        },
        null
      )
    ).toThrow();
  });

  it("throws when not a string", () => {
    expect(() =>
      Locale.parseLiteral(
        {
          kind: Kind.INT,
          value: "4",
        },
        null
      )
    ).toThrow();
  });
});

describe("parseValue", () => {
  it("parses a valid locale from a string", () => {
    expect(Locale.parseValue("en-US")).toBe("en-US");
  });
  it("parses an unsupported locale from a string", () => {
    expect(() => Locale.parseValue("xyz")).toThrow();
  });
  it("throws when not a string", () => {
    expect(() => Locale.parseValue(4)).toThrow();
  });
});
