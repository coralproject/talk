import { Db } from "mongodb";
import uuid from "uuid";

import { DeepPartial, Omit } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import {
  Connection,
  ConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { PartialSettings } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import { communities as collection } from "coral-server/services/mongodb/collections";

import { GQLCommunity } from "coral-server/graph/tenant/schema/__generated__/types";

import { consolidate } from "../helpers/settings";

export interface Community
  extends Omit<GQLCommunity, "settings" | "sites" | "ownSettings"> {
  ownSettings: PartialSettings;
  tenantID: string;
}

export type CreateCommunityInput = Pick<
  Community,
  "name" | "contactEmail" | "url"
>;

export type CommunityConnectionInput = ConnectionInput<Community>;

export async function createCommunity(
  mongo: Db,
  tenant: Tenant,
  input: CreateCommunityInput,
  now = new Date()
) {
  const community: Readonly<Community> = {
    id: uuid.v4(),
    createdAt: now,
    tenantID: tenant.id,
    ownSettings: {
      locale: tenant.ownSettings.locale,
    },
    ...input,
  };

  await collection(mongo).insert(community);
  return community;
}

export type UpdateCommunityInput = Omit<Partial<Community>, "createdAt" | "id">;

export async function updateCommunity(
  mongo: Db,
  tenantID: string,
  id: string,
  update: UpdateCommunityInput
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    { $set: dotize(update) },
    { returnOriginal: false }
  );

  return result.value || null;
}

export type UpdateCommunitySettingsInput = DeepPartial<PartialSettings>;

export async function updateCommunitySettings(
  mongo: Db,
  tenantID: string,
  id: string,
  update: UpdateCommunitySettingsInput
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    {
      $set: dotize({ ownSettings: update }),
    },
    { returnOriginal: false }
  );

  return result.value || null;
}

export async function retrieveCommunity(
  mongo: Db,
  tenantID: string,
  id: string
) {
  return collection(mongo).findOne({ id, tenantID });
}

export async function retrieveManyCommunities(
  mongo: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = collection(mongo).find({
    id: { $in: ids },
    tenantID,
  });

  const communities = await cursor.toArray();

  return ids.map(
    id => communities.find(community => community.id === id) || null
  );
}

export async function retrieveTenantCommunities(mongo: Db, tenantID: string) {
  return collection(mongo)
    .find({ tenantID })
    .toArray();
}

export function retrieveConsolidatedSettings(
  tenant: Tenant,
  community: Community | null
) {
  if (!community) {
    throw new Error("community not found");
  }
  return consolidate(tenant, community);
}

async function retrieveConnection(
  input: CommunityConnectionInput,
  query: Query<Community>
): Promise<Readonly<Connection<Readonly<Community>>>> {
  // Apply the pagination arguments to the query.
  query.orderBy({ createdAt: -1 });
  if (input.after) {
    query.where({ createdAt: { $lt: input.after as Date } });
  }

  // Return a connection.
  return resolveConnection(query, input, action => action.createdAt);
}

export async function retrieveCommunityConnection(
  mongo: Db,
  tenantID: string,
  input: CommunityConnectionInput
): Promise<Readonly<Connection<Readonly<Community>>>> {
  // Create the query.
  const query = new Query(collection(mongo)).where({ tenantID });

  // If a filter is being applied, filter it as well.
  if (input.filter) {
    query.where(input.filter);
  }

  return retrieveConnection(input, query);
}
