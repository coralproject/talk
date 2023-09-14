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
      "#commentID=comment-id&storyURL=story-url",
      {
        commentID: "comment-id",
        storyURL: "story-url",
      },
    ],
    ["#", {}],
    ["", {}],
  ];
  testCases.forEach(([url, expected]) => {
    expect(parseHashQuery(url)).toEqual(expected);
  });
});
