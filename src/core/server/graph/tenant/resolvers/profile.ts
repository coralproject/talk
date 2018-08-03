import { GQLProfileTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import { Profile } from "talk-server/models/user";

const resolveType: GQLProfileTypeResolver<Profile> = profile => {
  switch (profile.type) {
    case "local":
      return "LocalProfile";
    case "oidc":
      return "OIDCProfile";
    case "sso":
      return "SSOProfile";
    default:
      // TODO: replace with better error.
      throw new Error("invalid profile type");
  }
};

export default {
  __resolveType: resolveType,
};
