import { isUndefined } from "lodash";
import { DateTime } from "luxon";

import * as settings from "coral-server/models/settings";

import { GQLLiveConfigurationTypeResolver } from "coral-server/graph/schema/__generated__/types";

export interface LiveConfigurationInput extends settings.LiveConfiguration {
  lastCommentedAt?: Date;
  createdAt?: Date;
}

export const LiveConfiguration: GQLLiveConfigurationTypeResolver<LiveConfigurationInput> = {
  configurable: (source, args, ctx) =>
    Boolean(!ctx.config.get("disable_live_updates")),
  enabled: (source, args, ctx) => {
    if (ctx.config.get("disable_live_updates")) {
      return false;
    }

    // This typecast is needed because the custom `ms` format does not return the
    // desired `number` type even though that's the only type it can output.
    const disableLiveUpdatesTimeout = (ctx.config.get(
      "disable_live_updates_timeout"
    ) as unknown) as number;
    if (disableLiveUpdatesTimeout > 0) {
      // If one of these is available, use it to determine the time since the
      // last comment.
      const lastCommentedAt = source.lastCommentedAt || source.createdAt;
      if (
        // If a date is found...
        lastCommentedAt &&
        // And the date (when we add the timeout duration) is before the current
        // date...
        DateTime.fromJSDate(lastCommentedAt)
          .plus({
            milliseconds: disableLiveUpdatesTimeout,
          })
          .toJSDate() <= ctx.now
      ) {
        // Then we know that the last comment (or lack there of) was left more
        // than the timeout specified in configuration.
        return false;
      }
    }

    if (isUndefined(source.enabled)) {
      return ctx.tenant.live.enabled;
    }

    return source.enabled;
  },
};
