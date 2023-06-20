import * as user from "coral-server/models/user";

import { GQLUserMembershipScopesResolvers } from "core/server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const UserMembershipScopes: GQLUserMembershipScopesResolvers<
  GraphContext,
  user.UserMembershipScopes
> = {
  scoped: ({ scoped, siteIDs }) => scoped || !!siteIDs?.length,
  sites: ({ siteIDs }, _, ctx) => {
    if (siteIDs) {
      return ctx.loaders.Sites.site.loadMany(siteIDs);
    }

    return null;
  },
};
