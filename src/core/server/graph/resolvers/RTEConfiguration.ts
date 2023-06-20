import * as settings from "coral-server/models/settings";
import { hasFeatureFlag } from "coral-server/models/tenant";

import {
  GQLFEATURE_FLAG,
  GQLRTEConfigurationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const RTEConfiguration: GQLRTEConfigurationResolvers<
  GraphContext,
  settings.RTEConfiguration
> = {
  sarcasm: (config, args, { tenant }) =>
    hasFeatureFlag(tenant, GQLFEATURE_FLAG.RTE_SARCASM),
};
