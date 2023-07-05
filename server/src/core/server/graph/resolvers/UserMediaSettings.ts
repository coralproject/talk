import {
  GQLUserMediaSettings,
  GQLUserMediaSettingsTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

export const UserMediaSettings: GQLUserMediaSettingsTypeResolver<
  Partial<GQLUserMediaSettings>
> = {
  unfurlEmbeds: ({ unfurlEmbeds = false }) => unfurlEmbeds,
};
