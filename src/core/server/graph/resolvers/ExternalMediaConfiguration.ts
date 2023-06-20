import { hasFeatureFlag } from "coral-server/models/tenant";

import {
  GQLExternalMediaConfiguration,
  GQLExternalMediaConfigurationResolvers,
  GQLFEATURE_FLAG,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const ExternalMediaConfiguration: Required<
  GQLExternalMediaConfigurationResolvers<
    GraphContext,
    Partial<GQLExternalMediaConfiguration>
  >
> = {
  enabled: (source, args, ctx) =>
    hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.EXTERNAL_MEDIA),
};
