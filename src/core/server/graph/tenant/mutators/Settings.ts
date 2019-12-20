import TenantContext from "coral-server/graph/tenant/context";
import { Tenant } from "coral-server/models/tenant";
import {
  disableFeatureFlag,
  enableFeatureFlag,
  regenerateSSOKey,
  update,
} from "coral-server/services/tenant";

import {
  GQLFEATURE_FLAG,
  GQLUpdateSettingsInput,
} from "coral-server/graph/tenant/schema/__generated__/types";

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
  enableFeatureFlag: (flag: GQLFEATURE_FLAG) =>
    enableFeatureFlag(mongo, redis, tenantCache, tenant, flag),
  disableFeatureFlag: (flag: GQLFEATURE_FLAG) =>
    disableFeatureFlag(mongo, redis, tenantCache, tenant, flag),
});
