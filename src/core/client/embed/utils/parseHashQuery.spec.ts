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
  testCases.forEach(tc => {
    expect(parseHashQuery(tc[0])).toEqual(tc[1]);
  });
});
