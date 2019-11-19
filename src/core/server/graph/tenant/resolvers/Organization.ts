import { defaultTo } from "lodash";

import * as tenant from "coral-server/models/tenant";

import { GQLOrganizationTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

export const Organization: GQLOrganizationTypeResolver<tenant.Tenant> = {
  communities: ({ id }, { first, after }, ctx) =>
    ctx.loaders.Communities.connection({
      first: defaultTo(first, 10),
      after,
    }),
};
