// import * as community from "coral-server/models/community";
import * as tenant from "coral-server/models/tenant";

import { GQLOrganizationTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

export const Organization: GQLOrganizationTypeResolver<tenant.Tenant> = {
  // communities: ({ id }, input, ctx) =>
  //   ctx.loaders.Communities.forOrganization(id, input),
};
