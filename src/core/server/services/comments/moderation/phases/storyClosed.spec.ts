import { DateTime } from "luxon";

import { Comment } from "talk-server/models/comment";
import { Story } from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { storyClosed } from "talk-server/services/comments/moderation/phases/storyClosed";

describe("storyClosed", () => {
  it("throws an error when the story is closed", () => {
    expect(() =>
      storyClosed({
        story: { closedAt: new Date() } as Story,
        tenant: {} as Tenant,
        comment: {} as Comment,
        author: {} as User,
      })
    ).toThrow();

    storyClosed({
      story: {} as Story,
      tenant: { autoCloseStream: true } as Tenant,
      comment: {} as Comment,
      author: {} as User,
    });

    expect(() =>
      storyClosed({
        story: { createdAt: new Date() } as Story,
        tenant: { autoCloseStream: true, closedTimeout: -6000 } as Tenant,
        comment: {} as Comment,
        author: {} as User,
      })
    ).toThrow();
  });

  it("does not throw an error when the story is not closed", () => {
    const now = new Date();

    expect(
      storyClosed({
        story: {
          closedAt: DateTime.fromJSDate(now)
            .plus(60000)
            .toJSDate(),
        } as Story,
        tenant: {} as Tenant,
        comment: {} as Comment,
        author: {} as User,
      })
    ).toBeUndefined();

    expect(
      storyClosed({
        story: {} as Story,
        tenant: {} as Tenant,
        comment: {} as Comment,
        author: {} as User,
      })
    ).toBeUndefined();
  });
});
