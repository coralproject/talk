import ensureNoStartSlash from "./ensureNoStartSlash";

it("should remove the slash from the beginning", () => {
  const path = ensureNoStartSlash("/test/");
  expect(path).toBe("test/");
});

it("should not change a string if there is no starting slash", () => {
  const path = ensureNoStartSlash("test/");
  expect(path).toBe("test/");
});
