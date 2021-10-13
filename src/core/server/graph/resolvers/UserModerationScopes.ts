import * as user from "coral-server/models/user";
import { isSiteModerationScoped } from "coral-server/models/user/helpers";

import { GQLUserModerationScopesTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const UserModerationScopes: GQLUserModerationScopesTypeResolver<user.UserModerationScopes> = {
  scoped: (moderationScopes) => isSiteModerationScoped(moderationScopes),
  sites: ({ siteIDs }, args, ctx) => {
    if (siteIDs) {
      return ctx.loaders.Sites.site.loadMany(siteIDs);
    }

    return null;
  },
};
