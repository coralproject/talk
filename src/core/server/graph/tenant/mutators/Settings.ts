import { isNull, omitBy } from "lodash";

import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateOIDCAuthIntegrationInput,
  GQLRemoveOIDCAuthIntegrationInput,
  GQLSettingsInput,
  GQLUpdateOIDCAuthIntegrationInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import {
  createOIDCAuthIntegration,
  regenerateSSOKey,
  removeOIDCAuthIntegration,
  update,
  updateOIDCAuthIntegration,
} from "talk-server/services/tenant";

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
  createOIDCAuthIntegration: (input: GQLCreateOIDCAuthIntegrationInput) =>
    createOIDCAuthIntegration(
      mongo,
      redis,
      tenantCache,
      tenant,
      input.configuration
    ),
  updateOIDCAuthIntegration: (input: GQLUpdateOIDCAuthIntegrationInput) =>
    updateOIDCAuthIntegration(
      mongo,
      redis,
      tenantCache,
      tenant,
      input.id,
      input.configuration
    ),
  removeOIDCAuthIntegration: (input: GQLRemoveOIDCAuthIntegrationInput) =>
    removeOIDCAuthIntegration(mongo, redis, tenantCache, tenant, input.id),
});
