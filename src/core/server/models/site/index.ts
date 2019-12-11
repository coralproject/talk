import { Db } from "mongodb";
import uuid from "uuid";

import { Omit } from "coral-common/types";
import {
  Connection,
  ConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { TenantResource } from "coral-server/models/tenant";
import { sites as collection } from "coral-server/services/mongodb/collections";

export interface Site extends TenantResource {
  readonly id: string;
  name: string;
  url: string;
  allowedDomains: string[];
  createdAt: Date;
  communityID: string;
}

export type CreateSiteInput = Omit<Site, "createdAt" | "id">;

export type SiteConnectionInput = ConnectionInput<Site>;

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

export async function retrieveSite(mongo: Db, tenantID: string, id: string) {
  return collection(mongo).findOne({ id, tenantID });
}

export async function retrieveManySites(
  mongo: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = collection(mongo).find({
    id: { $in: ids },
    tenantID,
  });

  const sites = await cursor.toArray();

  return ids.map(id => sites.find(site => site.id === id) || null);
}

export async function retrieveCommunitySites(
  mongo: Db,
  tenantID: string,
  communityID: string
) {
  return collection(mongo)
    .find({ communityID, tenantID })
    .toArray();
}

async function retrieveConnection(
  input: SiteConnectionInput,
  query: Query<Site>
): Promise<Readonly<Connection<Readonly<Site>>>> {
  // Apply the pagination arguments to the query.
  query.orderBy({ createdAt: -1 });
  if (input.after) {
    query.where({ createdAt: { $lt: input.after as Date } });
  }

  // Return a connection.
  return resolveConnection(query, input, action => action.createdAt);
}

export async function retrieveSiteConnection(
  mongo: Db,
  tenantID: string,
  input: SiteConnectionInput
): Promise<Readonly<Connection<Readonly<Site>>>> {
  // Create the query.
  const query = new Query(collection(mongo)).where({ tenantID });

  // // If a filter is being applied, filter it as well.
  // if (input.filter) {
  //   query.where(input.filter);
  // }

  return retrieveConnection(input, query);
}
