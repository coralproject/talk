import isNonNullArray from "./isNonNullArray";

describe("isNonNullArray", () => {
  it("returns true for an array with no null entries", () => {
    expect(isNonNullArray([-1, undefined, 0, 1, 2, 3, 4, 5])).toBeTruthy();
  });

  it("returns false for an array with some null entries", () => {
    expect(isNonNullArray([-1, 0, null, 2, 3, 4, 5])).toBeFalsy();
  });
});
