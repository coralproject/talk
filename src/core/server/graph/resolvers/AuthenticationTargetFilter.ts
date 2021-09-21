import { hasFeatureFlag } from "coral-server/models/tenant";

import {
  GQLAuthenticationTargetFilter,
  GQLAuthenticationTargetFilterTypeResolver,
  GQLFEATURE_FLAG,
} from "coral-server/graph/schema/__generated__/types";

export const AuthenticationTargetFilter: GQLAuthenticationTargetFilterTypeResolver<GQLAuthenticationTargetFilter> = {
  admin: ({ admin }, _, { tenant }) => {
    if (hasFeatureFlag(tenant, GQLFEATURE_FLAG.FORCE_ADMIN_LOCAL_AUTH)) {
      return true;
    }

    return admin;
  },
  stream: ({ stream }) => stream,
};
