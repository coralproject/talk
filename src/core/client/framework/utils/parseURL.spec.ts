import parseURL from "./parseURL";

it("should parse url", () => {
  const testCases: [[string, ReturnType<typeof parseURL>]] = [
    [
      "https://coralproject.net",
      {
        protocol: "https:",
        hostname: "coralproject.net",
        port: "",
        pathname: "/",
        search: "",
        hash: "",
      },
    ],
  ];
  testCases.forEach(([url, expected]) => {
    expect(parseURL(url)).toEqual(expected);
  });
});
