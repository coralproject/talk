import { CommentTag } from "coral-server/models/comment/tag";

import { GQLTagResolvers } from "coral-server/graph/schema/__generated__/types";
import GraphContext from "../context";

export const Tag: GQLTagResolvers<GraphContext, CommentTag> = {
  code: ({ type }) => type,
  createdBy: ({ createdBy }, input, ctx) => {
    if (createdBy) {
      return ctx.loaders.Users.user.load(createdBy);
    }

    return null;
  },
};
