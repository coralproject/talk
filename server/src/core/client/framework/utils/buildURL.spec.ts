import buildURL from "./buildURL";

it("should default to window.location", () => {
  const url = buildURL();
  expect(url).toBe("http://localhost/");
});

it("should build from parameters", () => {
  const url = buildURL({
    protocol: "https",
    hostname: "hostname",
    port: "8080",
    pathname: "/pathname",
    search: "search",
    hash: "#hash",
  });
  expect(url).toBe("https//hostname:8080/pathname?search#hash");
});
