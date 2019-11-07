import TenantContext from "coral-server/graph/tenant/context";
import { GQLUpdateSettingsInput } from "coral-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "coral-server/models/tenant";
import { regenerateSSOKey, update } from "coral-server/services/tenant";

export const Settings = ({
  mongo,
  redis,
  tenantCache,
  tenant,
  config,
  now,
}: TenantContext) => ({
  update: (input: GQLUpdateSettingsInput): Promise<Tenant | null> =>
    update(mongo, redis, tenantCache, config, tenant, input.settings),
  regenerateSSOKey: (): Promise<Tenant | null> =>
    regenerateSSOKey(mongo, redis, tenantCache, tenant, now),
});
