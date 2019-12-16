import TenantContext from "coral-server/graph/tenant/context";
import { Tenant } from "coral-server/models/tenant";
import {
  regenerateSSOKey,
  setFeatureFlag,
  update,
} from "coral-server/services/tenant";

import {
  GQLFeatureFlagSettings,
  GQLSetFeatureFlagInput,
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
  setFeatureFlag: (
    input: GQLSetFeatureFlagInput
  ): Promise<GQLFeatureFlagSettings | null> =>
    setFeatureFlag(mongo, redis, tenantCache, tenant, input),
});
