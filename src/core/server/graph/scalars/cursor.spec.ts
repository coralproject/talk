import { Kind } from "graphql";
import { DateTime } from "luxon";

import Cursor from "./cursor";

describe("parseLiteral", () => {
  it("parses a date from a string", () => {
    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.STRING,
          value: "2018-07-16T18:34:26.744Z",
        },
        null
      )
    ).toBeInstanceOf(Date);

    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.STRING,
          value: "this-should-fail",
        },
        null
      )
    ).toEqual(null);

    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.STRING,
          value: "",
        },
        null
      )
    ).toEqual(null);
  });

  it("parses a number from a string", () => {
    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.STRING,
          value: "20",
        },
        null
      )
    ).toEqual(20);

    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.STRING,
          value: "0",
        },
        null
      )
    ).toEqual(0);

    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.STRING,
          value: "null",
        },
        null
      )
    ).toEqual(null);

    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.STRING,
          value: "0",
        },
        null
      )
    ).toEqual(0);
  });

  it("parses a number from a number", () => {
    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.INT,
          value: "20",
        },
        null
      )
    ).toEqual(20);

    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.INT,
          value: "0",
        },
        null
      )
    ).toEqual(0);

    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.INT,
          value: "",
        },
        null
      )
    ).toEqual(null);
  });

  it("does not parse unknown kinds", () => {
    expect(
      Cursor.parseLiteral(
        {
          kind: Kind.FLOAT,
          value: "0.0",
        },
        null
      )
    ).toEqual(null);
  });
});

describe("serialize", () => {
  it("renders native dates correctly", () => {
    const date = new Date();
    const expected = date.toISOString();
    expect(Cursor.serialize(date)).toEqual(expected);

    expect(Cursor.serialize({})).toEqual(null);
  });

  it("renders luxon dates correctly", () => {
    const date = DateTime.fromJSDate(new Date());
    const expected = date.toISO();
    expect(Cursor.serialize(date)).toEqual(expected);
  });

  it("renders numbers correctly", () => {
    let value = 50;
    let expected = "50";
    expect(Cursor.serialize(value)).toEqual(expected);

    value = 0;
    expected = "0";
    expect(Cursor.serialize(value)).toEqual(expected);

    expect(Cursor.serialize(null)).toEqual(null);
  });
});

describe("parseValue", () => {
  it("parses the string value of a Date", () => {
    const date = new Date();
    const expected = date.toISOString();
    expect(Cursor.parseValue(expected)).toBeInstanceOf(Date);
  });

  it("parses the string value of a number", () => {
    expect(Cursor.parseValue("0")).toEqual(0);
  });

  it("handles invalid properties", () => {
    expect(Cursor.parseValue(null)).toEqual(null);
    expect(Cursor.parseValue(2)).toEqual(null);
  });
});
