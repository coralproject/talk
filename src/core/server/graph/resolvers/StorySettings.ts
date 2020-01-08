import * as story from "coral-server/models/story";

import { GQLStorySettingsTypeResolver } from "../schema/__generated__/types";

export const StorySettings: GQLStorySettingsTypeResolver<
  story.StorySettings
> = {
  live: s => s.live || {},
  moderation: (s, input, ctx) => s.moderation || ctx.tenant.moderation,
  premodLinksEnable: (s, input, ctx) =>
    s.premodLinksEnable || ctx.tenant.premodLinksEnable,
  messageBox: s => {
    if (s.messageBox) {
      return s.messageBox;
    }

    return {
      enabled: false,
    };
  },
};
