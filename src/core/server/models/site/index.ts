import { identity, isNumber } from "lodash";
import { Db, MongoError } from "mongodb";
import uuid from "uuid";

import { Omit } from "coral-common/types";
import { getOrigin } from "coral-server/app/url";
import { DuplicateSiteAllowedOriginError } from "coral-server/errors";
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
  contactEmail: string;
  createdAt: Date;
}

export type CreateSiteInput = Omit<Site, "createdAt" | "id">;

export type SiteConnectionInput = ConnectionInput<Site>;

export function getUrlOrigins(urls: string[]): string[] {
  return urls.map(url => getOrigin(url)).filter(identity) as string[];
}

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

  try {
    await collection(mongo).insertOne(site);
    return site;
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate Story error.
    if (err instanceof MongoError && err.code === 11000) {
      throw new DuplicateSiteAllowedOriginError(
        err,
        null,
        input.allowedDomains
      );
    }

    throw err;
  }
}

export async function retrieveSite(mongo: Db, tenantID: string, id: string) {
  return collection(mongo).findOne({ id, tenantID });
}

export async function retrieveTenantSites(mongo: Db, tenantID: string) {
  const cursor = collection(mongo).find({ tenantID });
  return cursor.toArray();
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

export async function retrieveSiteByOrigin(
  mongo: Db,
  tenantID: string,
  origin: string
) {
  return collection(mongo).findOne({
    tenantID,
    allowedDomains: origin,
  });
}

async function retrieveConnection(
  input: SiteConnectionInput,
  query: Query<Site>
): Promise<Readonly<Connection<Readonly<Site>>>> {
  // Apply the pagination arguments to the query.
  query.orderBy({ name: 1 });
  const skip = isNumber(input.after) ? input.after : 0;
  if (skip) {
    query.after(skip);
  }

  // Return a connection.
  return resolveConnection(query, input, (_, index) => index + skip + 1);
}

export async function retrieveSiteConnection(
  mongo: Db,
  tenantID: string,
  input: SiteConnectionInput
): Promise<Readonly<Connection<Readonly<Site>>>> {
  // Create the query.
  const query = new Query(collection(mongo)).where({ tenantID });

  return retrieveConnection(input, query);
}

export type UpdateSiteInput = Partial<Omit<CreateSiteInput, "tenantID">>;

export async function updateSite(
  mongo: Db,
  tenantID: string,
  id: string,
  input: UpdateSiteInput,
  now = new Date()
) {
  const update = {
    $set: {
      ...input,
      updatedAt: now,
    },
  };
  try {
    const result = await collection(mongo).findOneAndUpdate(
      { id, tenantID },
      update,
      // False to return the updated document instead of the original
      // document.
      { returnOriginal: false }
    );
    return result.value || null;
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate Story error.
    if (err instanceof MongoError && err.code === 11000) {
      throw new DuplicateSiteAllowedOriginError(err, id, input.allowedDomains);
    }

    throw err;
  }
}
