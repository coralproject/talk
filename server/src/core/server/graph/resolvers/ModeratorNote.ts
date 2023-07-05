import * as user from "coral-server/models/user";

import { GQLModeratorNoteTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const ModeratorNote: Required<
  GQLModeratorNoteTypeResolver<user.ModeratorNote>
> = {
  createdBy: ({ createdBy }, input, ctx) => {
    return ctx.loaders.Users.user.load(createdBy);
  },
  id: ({ id }) => id,
  body: ({ body }) => body,
  createdAt: ({ createdAt }) => createdAt,
};
