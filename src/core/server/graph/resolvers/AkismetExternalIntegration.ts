import * as settings from "coral-server/models/settings";

import { GQLAkismetExternalIntegrationResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const AkismetExternalIntegration: GQLAkismetExternalIntegrationResolvers<
  GraphContext,
  settings.AkismetExternalIntegration
> = {
  ipBased: ({ ipBased = true }) => ipBased,
};
