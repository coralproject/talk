import * as settings from "coral-server/models/settings";

import { GQLDSAConfigurationTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const DSAConfiguration: GQLDSAConfigurationTypeResolver<settings.RTEConfiguration> =
  {
    enabled: (config, args, { tenant }) =>
      tenant.dsa && tenant.dsa.enabled ? tenant.dsa.enabled : false,
  };
