import {
  GQLACTION_GROUP,
  GQLACTION_TYPE,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  compose,
  ModerationPhaseContext,
} from "talk-server/services/comments/moderation";

describe("compose", () => {
  it("handles when a phase throws an error", async () => {
    const err = new Error("this is an error");
    const enhanced = compose([
      () => {
        throw err;
      },
    ]);

    await expect(enhanced({} as ModerationPhaseContext)).rejects.toEqual(err);
  });

  it("handles when it returns a status", async () => {
    const status = GQLCOMMENT_STATUS.ACCEPTED;
    const enhanced = compose([() => ({ status })]);

    await expect(enhanced({} as ModerationPhaseContext)).resolves.toEqual({
      status,
      metadata: {},
      actions: [],
    });
  });

  it("merges the metadata", async () => {
    const status = GQLCOMMENT_STATUS.ACCEPTED;
    const enhanced = compose([
      () => ({ metadata: { first: true } }),
      () => ({ status, metadata: { second: true } }),
      () => ({ metadata: { third: true } }),
    ]);

    await expect(enhanced({} as ModerationPhaseContext)).resolves.toEqual({
      status,
      metadata: { first: true, second: true },
      actions: [],
    });
  });

  it("merges actions", async () => {
    const status = GQLCOMMENT_STATUS.ACCEPTED;

    const flags = [
      {
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.TOXIC_COMMENT,
      },
      {
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.SPAM_COMMENT,
      },
    ];

    const enhanced = compose([
      () => ({
        actions: [flags[0]],
      }),
      () => ({
        status,
        actions: [flags[1]],
      }),
      () => ({
        actions: [
          {
            action_type: GQLACTION_TYPE.FLAG,
            group_id: GQLACTION_GROUP.LINKS,
          },
        ],
      }),
    ]);

    const final = await enhanced({} as ModerationPhaseContext);

    for (const flag of flags) {
      expect(final.actions).toContainEqual(flag);
    }

    expect(final.actions).not.toContainEqual({
      action_type: GQLACTION_TYPE.FLAG,
      group_id: GQLACTION_GROUP.LINKS,
    });
  });

  it("handles when it does not return a status", async () => {
    const enhanced = compose([
      () => ({ metadata: { first: true } }),
      () => ({ metadata: { second: true } }),
    ]);

    await expect(enhanced({} as ModerationPhaseContext)).resolves.toEqual({
      status: GQLCOMMENT_STATUS.NONE,
      metadata: { first: true, second: true },
      actions: [],
    });
  });
});
