import { createValidator } from "./validation";

describe("createValidator", () => {
  it("should report error when condition is unmet", () => {
    const truthy = createValidator(v => !!v, "must be truthy");
    expect(truthy(false, {})).toBe("must be truthy");
  });
  it("should NOT report error when condition is met", () => {
    const truthy = createValidator(v => !!v, "must be truthy");
    expect(truthy(true, {})).toBe(undefined);
  });
});
