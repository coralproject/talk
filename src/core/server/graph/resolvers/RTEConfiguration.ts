import * as settings from "coral-server/models/settings";
import { hasFeatureFlag } from "coral-server/models/tenant";

import {
  GQLFEATURE_FLAG,
  GQLRTEConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const RTEConfiguration: GQLRTEConfigurationTypeResolver<settings.RTEConfiguration> =
  {
    sarcasm: (config, args, { tenant }) =>
      hasFeatureFlag(tenant, GQLFEATURE_FLAG.RTE_SARCASM),
  };
