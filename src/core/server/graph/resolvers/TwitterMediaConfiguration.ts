import {
  GQLTwitterMediaConfiguration,
  GQLTwitterMediaConfigurationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export const TwitterMediaConfiguration: RequiredResolver<
  GQLTwitterMediaConfigurationResolvers<
    GraphContext,
    Partial<GQLTwitterMediaConfiguration>
  >
> = {
  enabled: ({ enabled = false }) => enabled,
};
