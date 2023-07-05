import ensureStartSlash from "./ensureStartSlash";

it("should add slash to the beginning", () => {
  const path = ensureStartSlash("test");
  expect(path).toBe("/test");
});

it("should not add slash to the end if it's already there", () => {
  const path = ensureStartSlash("/test/");
  expect(path).toBe("/test/");
});
