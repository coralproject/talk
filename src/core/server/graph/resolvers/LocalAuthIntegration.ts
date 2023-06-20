import {
  GQLLocalAuthIntegration,
  GQLLocalAuthIntegrationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const LocalAuthIntegration: GQLLocalAuthIntegrationResolvers<
  GraphContext,
  GQLLocalAuthIntegration
> = {
  enabled: ({ enabled }, _, { config }) => {
    if (config.get("force_admin_local_auth")) {
      return true;
    }

    return enabled;
  },
  allowRegistration: ({ allowRegistration }) => allowRegistration,
  targetFilter: ({ targetFilter }) => targetFilter,
};
