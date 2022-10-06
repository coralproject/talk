import * as story from "coral-server/models/story";

import {
  GQLMODERATION_MODE,
  GQLStorySettingsTypeResolver,
} from "../schema/__generated__/types";

import { LiveConfigurationInput } from "./LiveConfiguration";

export interface StorySettingsInput extends story.StorySettings {
  story: story.Story;
}

export const StorySettings: Required<
  GQLStorySettingsTypeResolver<StorySettingsInput>
> = {
  live: (s): LiveConfigurationInput => s.story,
  moderation: (s, input, ctx) => {
    if (s.moderation) {
      return s.moderation;
    }
    if (ctx.tenant.moderation === GQLMODERATION_MODE.SPECIFIC_SITES_PRE) {
      return ctx.tenant.premoderateAllCommentsSites.includes(s.story.siteID)
        ? GQLMODERATION_MODE.PRE
        : GQLMODERATION_MODE.POST;
    }
    return ctx.tenant.moderation;
  },
  premodLinksEnable: (s, input, ctx) =>
    s.premodLinksEnable || ctx.tenant.premodLinksEnable,
  messageBox: (s) => {
    if (s.messageBox) {
      return s.messageBox;
    }

    return {
      enabled: false,
    };
  },
  // FEATURE_FLAG:ENABLE_QA
  mode: (s, input, ctx) => story.resolveStoryMode(s, ctx.tenant),
  experts: (s, input, ctx) => {
    if (s.expertIDs) {
      return ctx.loaders.Users.user.loadMany(s.expertIDs);
    }

    return [];
  },
};
