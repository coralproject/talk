import * as settings from "coral-server/models/settings";
import { Story } from "coral-server/models/story";
import { isLiveEnabled } from "coral-server/services/stories";

import {
  GQLFEATURE_FLAG,
  GQLLiveConfigurationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export type LiveConfigurationInput = Story | settings.LiveConfiguration;

export const LiveConfiguration: GQLLiveConfigurationResolvers<
  GraphContext,
  LiveConfigurationInput
> = {
  configurable: (source, args, ctx) =>
    !ctx.config.get("disable_live_updates") &&
    !ctx.tenant.featureFlags?.includes(GQLFEATURE_FLAG.DISABLE_LIVE_UPDATES),
  enabled: (source, args, ctx) =>
    isLiveEnabled(ctx.config, ctx.tenant, source, ctx.now),
};
