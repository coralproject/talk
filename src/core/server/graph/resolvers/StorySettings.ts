import * as story from "coral-server/models/story";

import {
  GQLSTORY_MODE,
  GQLStorySettingsTypeResolver,
} from "../schema/__generated__/types";

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
  mode: s => {
    if (s.mode) {
      return s.mode;
    }

    return GQLSTORY_MODE.COMMENTS;
  },
  experts: (s, input, ctx) => {
    if (s.expertIDs) {
      return ctx.loaders.Users.user.loadMany(s.expertIDs);
    }

    return [];
  },
};
