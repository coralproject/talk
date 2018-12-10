import { validateMaximumLength } from "./util";

it("limits to maximum when string is provided", () => {
  expect(() => validateMaximumLength(5, "123456")).toThrow();
});

it("limits to maximum when string is not provided", () => {
  expect(validateMaximumLength(5)).toEqual(undefined);
});

it("returns the string when string is provided and is within the length allowances", () => {
  expect(validateMaximumLength(5, "1234")).toEqual("1234");
});
