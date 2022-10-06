import * as user from "coral-server/models/user";

import { GQLUserMembershipScopesTypeResolver } from "core/server/graph/schema/__generated__/types";

export const UserMembershipScopes: GQLUserMembershipScopesTypeResolver<user.UserMembershipScopes> =
  {
    scoped: ({ siteIDs }) => !!siteIDs?.length,
    sites: ({ siteIDs }, _, ctx) => {
      if (siteIDs) {
        return ctx.loaders.Sites.site.loadMany(siteIDs);
      }

      return null;
    },
  };
