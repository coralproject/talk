import * as invite from "coral-server/models/invite";

import { GQLInviteTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const Invite: GQLInviteTypeResolver<invite.Invite> = {
  createdBy: ({ createdBy }, args, ctx) =>
    ctx.loaders.Users.user.load(createdBy),
};
