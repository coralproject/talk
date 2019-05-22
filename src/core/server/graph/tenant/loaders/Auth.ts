import DataLoader from "dataloader";

import TenantContext from "coral-server/graph/tenant/context";
import { GQLDiscoveredOIDCConfiguration } from "coral-server/graph/tenant/schema/__generated__/types";
import { discoverOIDCConfiguration } from "coral-server/services/tenant";

export default (ctx: TenantContext) => ({
  discoverOIDCConfiguration: new DataLoader<
    string,
    GQLDiscoveredOIDCConfiguration | null
  >(issuers =>
    Promise.all(issuers.map(issuer => discoverOIDCConfiguration(issuer)))
  ),
});
