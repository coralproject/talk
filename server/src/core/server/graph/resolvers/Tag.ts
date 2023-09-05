import { CommentTag } from "coral-server/models/comment/tag";

import { GQLTagTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const Tag: GQLTagTypeResolver<CommentTag> = {
  code: ({ type }) => type,
  createdBy: ({ createdBy }, input, ctx) => {
    if (createdBy) {
      return ctx.loaders.Users.user.load(createdBy);
    }

    return null;
  },
};
