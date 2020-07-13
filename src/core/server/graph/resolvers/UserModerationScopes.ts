import * as user from "coral-server/models/user";

import { GQLUserModerationScopesTypeResolver } from "coral-server/graph/schema/__generated__/types";
import { isModerationScoped } from "coral-server/models/user/helpers";

export const UserModerationScopes: GQLUserModerationScopesTypeResolver<user.UserModerationScopes> = {
  scoped: (moderationScopes) => isModerationScoped(moderationScopes),
  sites: ({ siteIDs }, args, ctx) => {
    if (siteIDs) {
      return ctx.loaders.Sites.site.loadMany(siteIDs);
    }

    return null;
  },
};
