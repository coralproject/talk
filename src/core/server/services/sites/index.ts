import { getOrigin } from "coral-server/app/url";
import { MongoContext } from "coral-server/data/context";
import {
  createSite,
  CreateSiteInput,
  getURLOrigins,
  retrieveSiteByOrigin,
  updateSite,
  UpdateSiteInput,
} from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";

type CreateSite = Omit<CreateSiteInput, "tenantID">;

export async function findSiteByURL(
  mongo: MongoContext,
  tenantID: string,
  url: string
) {
  const origin = getOrigin(url);
  if (!origin) {
    return null;
  }

  return retrieveSiteByOrigin(mongo, tenantID, origin);
}

function conformURLToOrigins(allowedOrigins?: string[]) {
  if (allowedOrigins) {
    return {
      allowedOrigins: getURLOrigins(allowedOrigins),
    };
  }

  return {};
}

export async function create(
  mongo: MongoContext,
  tenant: Tenant,
  input: CreateSite,
  now = new Date()
) {
  // Create the new site.
  return createSite(
    mongo,
    {
      ...input,
      ...conformURLToOrigins(input.allowedOrigins),
      tenantID: tenant.id,
    },
    now
  );
}

export const update = (
  mongo: MongoContext,
  tenant: Tenant,
  id: string,
  input: UpdateSiteInput,
  now = new Date()
) => {
  // Update the site.
  return updateSite(
    mongo,
    tenant.id,
    id,
    {
      ...input,
      ...conformURLToOrigins(input.allowedOrigins),
    },
    now
  );
};
