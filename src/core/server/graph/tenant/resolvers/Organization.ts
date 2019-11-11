import * as community from "coral-server/models/community";
import * as tenant from "coral-server/models/tenant";

import { GQLOrganizationTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

export const Organization: GQLOrganizationTypeResolver<tenant.Tenant> = {
  communities: (s, input, ctx) =>
    community.retrieveTenantCommunities(ctx.mongo, ctx.tenant.id),
};
