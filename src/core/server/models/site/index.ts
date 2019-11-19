import { isNull } from "lodash";
import { Db } from "mongodb";
import uuid from "uuid";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { DeepPartial, Omit } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import { Community } from "coral-server/models/community";
import {
  Connection,
  ConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { PartialSettings } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import { sites as collection } from "coral-server/services/mongodb/collections";

import { GQLSite } from "coral-server/graph/tenant/schema/__generated__/types";

import { consolidate } from "../helpers/settings";

export interface Site
  extends Omit<GQLSite, "consolidatedSettings" | "community"> {
  settings: PartialSettings;
  communityID: string;
  tenantID: string;
  locale: LanguageCode;
}

export type CreateSiteInput = Pick<
  Site,
  "name" | "contactEmail" | "url" | "locale" | "domains"
>;

export type SiteConnectionInput = ConnectionInput<Site>;
export async function createSite(
  mongo: Db,
  tenantID: string,
  communityID: string,
  input: CreateSiteInput,
  now = new Date()
) {
  const site: Readonly<Site> = {
    id: uuid.v4(),
    createdAt: now,
    tenantID,
    communityID,
    settings: {},
    ...input,
  };

  await collection(mongo).insert(site);
  return site;
}

export type UpdateSiteInput = Omit<
  Partial<Site>,
  "createdAt" | "id" | "locale"
>;

export async function updateSite(
  mongo: Db,
  tenantID: string,
  id: string,
  update: UpdateSiteInput
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    { $set: dotize(update) },
    { returnOriginal: false }
  );

  return result.value || null;
}

export type UpdateSiteSettingsInput = DeepPartial<PartialSettings>;

export async function updateSiteSettings(
  mongo: Db,
  tenantID: string,
  id: string,
  update: UpdateSiteSettingsInput
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    {
      $set: dotize({ settings: update }),
    },
    { returnOriginal: false }
  );

  return result.value || null;
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

  // If a filter is being applied, filter it as well.
  if (input.filter) {
    query.where(input.filter);
  }

  return retrieveConnection(input, query);
}

export function retrieveManyConsolidatedSettings(
  tenant: Tenant,
  ids: string[],
  communities: (Community | null)[],
  sites: (Site | null)[]
) {
  return ids.map(id => {
    const site = sites.find(s => !isNull(s) && s.id === id);
    if (!site) {
      return null;
    }
    const community = site
      ? communities.find(c => !isNull(c) && c.id === site.communityID)
      : null;
    if (!community) {
      return null;
    }
    return consolidate(tenant, community, site);
  });
}
