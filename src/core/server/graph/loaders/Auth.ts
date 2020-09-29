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

// QUESTION: I'd like to do something like this, but i'm unsure the best way to handle ctx here.
// @injectable()
// export class AuthLoader {
//   constructor(@inject(REDIS) private readonly redis: Redis) {}

//   public readonly discoverOIDCConfiguration = new DataLoader<
//     string,
//     GQLDiscoveredOIDCConfiguration | null
//   >(
//     (issuers) =>
//       Promise.all(issuers.map((issuer) => discoverOIDCConfiguration(issuer))),
//     {
//       // Disable caching for the DataLoader if the Context is designed to be
//       // long lived.
//       cache: !ctx.disableCaching,
//     }
//   );

//   public readonly retrieveSSOSigningSecretLastUsedAt = new DataLoader(
//     (kids: string[]) =>
//       retrieveLastUsedAtTenantSSOSigningSecrets(this.redis, ctx.tenant.id, kids)
//   );
// }
