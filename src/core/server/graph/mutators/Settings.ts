import GraphContext from "coral-server/graph/context";
import { Tenant } from "coral-server/models/tenant";
import {
  createAnnouncement,
  deleteAnnouncement,
  disableFeatureFlag,
  enableFeatureFlag,
  regenerateSSOKey,
  update,
  updateAnnouncement,
} from "coral-server/services/tenant";

import {
  GQLCreateAnnouncementInput,
  GQLFEATURE_FLAG,
  GQLUpdateAnnouncementInput,
  GQLUpdateSettingsInput,
} from "coral-server/graph/schema/__generated__/types";

export const Settings = ({
  mongo,
  redis,
  tenantCache,
  tenant,
  config,
  now,
}: GraphContext) => ({
  update: (input: GQLUpdateSettingsInput): Promise<Tenant | null> =>
    update(mongo, redis, tenantCache, config, tenant, input.settings),
  regenerateSSOKey: (): Promise<Tenant | null> =>
    regenerateSSOKey(mongo, redis, tenantCache, tenant, now),
  enableFeatureFlag: (flag: GQLFEATURE_FLAG) =>
    enableFeatureFlag(mongo, redis, tenantCache, tenant, flag),
  disableFeatureFlag: (flag: GQLFEATURE_FLAG) =>
    disableFeatureFlag(mongo, redis, tenantCache, tenant, flag),
  createAnnouncement: (input: GQLCreateAnnouncementInput) =>
    createAnnouncement(mongo, redis, tenantCache, tenant, input),
  updateAnnouncement: (input: GQLUpdateAnnouncementInput) =>
    updateAnnouncement(mongo, redis, tenantCache, tenant, input),
  deleteAnnouncement: () =>
    deleteAnnouncement(mongo, redis, tenantCache, tenant),
});
