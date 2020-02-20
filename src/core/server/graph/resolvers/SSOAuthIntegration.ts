import * as settings from "coral-server/models/settings";

import { GQLSSOAuthIntegrationTypeResolver } from "coral-server/graph/schema/__generated__/types";

function getActiveSSOKey(keys: settings.Secret[]) {
  // Any key that has been rotated cannot be the active key.
  return keys.find(key => !key.rotatedAt);
}

export const SSOAuthIntegration: GQLSSOAuthIntegrationTypeResolver<
  settings.SSOAuthIntegration
> = {
  key: ({ keys }) => {
    const key = getActiveSSOKey(keys);
    if (key) {
      return key.secret;
    }

    return null;
  },
  keyGeneratedAt: ({ keys }) => {
    const key = getActiveSSOKey(keys);
    if (key) {
      return key.createdAt;
    }

    return null;
  },
};
