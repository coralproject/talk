import DataLoader from "dataloader";

import GraphContext from "coral-server/graph/context";
import { GQLDiscoveredOIDCConfiguration } from "coral-server/graph/schema/__generated__/types";
import { discoverOIDCConfiguration } from "coral-server/services/tenant";

export default (ctx: GraphContext) => ({
  discoverOIDCConfiguration: new DataLoader<
    string,
    GQLDiscoveredOIDCConfiguration | null
  >(
    issuers =>
      Promise.all(issuers.map(issuer => discoverOIDCConfiguration(issuer))),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
});
