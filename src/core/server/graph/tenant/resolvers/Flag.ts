import { GQLFlagTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as actions from "talk-server/models/action/comment";

export const Flag: GQLFlagTypeResolver<actions.CommentAction> = {
  flagger: ({ userID }, args, ctx) => {
    if (userID) {
      return ctx.loaders.Users.user.load(userID);
    }

    return null;
  },
};
