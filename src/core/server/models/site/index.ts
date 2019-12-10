import { Db } from "mongodb";
import uuid from "uuid";

import { Omit } from "coral-common/types";
import { TenantResource } from "coral-server/models/tenant";
import { sites as collection } from "coral-server/services/mongodb/collections";

export interface Site extends TenantResource {
  readonly id: string;
  name: string;
  url: string;
  allowedDomains: [string];
  createdAt: Date;
  communityID: string;
}

export type CreateSiteInput = Omit<Site, "createdAt" | "id">;

/**
 * create will create a new Site.
 *
 * @param mongo the MongoDB connection used to create the Site.
 * @param input the customizable parts of the Site available during creation
 */
export async function createSite(
  mongo: Db,
  input: CreateSiteInput,
  now = new Date()
) {
  const site = {
    id: uuid.v4(),
    createdAt: now,
    ...input,
  };

  await collection(mongo).insertOne(site);
  return site;
}
