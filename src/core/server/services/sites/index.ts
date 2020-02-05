import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { getOrigin } from "coral-server/app/url";
import {
  createSite,
  CreateSiteInput,
  getUrlOrigins,
  retrieveSiteByOrigin,
  updateSite,
  UpdateSiteInput,
} from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";

type CreateSite = Omit<CreateSiteInput, "tenantID">;

export async function findSiteByURL(mongo: Db, tenantID: string, url: string) {
  const origin = getOrigin(url);
  if (!origin) {
    return null;
  }

  return retrieveSiteByOrigin(mongo, tenantID, origin);
}

export async function create(
  mongo: Db,
  tenant: Tenant,
  input: CreateSite,
  now = new Date()
) {
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
