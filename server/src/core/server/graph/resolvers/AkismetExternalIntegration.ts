import * as settings from "coral-server/models/settings";

import { GQLAkismetExternalIntegrationTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const AkismetExternalIntegration: GQLAkismetExternalIntegrationTypeResolver<settings.AkismetExternalIntegration> =
  {
    ipBased: ({ ipBased = true }) => ipBased,
  };
