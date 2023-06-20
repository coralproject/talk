import * as user from "coral-server/models/user";

import { GQLModeratorNoteResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export const ModeratorNote: RequiredResolver<
  GQLModeratorNoteResolvers<GraphContext, user.ModeratorNote>
> = {
  createdBy: ({ createdBy }, input, ctx) => {
    return ctx.loaders.Users.user.load(createdBy);
  },
  id: ({ id }) => id,
  body: ({ body }) => body,
  createdAt: ({ createdAt }) => createdAt,
};
