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
  testCases.forEach(tc => {
    expect(parseHashQuery(tc[0])).toEqual(tc[1]);
  });
});
