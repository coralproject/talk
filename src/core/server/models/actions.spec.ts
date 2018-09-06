import {
  GQLACTION_GROUP,
  GQLACTION_ITEM_TYPE,
  GQLACTION_TYPE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  Action,
  generateActionCounts,
  validateAction,
} from "talk-server/models/actions";

describe("#generateActionCounts", () => {
  it("generates the action counts correctly", () => {
    const actions = [
      { action_type: GQLACTION_TYPE.DONT_AGREE },
      {
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.BANNED_WORD,
      },
      {
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.BODY_COUNT,
      },
    ];
    const actionCounts = generateActionCounts(...(actions as Action[]));

    expect(actionCounts).toEqual({
      [GQLACTION_TYPE.DONT_AGREE.toLowerCase()]: 1,
      [GQLACTION_TYPE.FLAG.toLowerCase()]: 2,
      [GQLACTION_TYPE.FLAG.toLowerCase() +
        "_" +
        GQLACTION_GROUP.BANNED_WORD.toLowerCase()]: 1,
      [GQLACTION_TYPE.FLAG.toLowerCase() +
        "_" +
        GQLACTION_GROUP.BODY_COUNT.toLowerCase()]: 1,
    });
  });
});

describe("#validateAction", () => {
  it("allows a valid action", () => {
    const actions = [
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.REACTION,
      },
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.DONT_AGREE,
      },

      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.SPAM_COMMENT,
      },
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.TOXIC_COMMENT,
      },
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.BODY_COUNT,
      },
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.TRUST,
      },
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.LINKS,
      },
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.BANNED_WORD,
      },
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.FLAG,
        group_id: GQLACTION_GROUP.SUSPECT_WORD,
      },
    ];

    for (const action of actions) {
      validateAction(action as Action);
    }
  });

  it("does not allow an invalid action", () => {
    const actions = [
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.DONT_AGREE,
        group_id: GQLACTION_GROUP.SPAM_COMMENT,
      },
      {
        item_type: GQLACTION_ITEM_TYPE.COMMENTS,
        action_type: GQLACTION_TYPE.DONT_AGREE,
        group_id: GQLACTION_GROUP.BODY_COUNT,
      },
    ];

    for (const action of actions) {
      expect(() => validateAction(action as Action)).toThrow();
    }
  });
});
