import { GQLFlagActionCountsTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as actions from "talk-server/models/action/comment";

export type FlagActionCountsInput = actions.FlagActionCounts & {
  commentID: string;
};

export const FlagActionCounts: GQLFlagActionCountsTypeResolver<
  FlagActionCountsInput
> = {
  flags: ({ commentID }, { first = 10, after }, ctx) =>
    ctx.loaders.CommentActions.connection({
      first,
      after,
      filter: {
        actionType: actions.ACTION_TYPE.FLAG,
        commentID,
      },
    }),
};
