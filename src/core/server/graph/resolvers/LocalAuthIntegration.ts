import {
  GQLLocalAuthIntegration,
  GQLLocalAuthIntegrationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const LocalAuthIntegration: GQLLocalAuthIntegrationTypeResolver<GQLLocalAuthIntegration> = {
  enabled: ({ enabled }, _, { config }) => {
    if (config.get("force_admin_local_auth")) {
      return true;
    }

    return enabled;
  },
  allowRegistration: ({ allowRegistration }) => allowRegistration,
  targetFilter: ({ targetFilter }) => targetFilter,
};
