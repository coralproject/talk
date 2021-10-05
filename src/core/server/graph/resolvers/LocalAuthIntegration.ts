import { hasFeatureFlag } from "coral-server/models/tenant";

import {
  GQLFEATURE_FLAG,
  GQLLocalAuthIntegration,
  GQLLocalAuthIntegrationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const LocalAuthIntegration: GQLLocalAuthIntegrationTypeResolver<GQLLocalAuthIntegration> = {
  enabled: ({ enabled }, _, { tenant }) => {
    if (hasFeatureFlag(tenant, GQLFEATURE_FLAG.FORCE_ADMIN_LOCAL_AUTH)) {
      return true;
    }

    return enabled;
  },
  allowRegistration: ({ allowRegistration }) => allowRegistration,
  targetFilter: ({ targetFilter }) => targetFilter,
};
