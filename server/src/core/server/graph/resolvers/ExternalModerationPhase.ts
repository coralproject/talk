import * as settings from "coral-server/models/settings";

import { GQLExternalModerationPhaseTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const ExternalModerationPhase: GQLExternalModerationPhaseTypeResolver<settings.ExternalModerationPhase> =
  {
    signingSecret: ({ signingSecrets }) =>
      signingSecrets[signingSecrets.length - 1],
  };
