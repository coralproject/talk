import * as settings from "coral-server/models/settings";

import { GQLExternalModerationPhaseResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const ExternalModerationPhase: GQLExternalModerationPhaseResolvers<
  GraphContext,
  settings.ExternalModerationPhase
> = {
  signingSecret: ({ signingSecrets }) =>
    signingSecrets[signingSecrets.length - 1],
};
