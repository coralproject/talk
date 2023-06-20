import { isSiteModerationScoped } from "coral-common/permissions";
import * as user from "coral-server/models/user";

import { GQLUserModerationScopesResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const UserModerationScopes: GQLUserModerationScopesResolvers<
  GraphContext,
  user.UserModerationScopes
> = {
  scoped: (moderationScopes) => isSiteModerationScoped(moderationScopes),
  sites: ({ siteIDs }, args, ctx) => {
    if (siteIDs) {
      return ctx.loaders.Sites.site.loadMany(siteIDs);
    }

    return null;
  },
};
