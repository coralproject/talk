import getModerationLink from "./getModerationLink";

describe("getModerationLink", () => {
  it("renders the default", () => {
    expect(getModerationLink()).toMatchInlineSnapshot(`"/admin/moderate"`);
  });
  it("renders with a specific queue", () => {
    expect(getModerationLink({ queue: "pending" })).toMatchInlineSnapshot(
      `"/admin/moderate/pending"`
    );
  });
  it("renders with a specific story", () => {
    expect(getModerationLink({ storyID: "story_123" })).toMatchInlineSnapshot(
      `"/admin/moderate/stories/story_123"`
    );
  });
  it("renders with a specific story", () => {
    expect(getModerationLink({ siteID: "site_123" })).toMatchInlineSnapshot(
      `"/admin/moderate/sites/site_123"`
    );
  });
  it("renders with only one story or site", () => {
    expect(
      getModerationLink({ storyID: "story_123", siteID: "site_123" })
    ).toMatchInlineSnapshot(`"/admin/moderate/stories/story_123"`);
  });
  it("renders with a specific story with a queue", () => {
    expect(
      getModerationLink({ queue: "pending", storyID: "story_123" })
    ).toMatchInlineSnapshot(`"/admin/moderate/pending/stories/story_123"`);
  });
  it("renders with a specific story with a queue", () => {
    expect(
      getModerationLink({ queue: "pending", siteID: "site_123" })
    ).toMatchInlineSnapshot(`"/admin/moderate/pending/sites/site_123"`);
  });
  it("renders with only one story or site with a queue", () => {
    expect(
      getModerationLink({
        queue: "pending",
        storyID: "story_123",
        siteID: "site_123",
      })
    ).toMatchInlineSnapshot(`"/admin/moderate/pending/stories/story_123"`);
  });
});
