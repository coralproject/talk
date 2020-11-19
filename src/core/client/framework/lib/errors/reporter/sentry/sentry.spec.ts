import { getAppFilename } from "./sentry";

it("should return correct path", () => {
  const cases = [
    // Non-assets does not need a translation.
    {
      args: ["http://localhost:8080/xyz", "http://localhost:8080/", "/"],
      result: "http://localhost:8080/xyz",
    },
    {
      args: ["http://localhost:8080/xyz?abc=1", "http://localhost:8080/", "/"],
      result: "http://localhost:8080/xyz?abc=1",
    },
    // Assets.
    {
      args: [
        "http://localhost:8080/assets/js/embed.js",
        "http://localhost:8080/",
        "/",
      ],
      result: "app:///static/assets/js/embed.js",
    },
    {
      args: [
        "http://localhost:8080/assets/js/embed.js",
        "http://localhost:8080",
        "/",
      ],
      result: "app:///static/assets/js/embed.js",
    },
    {
      args: [
        "http://localhost:8080/assets/js/embed.js",
        "http://localhost:8080/",
        "http://localhost:8080",
      ],
      result: "app:///static/assets/js/embed.js",
    },
    {
      args: [
        "http://localhost:8080/assets/js/embed.js",
        "http://localhost:8080/",
        "http://localhost:8080/",
      ],
      result: "app:///static/assets/js/embed.js",
    },
    {
      args: [
        "http://cdn.localhost.de:8080/assets/js/embed.js",
        "http://localhost:8080/",
        "http://cdn.localhost.de:8080/",
      ],
      result: "app:///static/assets/js/embed.js",
    },
    {
      args: [
        "http://cdn.localhost.de:8080/assets/js/embed.js",
        "http://localhost:8080/",
        "http://cdn.localhost.de:8080",
      ],
      result: "app:///static/assets/js/embed.js",
    },
    {
      args: [
        "http://cdn.localhost.de:8080/assets/js/embed.js",
        "http://localhost:8080/",
        "http://cdn.anotherhost.de:8080/",
      ],
      result: "http://cdn.localhost.de:8080/assets/js/embed.js",
    },
  ];
  cases.forEach((c) => {
    const path = getAppFilename(c.args[0], c.args[1], c.args[2]);
    expect(path).toBe(c.result);
  });
});
