import ensureEndSlash from "./ensureEndSlash";

it("should add slash to the end", () => {
  const path = ensureEndSlash("/test");
  expect(path).toBe("/test/");
});

it("should not add slash to the end if it's already there", () => {
  const path = ensureEndSlash("/test/");
  expect(path).toBe("/test/");
});
