import { Story } from "coral-server/models/story";
import { isStoryLiveEnabled } from "coral-server/services/stories";

import { GQLLiveConfigurationTypeResolver } from "coral-server/graph/schema/__generated__/types";

export type LiveConfigurationInput = Story;

export const LiveConfiguration: GQLLiveConfigurationTypeResolver<LiveConfigurationInput> = {
  configurable: (source, args, ctx) => !ctx.config.get("disable_live_updates"),
  enabled: (source, args, ctx) =>
    isStoryLiveEnabled(ctx.config, ctx.tenant, source, ctx.now),
};
