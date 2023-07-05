import * as settings from "coral-server/models/settings";

import {
  GQLMODERATION_MODE,
  GQLNewCommentersConfigurationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const NewCommentersConfiguration: GQLNewCommentersConfigurationTypeResolver<settings.NewCommentersConfiguration> =
  {
    premodEnabled: ({ premodEnabled }) => premodEnabled,
    approvedCommentsThreshold: ({ approvedCommentsThreshold }) =>
      approvedCommentsThreshold,
    moderation: (config) => {
      let mode = config.premodEnabled
        ? GQLMODERATION_MODE.PRE
        : GQLMODERATION_MODE.POST;
      let premodSites: string[] = [];
      if (config.moderation) {
        if (config.moderation.mode) {
          mode = config.moderation.mode;
        }
        if (config.moderation.premodSites) {
          premodSites = config.moderation.premodSites;
        }
      }
      return {
        mode,
        premodSites,
      };
    },
  };
