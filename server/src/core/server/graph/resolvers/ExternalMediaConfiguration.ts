import { hasFeatureFlag } from "coral-server/models/tenant";

import {
  GQLExternalMediaConfiguration,
  GQLExternalMediaConfigurationTypeResolver,
  GQLFEATURE_FLAG,
} from "coral-server/graph/schema/__generated__/types";

export const ExternalMediaConfiguration: Required<
  GQLExternalMediaConfigurationTypeResolver<
    Partial<GQLExternalMediaConfiguration>
  >
> = {
  enabled: (source, args, ctx) =>
    hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.EXTERNAL_MEDIA),
};
