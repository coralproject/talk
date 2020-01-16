import { Redis } from "ioredis";
import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { getOrigin } from "coral-server/app/url";
import { Config } from "coral-server/config";
import {
  createSite,
  CreateSiteInput,
  getUrlOrigins,
  retrieveSiteByDomain,
  updateSite,
  UpdateSiteInput,
} from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";
import { update as updateTenant } from "coral-server/services/tenant";

import TenantCache from "../tenant/cache";

type CreateSite = Omit<CreateSiteInput, "tenantID">;

export async function findSiteByURL(mongo: Db, tenantID: string, url: string) {
  const testURL = getOrigin(url);
  if (!testURL) {
    return null;
  }
  return retrieveSiteByDomain(mongo, tenantID, testURL);
}

export async function create(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  config: Config,
  tenant: Tenant,
  input: CreateSite,
  now = new Date()
) {
  if (!tenant.multisite) {
    await updateTenant(mongo, redis, cache, config, tenant, {
      multisite: true,
    });
  }
  input.allowedDomains = getUrlOrigins(input.allowedDomains);
  return createSite(
    mongo,
    {
      ...input,
      tenantID: tenant.id,
    },
    now
  );
}

export async function update(
  mongo: Db,
  tenant: Tenant,
  id: string,
  input: UpdateSiteInput,
  now = new Date()
) {
  return updateSite(mongo, tenant.id, id, input, now);
}
