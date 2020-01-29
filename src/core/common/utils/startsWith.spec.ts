import startsWith from "./startsWith";

it("should work correctly", () => {
  const str1 = "Saturday night plans";
  expect(startsWith(str1, "Sat")).toBe(true);
  expect(startsWith(str1, "Sat", 3)).toBe(false);
});
