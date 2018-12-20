import { isNull, omitBy } from "lodash";

import TenantContext from "talk-server/graph/tenant/context";
import { GQLSettingsInput } from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import { regenerateSSOKey, update } from "talk-server/services/tenant";

export const Settings = ({
  mongo,
  redis,
  tenantCache,
  tenant,
}: TenantContext) => ({
  update: (input: GQLSettingsInput): Promise<Tenant | null> =>
    update(mongo, redis, tenantCache, tenant, omitBy(input, isNull)),
  regenerateSSOKey: (): Promise<Tenant | null> =>
    regenerateSSOKey(mongo, redis, tenantCache, tenant),
});
