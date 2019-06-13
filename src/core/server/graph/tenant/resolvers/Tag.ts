import { GQLTagTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";
import { CommentTag } from "coral-server/models/comment/tag";

export const Tag: GQLTagTypeResolver<CommentTag> = {
  code: ({ type }) => type,
  createdBy: ({ createdBy }, input, ctx) => {
    if (createdBy) {
      return ctx.loaders.Users.user.load(createdBy);
    }

    return null;
  },
};
