import { isNull, omitBy } from "lodash";

import TenantContext from "talk-server/graph/tenant/context";
import {
  GQLCreateOIDCAuthIntegrationInput,
  GQLDeleteOIDCAuthIntegrationInput,
  GQLDiscoverOIDCConfigurationInput,
  GQLOIDCConfiguration,
  GQLSettingsInput,
  GQLUpdateOIDCAuthIntegrationInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import {
  createOIDCAuthIntegration,
  deleteOIDCAuthIntegration,
  discoverOIDCConfiguration,
  regenerateSSOKey,
  update,
  updateOIDCAuthIntegration,
} from "talk-server/services/tenant";

export default ({ mongo, redis, tenantCache, tenant }: TenantContext) => ({
  update: (input: GQLSettingsInput): Promise<Tenant | null> =>
    update(mongo, redis, tenantCache, tenant, omitBy(input, isNull)),
  regenerateSSOKey: (): Promise<Tenant | null> =>
    regenerateSSOKey(mongo, redis, tenantCache, tenant),
  discoverOIDCConfiguration: (
    input: GQLDiscoverOIDCConfigurationInput
  ): Promise<GQLOIDCConfiguration> => discoverOIDCConfiguration(input.issuer),
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
