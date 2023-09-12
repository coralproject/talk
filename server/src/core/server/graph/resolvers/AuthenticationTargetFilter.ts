import {
  GQLAuthenticationTargetFilter,
  GQLAuthenticationTargetFilterTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const AuthenticationTargetFilter: GQLAuthenticationTargetFilterTypeResolver<GQLAuthenticationTargetFilter> =
  {
    admin: ({ admin }, _, { config }) => {
      if (config.get("force_admin_local_auth")) {
        return true;
      }

      return admin;
    },
    stream: ({ stream }) => stream,
  };
