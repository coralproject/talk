import {
  GQLAuthenticationTargetFilter,
  GQLAuthenticationTargetFilterResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const AuthenticationTargetFilter: GQLAuthenticationTargetFilterResolvers<
  GraphContext,
  GQLAuthenticationTargetFilter
> = {
  admin: ({ admin }, _, { config }) => {
    if (config.get("force_admin_local_auth")) {
      return true;
    }

    return admin;
  },
  stream: ({ stream }) => stream,
};
