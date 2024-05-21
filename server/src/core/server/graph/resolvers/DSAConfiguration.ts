import * as settings from "coral-server/models/settings";

import {
  GQLDSA_METHOD_OF_REDRESS,
  GQLDSAConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const DSAConfiguration: GQLDSAConfigurationTypeResolver<settings.DSAConfiguration> =
  {
    enabled: (config, args, { tenant }) =>
      tenant.dsa && tenant.dsa.enabled ? tenant.dsa.enabled : false,
    methodOfRedress: (config, args, { tenant }) =>
      tenant.dsa?.methodOfRedress ?? {
        method: GQLDSA_METHOD_OF_REDRESS.NONE,
        email: "",
        url: "",
      },
  };
