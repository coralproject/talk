import { GQLProfileTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import * as user from "talk-server/models/user";

const resolveType: GQLProfileTypeResolver<user.Profile> = profile => {
  switch (profile.type) {
    case "local":
      return "LocalProfile";
    case "oidc":
      return "OIDCProfile";
    case "sso":
      return "SSOProfile";
    case "facebook":
      return "FacebookProfile";
    case "google":
      return "GoogleProfile";
    default:
      // TODO: replace with better error.
      throw new Error("invalid profile type");
  }
};

export const Profile = {
  __resolveType: resolveType,
};
