import { GQLCOMMENT_FLAG_REASON } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  Action,
  ACTION_ITEM_TYPE,
  ACTION_TYPE,
  decodeActionCounts,
  encodeActionCounts,
  validateAction,
} from "talk-server/models/actions";

describe("#encodeActionCounts", () => {
  it("generates the action counts correctly", () => {
    const actions = [
      { action_type: ACTION_TYPE.DONT_AGREE },
      {
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
      },
      {
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
    ];
    const actionCounts = encodeActionCounts(...(actions as Action[]));

    expect(actionCounts).toMatchSnapshot();
  });
});

describe("#decodeActionCounts", () => {
  it("parses the action counts correctly", () => {
    const actions = [
      { action_type: ACTION_TYPE.REACTION },
      { action_type: ACTION_TYPE.REACTION },
      { action_type: ACTION_TYPE.REACTION },
      { action_type: ACTION_TYPE.DONT_AGREE },
      {
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
      },
      {
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
    ];

    const modelActionCounts = encodeActionCounts(...(actions as Action[]));

    expect(modelActionCounts).toMatchSnapshot();

    const actionCounts = decodeActionCounts(modelActionCounts);

    expect(actionCounts).toMatchSnapshot();
  });
});

describe("#validateAction", () => {
  it("allows a valid action", () => {
    const actions = [
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.REACTION,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.DONT_AGREE,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TOXIC,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TRUST,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_LINKS,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
      },
    ];

    for (const action of actions) {
      validateAction(action as Action);
    }
  });

  it("does not allow an invalid action", () => {
    const actions = [
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.DONT_AGREE,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.DONT_AGREE,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
      {
        item_type: ACTION_ITEM_TYPE.COMMENTS,
        action_type: ACTION_TYPE.FLAG,
      },
    ];

    for (const action of actions) {
      expect(() => validateAction(action as Action)).toThrow();
    }
  });
});
