import * as user from "coral-server/models/user";

import { GQLProfileTypeResolver } from "coral-server/graph/schema/__generated__/types";

const resolveType: GQLProfileTypeResolver<user.Profile> = (profile) => {
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
