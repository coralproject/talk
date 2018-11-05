import { GQLCOMMENT_FLAG_REASON } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  Action,
  ACTION_ITEM_TYPE,
  ACTION_TYPE,
  decodeActionCounts,
  encodeActionCounts,
  validateAction,
} from "talk-server/models/action";

describe("#encodeActionCounts", () => {
  it("generates the action counts correctly", () => {
    const actions: Array<Partial<Action>> = [
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
    const actionCounts = encodeActionCounts(...(actions as Action[]));

    expect(actionCounts).toMatchSnapshot();
  });
});

describe("#decodeActionCounts", () => {
  it("parses the action counts correctly", () => {
    const actions: Array<Partial<Action>> = [
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

    const modelActionCounts = encodeActionCounts(...(actions as Action[]));

    expect(modelActionCounts).toMatchSnapshot();

    const actionCounts = decodeActionCounts(modelActionCounts);

    expect(actionCounts).toMatchSnapshot();
  });
});

describe("#validateAction", () => {
  it("allows a valid action", () => {
    const actions: Array<Partial<Action>> = [
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.REACTION,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.DONT_AGREE,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TOXIC,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TRUST,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_LINKS,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BANNED_WORD,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.FLAG,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SUSPECT_WORD,
      },
    ];

    for (const action of actions) {
      validateAction(action as Action);
    }
  });

  it("does not allow an invalid action", () => {
    const actions: Array<Partial<Action>> = [
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.DONT_AGREE,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.DONT_AGREE,
        reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
      },
      {
        itemType: ACTION_ITEM_TYPE.COMMENTS,
        actionType: ACTION_TYPE.FLAG,
      },
    ];

    for (const action of actions) {
      expect(() => validateAction(action as Action)).toThrow();
    }
  });
});
