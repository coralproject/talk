import { createValidator, validateStrictURLList } from "./validation";

describe("createValidator", () => {
  it("should report error when condition is unmet", () => {
    const truthy = createValidator((v) => !!v, "must be truthy");
    expect(truthy(false, {})).toBe("must be truthy");
  });
  it("should NOT report error when condition is met", () => {
    const truthy = createValidator((v) => !!v, "must be truthy");
    expect(truthy(true, {})).toBe(undefined);
  });
});

describe("validateStrictURLList", () => {
  it("should reject a URL without a scheme", () => {
    expect(validateStrictURLList(["localhost"], {})).toBeDefined();
  });

  it("should reject multiple URLs without a scheme", () => {
    expect(
      validateStrictURLList(["http://localhost", "localhost"], {})
    ).toBeDefined();
  });

  it("should allow a URL with a scheme", () => {
    expect(validateStrictURLList(["http://localhost"], {})).toBeUndefined();
  });

  it("should allow multiple URLs with a scheme", () => {
    expect(
      validateStrictURLList(["http://localhost", "https://localhost"], {})
    ).toBeUndefined();
  });
});
