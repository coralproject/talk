import getOrigin from "./getOrigin";

it("should get origin", () => {
  const cases: Record<string, string> = {
    "//localhost:8080/xyz/jh.html": "//localhost:8080",
    "http://localhost:8080/xyz": "http://localhost:8080",
    "https://localhost:8080/xyz": "https://localhost:8080",
  };
  Object.keys(cases).forEach((k) => {
    expect(getOrigin(k)).toBe(cases[k]);
  });
});
