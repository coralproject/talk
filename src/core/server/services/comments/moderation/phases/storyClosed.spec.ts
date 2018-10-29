import { Comment } from "talk-server/models/comment";
import { Story } from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { storyClosed } from "talk-server/services/comments/moderation/phases/storyClosed";

describe("storyClosed", () => {
  it("throws an error when the story is closed", () => {
    const story = { closedAt: new Date() };

    expect(() =>
      storyClosed({
        story: story as Story,
        tenant: (null as any) as Tenant,
        comment: (null as any) as Comment,
        author: (null as any) as User,
      })
    ).toThrow();
  });

  it("does not throw an error when the story is not closed", () => {
    const now = new Date();

    expect(
      storyClosed({
        story: { closedAt: new Date(now.getTime() + 60000) } as Story,
        tenant: (null as any) as Tenant,
        comment: (null as any) as Comment,
        author: (null as any) as User,
      })
    ).toBeUndefined();

    expect(
      storyClosed({
        story: {} as Story,
        tenant: (null as any) as Tenant,
        comment: (null as any) as Comment,
        author: (null as any) as User,
      })
    ).toBeUndefined();
  });
});
