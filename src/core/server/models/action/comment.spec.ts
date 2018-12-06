import { GQLCOMMENT_FLAG_REASON } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  ACTION_TYPE,
  CommentAction,
  CreateActionInput,
  decodeActionCounts,
  encodeActionCounts,
  filterDuplicateActions,
  validateAction,
} from "talk-server/models/action/comment";

describe("#encodeActionCounts", () => {
  it("generates the action counts correctly", () => {
    const actions: Array<Partial<CommentAction>> = [
      { actionType: ACTION_TYPE.DONT_AGREE },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
      },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
    ];
    const actionCounts = encodeActionCounts(...(actions as CommentAction[]));

    expect(actionCounts).toMatchSnapshot();
  });
});

describe("#decodeActionCounts", () => {
  it("parses the action counts correctly", () => {
    const actions: Array<Partial<CommentAction>> = [
      { actionType: ACTION_TYPE.REACTION },
      { actionType: ACTION_TYPE.REACTION },
      { actionType: ACTION_TYPE.REACTION },
      { actionType: ACTION_TYPE.DONT_AGREE },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
      },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
    ];

    const modelActionCounts = encodeActionCounts(
      ...(actions as CommentAction[])
    );

    expect(modelActionCounts).toMatchSnapshot();

    const actionCounts = decodeActionCounts(modelActionCounts);

    expect(actionCounts).toMatchSnapshot();
  });
});

describe("#validateAction", () => {
  it("allows a valid action", () => {
    const actions: Array<Partial<CommentAction>> = [
      {
        actionType: ACTION_TYPE.REACTION,
      },
      {
        actionType: ACTION_TYPE.DONT_AGREE,
      },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
      },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TOXIC,
      },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TRUST,
      },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_LINKS,
      },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
      },
      {
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
      },
    ];

    for (const action of actions) {
      validateAction(action as CommentAction);
    }
  });

  it("does not allow an invalid action", () => {
    const actions: Array<Partial<CommentAction>> = [
      {
        actionType: ACTION_TYPE.DONT_AGREE,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
      },
      {
        actionType: ACTION_TYPE.DONT_AGREE,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
      {
        actionType: ACTION_TYPE.FLAG,
      },
    ];

    for (const action of actions) {
      expect(() => validateAction(action as CommentAction)).toThrow();
    }
  });
});

describe("#filterDuplicateActions", () => {
  it("removes duplicate action items", () => {
    const actions: CreateActionInput[] = [
      {
        storyID: "1",
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
        commentID: "1",
        commentRevisionID: "1",
        userID: null,
      },
      {
        storyID: "1",
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
        commentID: "1",
        commentRevisionID: "1",
        userID: null,
      },
      {
        storyID: "1",
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
        commentID: "1",
        commentRevisionID: "1",
        userID: null,
      },
    ];

    expect(filterDuplicateActions(actions)).toHaveLength(2);
  });
});
