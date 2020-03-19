import * as settings from "coral-server/models/settings";

import { GQLSSOAuthIntegrationTypeResolver } from "coral-server/graph/schema/__generated__/types";
import { filterFreshSecrets } from "coral-server/models/settings";

function getActiveSSOKey(keys: settings.Secret[]) {
  return keys.find(filterFreshSecrets());
}

export const SSOAuthIntegration: GQLSSOAuthIntegrationTypeResolver<
  settings.SSOAuthIntegration
> = {
  key: ({ signingSecrets }) => {
    const signingSecret = getActiveSSOKey(signingSecrets);
    if (signingSecret) {
      return signingSecret.secret;
    }

    return null;
  },
  keyGeneratedAt: ({ signingSecrets }) => {
    const signingSecret = getActiveSSOKey(signingSecrets);
    if (signingSecret) {
      return signingSecret.createdAt;
    }

    return null;
  }
};
