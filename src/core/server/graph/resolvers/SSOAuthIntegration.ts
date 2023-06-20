import * as settings from "coral-server/models/settings";

import { GQLSSOAuthIntegrationResolvers } from "coral-server/graph/schema/__generated__/types";
import { filterFreshSigningSecrets } from "coral-server/models/settings";

import GraphContext from "../context";

function getActiveSSOSigningSecret(keys: settings.SigningSecret[]) {
  return keys.find(filterFreshSigningSecrets());
}

export const SSOAuthIntegration: GQLSSOAuthIntegrationResolvers<
  GraphContext,
  settings.SSOAuthIntegration
> = {
  key: ({ signingSecrets }) => {
    const signingSecret = getActiveSSOSigningSecret(signingSecrets);
    if (signingSecret) {
      return signingSecret.secret;
    }

    return null;
  },
  keyGeneratedAt: ({ signingSecrets }) => {
    const signingSecret = getActiveSSOSigningSecret(signingSecrets);
    if (signingSecret) {
      return signingSecret.createdAt;
    }

    return null;
  },
};
