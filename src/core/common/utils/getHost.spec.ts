import getHost from "./getHost";

it("should get origin", () => {
  const cases: Record<string, string> = {
    "//localhost:8080/xyz/jh.html": "localhost:8080",
    "http://localhost:8080/xyz": "localhost:8080",
    "https://localhost:8080/xyz": "localhost:8080",
  };
  Object.keys(cases).forEach((k) => {
    expect(getHost(k)).toBe(cases[k]);
  });
});
