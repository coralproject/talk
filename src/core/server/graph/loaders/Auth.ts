import DataLoader from "dataloader";

import GraphContext from "coral-server/graph/context";
import { retrieveLastUsedAtTenantSSOSigningSecrets } from "coral-server/models/tenant";
import { discoverOIDCConfiguration } from "coral-server/services/tenant";

import { GQLDiscoveredOIDCConfiguration } from "coral-server/graph/schema/__generated__/types";

export default (ctx: GraphContext) => ({
  discoverOIDCConfiguration: new DataLoader<
    string,
    GQLDiscoveredOIDCConfiguration | null
  >(
    (issuers) =>
      Promise.all(issuers.map((issuer) => discoverOIDCConfiguration(issuer))),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  retrieveSSOSigningSecretLastUsedAt: new DataLoader((kids: string[]) =>
    retrieveLastUsedAtTenantSSOSigningSecrets(ctx.redis, ctx.tenant.id, kids)
  ),
});
