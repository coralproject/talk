import {
  GQLUserMediaSettings,
  GQLUserMediaSettingsResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const UserMediaSettings: GQLUserMediaSettingsResolvers<
  GraphContext,
  Partial<GQLUserMediaSettings>
> = {
  unfurlEmbeds: ({ unfurlEmbeds = false }) => unfurlEmbeds,
};
