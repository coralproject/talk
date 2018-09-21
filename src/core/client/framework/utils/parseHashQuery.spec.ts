import parseHashQuery from "./parseHashQuery";

it("should parse hash", () => {
  const testCases: Array<[string, ReturnType<typeof parseHashQuery>]> = [
    [
      "#commentID=comment-id",
      {
        commentID: "comment-id",
      },
    ],
    [
      "#commentID=comment-id&assetURL=asset-url",
      {
        commentID: "comment-id",
        assetURL: "asset-url",
      },
    ],
    ["#", {}],
    ["", {}],
  ];
  testCases.forEach(([url, expected]) => {
    expect(parseHashQuery(url)).toEqual(expected);
  });
});
