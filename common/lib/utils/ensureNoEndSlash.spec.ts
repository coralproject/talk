import ensureNoEndSlash from "./ensureNoEndSlash";

it("should remove the slash from the end", () => {
  const path = ensureNoEndSlash("/test/");
  expect(path).toBe("/test");
});

it("should not change a string if there is no ending slash", () => {
  const path = ensureNoEndSlash("/test");
  expect(path).toBe("/test");
});
