import * as story from "talk-server/models/story";

import { GQLStorySettingsTypeResolver } from "../schema/__generated__/types";

export const StorySettings: GQLStorySettingsTypeResolver<
  story.StorySettings
> = {
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
