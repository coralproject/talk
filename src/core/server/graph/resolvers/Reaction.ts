import * as actions from "coral-server/models/action/comment";

import { GQLReactionResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const Reaction: GQLReactionResolvers<
  GraphContext,
  actions.CommentAction
> = {
  reacter: async ({ userID }, args, ctx) => {
    if (userID) {
      const user = await ctx.loaders.Users.user.load(userID);
      return {
        username: user?.username,
        userID,
      };
    }

    return null;
  },
};
