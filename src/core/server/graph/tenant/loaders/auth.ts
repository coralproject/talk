import DataLoader from "dataloader";

import TenantContext from "talk-server/graph/tenant/context";
import { GQLDiscoveredOIDCConfiguration } from "talk-server/graph/tenant/schema/__generated__/types";
import { discoverOIDCConfiguration } from "talk-server/services/tenant";

export default (ctx: TenantContext) => ({
  discoverOIDCConfiguration: new DataLoader<
    string,
    GQLDiscoveredOIDCConfiguration | null
  >(issuers =>
    Promise.all(issuers.map(issuer => discoverOIDCConfiguration(issuer)))
  ),
});
