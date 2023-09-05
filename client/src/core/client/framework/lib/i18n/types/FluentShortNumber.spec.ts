import { toPairs } from "lodash";

import { getShortNumberCode, validatePattern } from "./FluentShortNumber";

describe("getShortNumberCode", () => {
  it("returns correct value", () => {
    const cases = {
      123: "100",
      4322: "1000",
      33223: "10000",
    };
    toPairs(cases).forEach(([i, o]) => {
      expect(getShortNumberCode(parseFloat(i))).toBe(o);
    });
  });
});

describe("validateFormat", () => {
  it("returns correct value", () => {
    const cases = {
      "0k": true,
      "0kilo": true,
      "0.0": false,
      "0": false,
      "0.": false,
      "0.0k": true,
      "000.0k": true,
      "000M": true,
    };
    toPairs(cases).forEach(([i, o]) => {
      expect(validatePattern(i)).toBe(o);
    });
  });
});
