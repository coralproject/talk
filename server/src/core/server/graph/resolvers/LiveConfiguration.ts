import * as settings from "coral-server/models/settings";
import { Story } from "coral-server/models/story";
import { isLiveEnabled } from "coral-server/services/stories";

import {
  GQLFEATURE_FLAG,
  GQLLiveConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export type LiveConfigurationInput = Story | settings.LiveConfiguration;

export const LiveConfiguration: GQLLiveConfigurationTypeResolver<LiveConfigurationInput> =
  {
    configurable: (source, args, ctx) =>
      !ctx.config.get("disable_live_updates") &&
      !ctx.tenant.featureFlags?.includes(GQLFEATURE_FLAG.DISABLE_LIVE_UPDATES),
    enabled: (source, args, ctx) =>
      isLiveEnabled(ctx.config, ctx.tenant, source, ctx.now),
  };
