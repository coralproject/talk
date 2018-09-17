import modifyQuery from "./modifyQuery";

it("should modify query", () => {
  const testCases: Array<[string, Record<string, any>, string]> = [
    [
      "http://localhost:8080/?a=b#hash",
      {
        c: "d",
      },
      "http://localhost:8080/?a=b&c=d#hash",
    ],
    [
      "http://localhost:8080/#hash",
      {
        a: "b",
      },
      "http://localhost:8080/?a=b#hash",
    ],
    [
      "http://localhost:8080/?a=b#hash",
      {
        a: undefined,
      },
      "http://localhost:8080/#hash",
    ],
  ];
  testCases.forEach(([url, params, expected]) => {
    expect(modifyQuery(url, params)).toEqual(expected);
  });
});
