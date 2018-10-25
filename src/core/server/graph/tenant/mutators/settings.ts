import { isNull, omitBy } from "lodash";

import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateOIDCAuthIntegrationInput,
  GQLDeleteOIDCAuthIntegrationInput,
  GQLSettingsInput,
  GQLUpdateOIDCAuthIntegrationInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import {
  createOIDCAuthIntegration,
  deleteOIDCAuthIntegration,
  regenerateSSOKey,
  update,
  updateOIDCAuthIntegration,
} from "talk-server/services/tenant";

export default ({ mongo, redis, tenantCache, tenant }: TenantContext) => ({
  update: (input: GQLSettingsInput): Promise<Tenant | null> =>
    update(mongo, redis, tenantCache, tenant, omitBy(input, isNull)),
  regenerateSSOKey: (): Promise<Tenant | null> =>
    regenerateSSOKey(mongo, redis, tenantCache, tenant),
  createOIDCAuthIntegration: (
    input: GQLCreateOIDCAuthIntegrationInput
  ): Promise<Tenant | null> =>
    createOIDCAuthIntegration(
      mongo,
      redis,
      tenantCache,
      tenant,
      input.configuration
    ),
  updateOIDCAuthIntegration: (
    input: GQLUpdateOIDCAuthIntegrationInput
  ): Promise<Tenant | null> =>
    updateOIDCAuthIntegration(
      mongo,
      redis,
      tenantCache,
      tenant,
      input.id,
      input.configuration
    ),
  deleteOIDCAuthIntegration: (
    input: GQLDeleteOIDCAuthIntegrationInput
  ): Promise<Tenant | null> =>
    deleteOIDCAuthIntegration(mongo, redis, tenantCache, tenant, input.id),
});
