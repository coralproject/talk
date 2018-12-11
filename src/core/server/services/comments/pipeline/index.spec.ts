import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ACTION_TYPE } from "talk-server/models/action/comment";
import {
  compose,
  ModerationPhaseContext,
} from "talk-server/services/comments/pipeline";

const context = {
  comment: { body: "This is a test" },
} as ModerationPhaseContext;

describe("compose", () => {
  it("handles when a phase throws an error", async () => {
    const err = new Error("this is an error");
    const enhanced = compose([
      () => {
        throw err;
      },
    ]);

    await expect(enhanced(context)).rejects.toEqual(err);
  });

  it("handles when it returns a status", async () => {
    const status = GQLCOMMENT_STATUS.ACCEPTED;
    const enhanced = compose([() => ({ status })]);

    await expect(enhanced(context)).resolves.toEqual({
      body: context.comment.body,
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

    await expect(enhanced(context)).resolves.toEqual({
      body: context.comment.body,
      status,
      metadata: { first: true, second: true },
      actions: [],
    });
  });

  it("merges actions", async () => {
    const status = GQLCOMMENT_STATUS.ACCEPTED;

    const flags = [
      {
        userID: null,
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TOXIC,
      },
      {
        userID: null,
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
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
            userID: null,
            actionType: ACTION_TYPE.FLAG,
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_LINKS,
          },
        ],
      }),
    ]);

    const final = await enhanced(context);

    for (const flag of flags) {
      expect(final.actions).toContainEqual(flag);
    }

    expect(final.actions).not.toContainEqual({
      body: context.comment.body,
      actionType: ACTION_TYPE.FLAG,
      reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_LINKS,
    });
  });

  it("handles when it does not return a status", async () => {
    const enhanced = compose([
      () => ({ metadata: { first: true } }),
      () => ({ metadata: { second: true } }),
    ]);

    await expect(enhanced(context)).resolves.toEqual({
      body: context.comment.body,
      status: GQLCOMMENT_STATUS.NONE,
      metadata: { first: true, second: true },
      actions: [],
    });
  });
});
