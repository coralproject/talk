import * as actions from "coral-server/models/action/comment";

import { GQLReactionTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const Reaction: GQLReactionTypeResolver<actions.CommentAction> = {
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
