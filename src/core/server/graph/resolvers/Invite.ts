import * as invite from "coral-server/models/invite";

import { GQLInviteResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const Invite: GQLInviteResolvers<GraphContext, invite.Invite> = {
  createdBy: ({ createdBy }, args, ctx) =>
    ctx.loaders.Users.user.load(createdBy),
};
