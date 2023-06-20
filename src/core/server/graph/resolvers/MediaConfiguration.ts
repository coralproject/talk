import {
  GQLMediaConfiguration,
  GQLMediaConfigurationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const MediaConfiguration: GQLMediaConfigurationResolvers<
  GraphContext,
  Partial<GQLMediaConfiguration>
> = {
  twitter: ({ twitter = {} }) => twitter,
  youtube: ({ youtube = {} }) => youtube,
  giphy: ({ giphy = {} }) => giphy,
  external: () => ({}),
};
