import { isUndefined } from "lodash";

import { GQLLiveConfigurationTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";
import * as settings from "coral-server/models/settings";

export type LiveConfigurationInput = settings.LiveConfiguration;

export const LiveConfiguration: GQLLiveConfigurationTypeResolver<
  LiveConfigurationInput
> = {
  configurable: (source, args, ctx) =>
    Boolean(!ctx.config.get("disable_live_updates")),
  enabled: (source, args, ctx) => {
    if (ctx.config.get("disable_live_updates")) {
      return false;
    }

    if (isUndefined(source.enabled)) {
      return ctx.tenant.live.enabled;
    }

    return source.enabled;
  },
};
