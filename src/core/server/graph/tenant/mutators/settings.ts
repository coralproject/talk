import { isNull, omitBy } from "lodash";

import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLDiscoverOIDCConfigurationInput,
  GQLOIDCConfiguration,
  GQLSettingsInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import {
  discoverOIDCConfiguration,
  regenerateSSOKey,
  update,
} from "talk-server/services/tenant";

export default ({ mongo, redis, tenantCache, tenant }: TenantContext) => ({
  update: (input: GQLSettingsInput): Promise<Tenant | null> =>
    update(mongo, redis, tenantCache, tenant, omitBy(input, isNull)),
  regenerateSSOKey: (): Promise<Tenant | null> =>
    regenerateSSOKey(mongo, redis, tenantCache, tenant),
  discoverOIDCConfiguration: (
    input: GQLDiscoverOIDCConfigurationInput
  ): Promise<GQLOIDCConfiguration> => discoverOIDCConfiguration(input.issuer),
});
