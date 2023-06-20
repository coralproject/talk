import { hasFeatureFlag } from "coral-server/models/tenant";

import {
  GQLExternalMediaConfiguration,
  GQLExternalMediaConfigurationResolvers,
  GQLFEATURE_FLAG,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export const ExternalMediaConfiguration: RequiredResolver<
  GQLExternalMediaConfigurationResolvers<
    GraphContext,
    Partial<GQLExternalMediaConfiguration>
  >
> = {
  enabled: (source, args, ctx) =>
    hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.EXTERNAL_MEDIA),
};
