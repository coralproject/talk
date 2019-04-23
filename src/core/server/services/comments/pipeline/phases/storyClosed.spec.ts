import { DateTime } from "luxon";

import { storyClosed } from "talk-server/services/comments/pipeline/phases/storyClosed";
import { ModerationPhaseContext } from "..";

describe("storyClosed", () => {
  it("throws an error when the story is closed", () => {
    expect(() =>
      storyClosed({
        story: { closedAt: new Date() } as ModerationPhaseContext["story"],
        tenant: {} as ModerationPhaseContext["tenant"],
        comment: {} as ModerationPhaseContext["comment"],
        author: {} as ModerationPhaseContext["author"],
        now: new Date(),
      })
    ).toThrow();

    storyClosed({
      story: {} as ModerationPhaseContext["story"],
      tenant: {
        closeCommenting: { auto: true },
      } as ModerationPhaseContext["tenant"],
      now: new Date(),
      comment: {} as ModerationPhaseContext["comment"],
      author: {} as ModerationPhaseContext["author"],
    });

    expect(() =>
      storyClosed({
        story: { createdAt: new Date() } as ModerationPhaseContext["story"],
        tenant: {
          closeCommenting: {
            auto: true,
            timeout: -6000,
          },
        } as ModerationPhaseContext["tenant"],
        now: new Date(),
        comment: {} as ModerationPhaseContext["comment"],
        author: {} as ModerationPhaseContext["author"],
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
        } as ModerationPhaseContext["story"],
        tenant: {
          closeCommenting: { auto: true },
        } as ModerationPhaseContext["tenant"],
        comment: {} as ModerationPhaseContext["comment"],
        author: {} as ModerationPhaseContext["author"],
        now,
      })
    ).toBeUndefined();

    expect(
      storyClosed({
        story: {} as ModerationPhaseContext["story"],
        tenant: {
          closeCommenting: { auto: true },
        } as ModerationPhaseContext["tenant"],
        comment: {} as ModerationPhaseContext["comment"],
        author: {} as ModerationPhaseContext["author"],
        now,
      })
    ).toBeUndefined();
  });
});
