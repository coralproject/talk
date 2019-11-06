import * as settings from "coral-server/models/settings";

import { GQLSSOAuthIntegrationTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

function getActiveSSOKey(keys: settings.SSOKey[]) {
  return keys.find(
    key => Boolean(key.secret) && !key.deletedAt && !key.deprecateAt
  );
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
